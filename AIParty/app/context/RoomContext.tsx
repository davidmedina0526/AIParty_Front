// app/context/RoomContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  db, storage,
  dbRef, set, onValue, get,
  storageRef, uploadBytes, getDownloadURL
} from '../services/firebase';
import { v4 as uuidv4 } from 'uuid';

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
  setTimeLimit: (t: number) => void;
  setTotalRounds: (r: number) => void;

  createRoom: () => Promise<void>;
  joinRoom:   () => Promise<void>;
  joinRoomWithInfo: (
    roomCode: string,
    uId: string,
    uName: string,
    uPhoto: string
  ) => Promise<void>;
  startRound: () => Promise<void>;
  submitPhoto: (base64: string) => Promise<void>;
  submitVote:  (targetUserId: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextData>({} as any);

const RoomProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState(() => uuidv4());
  const [username, setUsername]   = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [players, setPlayers]     = useState<Player[]>([]);
  const [photos, setPhotos]       = useState<Photo[]>([]);
  const [votes, setVotes]         = useState<Record<string,Vote>>({});
  const [scores, setScores]       = useState<Score[]>([]);
  const [challenge, setChallenge] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds]   = useState(4);
  const [timeLimit, setTimeLimit]       = useState(30);
  const [category, setCategory]         = useState('Family friendly');

  const STATIC: Record<string,string[]> = {
    'Family friendly': ['Selfie con tu bebida favorita','Foto de un abrazo de grupo','Captura a alguien bailando'],
    'Plan tranqui':     ['Foto relajada en el sofá','Toma una foto con mascota','Captura un libro que estés leyendo'],
    'Al siguiente nivel':['Foto haciendo acrobacia suave','Captura un salto al aire','Recrea una escena de película'],
    'Pongámonos picantes...':['Selfie con gesto coqueto','Foto con algún accesorio rojo','Captura mirada intensa']
  };

  useEffect(() => {
    if (!roomId) return;
    const pRef  = dbRef(db, `rooms/${roomId}/players`);
    const phRef = dbRef(db, `rooms/${roomId}/photos`);
    const vRef  = dbRef(db, `rooms/${roomId}/votes`);
    const sRef  = dbRef(db, `rooms/${roomId}/scores`);
    const cRef  = dbRef(db, `rooms/${roomId}/challenge`);
    const rRef  = dbRef(db, `rooms/${roomId}/round`);

    onValue(pRef, snap => setPlayers(snap.val() ? Object.values(snap.val()) : []));
    onValue(phRef,snap => setPhotos  (snap.val() ? Object.values(snap.val()) : []));
    onValue(vRef, snap => setVotes   (snap.val() || {}));
    onValue(sRef, snap => {
      const data = snap.val() || {};
      setScores(Object.values(data));
    });
    onValue(cRef, snap => setChallenge(snap.val() || ''));
    onValue(rRef, snap => {
      const v = snap.val();
      if (v !== null) setCurrentRound(v);
    });
  }, [roomId]);

  const createRoom = async () => {
    const id = uuidv4();
    setRoomId(id);
    await set(dbRef(db, `rooms/${id}`), {
      players:{}, photos:{}, votes:{}, scores:{},
      challenge:'', round:1,
      totalRounds, timeLimit, category
    });
  };

  const joinRoom = async () => {
    if (!roomId) return;
    await set(dbRef(db, `rooms/${roomId}/players/${userId}`), { userId, username, userPhoto });
  };

  const joinRoomWithInfo = async (
    rCode: string,
    uId: string,
    uName: string,
    uPhoto: string
  ) => {
    setRoomId(rCode);
    setUserId(uId);
    setUsername(uName);
    setUserPhoto(uPhoto);
    await set(dbRef(db, `rooms/${rCode}/players/${uId}`), {
      userId: uId,
      username: uName,
      userPhoto: uPhoto
    });
  };

  const startRound = async () => {
    if (!roomId) return;
    const list = STATIC[category] || STATIC['Family friendly'];
    const reto = list[Math.floor(Math.random()*list.length)];
    await set(dbRef(db, `rooms/${roomId}/challenge`), reto);
    await set(dbRef(db, `rooms/${roomId}/round`), currentRound + 1);
    await set(dbRef(db, `rooms/${roomId}/photos`), {});
    await set(dbRef(db, `rooms/${roomId}/votes`), {});
    await set(dbRef(db, `rooms/${roomId}/scores`), {});
  };

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

  const submitVote = async (targetUserId: string) => {
    if (!roomId) return;
    await set(dbRef(db, `rooms/${roomId}/votes/${userId}`), {
      voterId: userId,
      targetUserId
    });
    const snap = await get(dbRef(db, `rooms/${roomId}/votes`));
    const all: Record<string,Vote> = snap.val() || {};
    const tally: Record<string,number> = {};
    Object.values(all).forEach((v:any) => {
      tally[v.targetUserId] = (tally[v.targetUserId]||0) + 1;
    });
    const sc: Score[] = Object.entries(tally).map(([uid,pts]) => {
      const p = players.find(x => x.userId === uid);
      return { userId: uid, votes: pts, username: p?.username||'', userPhoto: p?.userPhoto||'' };
    });
    const mapObj = Object.fromEntries(sc.map(s => [s.userId, s]));
    await set(dbRef(db, `rooms/${roomId}/scores`), mapObj);
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
      totalRounds, timeLimit, category,
      setCategory, setTimeLimit, setTotalRounds,
      createRoom, joinRoom, joinRoomWithInfo,
      startRound, submitPhoto, submitVote
    }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
export const useRoom = () => useContext(RoomContext);
