// app/context/RoomContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import {
  db,
  dbRef, set, onValue, get,
  storage, storageRef, uploadBytes, uploadString, getDownloadURL
} from '../../src/services/firebase';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

export type Player = { userId: string; username: string; userPhoto: string };
export type Photo  = { userId: string; photoUrl: string; username: string; userPhoto: string };
export type Vote   = { voterId: string; targetUserId: string };
export type Score  = { userId: string; votes: number; username: string; userPhoto: string };

export interface RoomContextData {
  roomId: string;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: (n: string) => void;
  userPhoto: string;
  setUserPhoto: (u: string) => void;

  players: Player[];
  photos: Photo[];
  votes: Record<string, Vote>;
  scores: Score[];

  challenge: string;
  currentRound: number;
  setCurrentRound: React.Dispatch<React.SetStateAction<number>>;

  totalRounds: number;
  timeLimit: number;
  category: string;
  setCategory: (c: string) => void;

  createRoom: (opts: {
    totalRounds: number;
    timeLimit: number;
    category: string;
  }) => Promise<void>;

  joinRoom: () => Promise<void>;
  joinRoomWithInfo: (
    roomCode: string,
    uId: string,
    uName: string,
    uPhoto: string
  ) => Promise<void>;
  startRound: () => Promise<void>;
  submitPhoto: (base64: string) => Promise<void>;
  submitPhotoFromUri: (uri: string) => Promise<string | undefined>;
  submitVote: (targetUserId: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextData>({} as any);

const RoomProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [roomId, setRoomId]             = useState('');
  const [userId, setUserId]             = useState(() => uuidv4());
  const [username, setUsername]         = useState('');
  const [userPhoto, setUserPhoto]       = useState('');
  const [players, setPlayers]           = useState<Player[]>([]);
  const [photos, setPhotos]             = useState<Photo[]>([]);
  const [votes, setVotes]               = useState<Record<string,Vote>>({});
  const [scores, setScores]             = useState<Score[]>([]);
  const [challenge, setChallenge]       = useState('');
  const [currentRound, setCurrentRound] = useState(1);

  const [totalRounds, _setTotalRounds] = useState(4);
  const [timeLimit, _setTimeLimit]     = useState(30);
  const [category, _setCategory]       = useState('Family friendly');

  // Leer la API key desde app.json → extra
  const manifest = Constants.manifest ?? (Constants as any).expoConfig;
  const apiKey = manifest?.extra?.GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    console.warn('⚠️ No se encontró GEMINI_API_KEY en app.json → extra');
  }

  // Cliente OpenAI/Gemini
  const openai = new OpenAI({
    apiKey: apiKey || '',
    ...(Platform.OS === 'web' ? { dangerouslyAllowBrowser: true } : {})
  });

  // Listeners Firebase
  useEffect(() => {
    if (!roomId) return;
    const pRef  = dbRef(db, `rooms/${roomId}/players`);
    const phRef = dbRef(db, `rooms/${roomId}/photos`);
    const vRef  = dbRef(db, `rooms/${roomId}/votes`);
    const sRef  = dbRef(db, `rooms/${roomId}/scores`);
    const cRef  = dbRef(db, `rooms/${roomId}/challenge`);
    const rRef  = dbRef(db, `rooms/${roomId}/round`);

    onValue(pRef,  snap => setPlayers(snap.val() ? Object.values(snap.val()) : []));
    onValue(phRef, snap => setPhotos  (snap.val() ? Object.values(snap.val()) : []));
    onValue(vRef,  snap => setVotes   (snap.val() || {}));
    onValue(sRef,  snap => setScores(Object.values(snap.val() || {})));
    onValue(cRef,  snap => setChallenge(snap.val() || ''));
    onValue(rRef,  snap => {
      const v = snap.val();
      if (v !== null) setCurrentRound(v);
    });
  }, [roomId]);

  // Crear sala
  const createRoom = async (opts: {
    totalRounds: number;
    timeLimit: number;
    category: string;
  }) => {
    const id = uuidv4();
    setRoomId(id);
    _setTotalRounds(opts.totalRounds);
    _setTimeLimit(opts.timeLimit);
    _setCategory(opts.category);
    await set(dbRef(db, `rooms/${id}`), {
      players: {}, photos: {}, votes: {}, scores: {},
      challenge:'', round:1,
      totalRounds: opts.totalRounds,
      timeLimit: opts.timeLimit,
      category: opts.category
    });
  };

  // Unirse sin info adicional
  const joinRoom = async () => {
    if (!roomId) return;
    await set(dbRef(db, `rooms/${roomId}/players/${userId}`), {
      userId, username, userPhoto
    });
  };

  // Unirse con nombre y foto
  const joinRoomWithInfo = async (
    rCode: string, uId: string, uName: string, uPhoto: string
  ) => {
    setRoomId(rCode);
    setUserId(uId);
    setUsername(uName);
    setUserPhoto(uPhoto);
    await set(dbRef(db, `rooms/${rCode}/players/${uId}`), {
      userId: uId, username: uName, userPhoto: uPhoto
    });
  };

  // Retos estáticos (fallback)
  const STATIC: Record<string,string[]> = {
    'Family friendly': ['Selfie con tu bebida favorita','Foto de un abrazo de grupo','Captura a alguien bailando'],
    'Plan tranqui':     ['Foto relajada en el sofá','Toma una foto con mascota','Captura un libro que estés leyendo'],
    'Al siguiente nivel':['Foto haciendo acrobacia suave','Captura un salto al aire','Recrea una escena de película'],
    'Pongámonos picantes...':['Selfie con gesto coqueto','Foto con algún accesorio rojo','Captura mirada intensa']
  };

  // Iniciar ronda con IA + limpieza
  const startRound = async () => {
    if (!roomId) return;

    // Generar prompt y pedir a Gemini
    const prompt = `Crea un reto de fotografía para la categoría "${category}" en la ronda ${currentRound}.`;
    let retoIA = '';
    try {
      const res = await openai.responses.create({
        model: "gpt-4.1",
        input: prompt,
      });
      retoIA = res.output_text.trim();
    } catch (e) {
      console.warn('Error IA, usando reto estático:', e);
      const list = STATIC[category] || STATIC['Family friendly'];
      retoIA = list[Math.floor(Math.random()*list.length)];
    }

    // Guardar reto y limpiar datos
    await set(dbRef(db, `rooms/${roomId}/challenge`), retoIA);
    await set(dbRef(db, `rooms/${roomId}/round`), currentRound + 1);
    await set(dbRef(db, `rooms/${roomId}/photos`), {});
    await set(dbRef(db, `rooms/${roomId}/votes`), {});
    await set(dbRef(db, `rooms/${roomId}/scores`), {});
  };

  // Subir foto Base64
  const submitPhoto = async (base64: string) => {
    if (!roomId) return;
    const res  = await fetch(base64);
    const blob = await res.blob();
    const path = `photos/${roomId}/${userId}.jpg`;
    const ref  = storageRef(storage, path);
    await uploadBytes(ref, blob);
    const url  = await getDownloadURL(ref);
    await set(dbRef(db, `rooms/${roomId}/photos/${userId}`), {
      userId, username, userPhoto, photoUrl: url
    });
  };

  // Subir foto desde URI
  const submitPhotoFromUri = async (uri: string) => {
    if (!roomId) return;
    const b64     = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const dataUrl = `data:image/jpeg;base64,${b64}`;
    const path    = `photos/${roomId}/${userId}.jpg`;
    const ref     = storageRef(storage, path);
    await uploadString(ref, dataUrl, 'data_url');
    const url     = await getDownloadURL(ref);
    await set(dbRef(db, `rooms/${roomId}/photos/${userId}`), {
      userId, username, userPhoto, photoUrl: url
    });
    return url;
  };

  // Votar y recalcular puntuaciones
  const submitVote = async (targetUserId: string) => {
    if (!roomId) return;
    await set(dbRef(db, `rooms/${roomId}/votes/${userId}`), {
      voterId: userId, targetUserId
    });
    const snap = await get(dbRef(db, `rooms/${roomId}/votes`));
    const all  = (snap.val() || {}) as Record<string, Vote>;
    const tally: Record<string,number> = {};
    Object.values(all).forEach(v => {
      tally[v.targetUserId] = (tally[v.targetUserId]||0) + 1;
    });
    const sc: Score[] = Object.entries(tally).map(([uid,pts]) => {
      const p = players.find(x => x.userId === uid);
      return { userId: uid, votes: pts, username: p?.username||'', userPhoto: p?.userPhoto||'' };
    });
    await set(dbRef(db, `rooms/${roomId}/scores`),
      Object.fromEntries(sc.map(s => [s.userId, s]))
    );
  };

  return (
    <RoomContext.Provider value={{
      roomId, setRoomId,
      userId, setUserId,
      username, setUsername,
      userPhoto, setUserPhoto,
      players, photos, votes, scores,
      challenge,
      currentRound, setCurrentRound,
      totalRounds, timeLimit, category, setCategory: _setCategory,
      createRoom,
      joinRoom,
      joinRoomWithInfo,
      startRound,
      submitPhoto,
      submitPhotoFromUri,
      submitVote
    }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
export const useRoom = () => useContext(RoomContext);
