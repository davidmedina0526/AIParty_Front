// app/context/RoomContext.tsx

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
  db,
  dbRef, set, onValue, get,
  storage, storageRef, uploadBytes, uploadString, getDownloadURL
} from '../../src/services/firebase';
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
  roundStartTime: number;
  category: string;
  setCategory: (c: string) => void;

  advanceRound: () => Promise<void>;
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

  registerForPushNotifications: () => Promise<string | undefined>;
  sendUserJoinedNotification: (newUsername: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextData>({} as any);

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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

  const [totalRounds, _setTotalRounds]   = useState(4);
  const [timeLimit, _setTimeLimit]       = useState(30);
  const [roundStartTime, _setRoundStart] = useState<number>(0);
  const [category, _setCategory]         = useState('Family friendly');

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener     = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    registerForPushNotifications();
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {});
    responseListener.current     = Notifications.addNotificationResponseReceivedListener(() => {});
    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const prevPlayersRef = useRef<Player[]>([]);

  useEffect(() => {
    if (!roomId) return;
    const pRef = dbRef(db, `rooms/${roomId}/players`);
    return onValue(pRef, snap => {
      const newPlayers = snap.val() ? Object.values(snap.val()) as Player[] : [];
      const prevPlayers = prevPlayersRef.current;
      if (
        Platform.OS !== 'web' &&
        prevPlayers.length > 0 &&
        newPlayers.length > prevPlayers.length
      ) {
        const joined = newPlayers.find(p => !prevPlayers.some(old => old.userId === p.userId));
        if (joined) sendUserJoinedNotification(joined.username);
      }
      prevPlayersRef.current = newPlayers;
      setPlayers(newPlayers);
    });
  }, [roomId]);

  const registerForPushNotifications = async (): Promise<string|undefined> => {
    if (!Device.isDevice) {
      Alert.alert('Error', 'Debes usar un dispositivo físico para notificaciones push.');
      return;
    }
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permiso denegado', 'No se otorgaron permisos para recibir notificaciones.');
      return;
    }
    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  };

  const sendUserJoinedNotification = async (newUsername: string) => {
    const token = await registerForPushNotifications();
    if (!token) return;
    const message = {
      to: token,
      sound: 'default',
      title: 'Nuevo jugador',
      body: `${newUsername} se ha unido a la sala`,
      data: { type: 'player_joined', username: newUsername },
    };
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  const manifest = Constants.manifest ?? (Constants as any).expoConfig;
  const apiKey = manifest?.extra?.GEMINI_API_KEY as string;
  if (!apiKey) console.warn('⚠️ No se encontró GEMINI_API_KEY en app.json → extra');

  useEffect(() => {
    if (!roomId) return;
    const pRef   = dbRef(db, `rooms/${roomId}/players`);
    const phRef  = dbRef(db, `rooms/${roomId}/photos`);
    const vRef   = dbRef(db, `rooms/${roomId}/votes`);
    const sRef   = dbRef(db, `rooms/${roomId}/scores`);
    const cRef   = dbRef(db, `rooms/${roomId}/challenge`);
    const rRef   = dbRef(db, `rooms/${roomId}/round`);
    const rsRef  = dbRef(db, `rooms/${roomId}/roundStartTime`);

    onValue(pRef,  snap => setPlayers(snap.val() ? Object.values(snap.val()) : []));
    onValue(phRef, snap => setPhotos  (snap.val() ? Object.values(snap.val()) : []));
    onValue(vRef,  snap => setVotes   (snap.val() || {}));
    onValue(sRef,  snap => setScores(Object.values(snap.val() || {})));
    onValue(cRef,  snap => setChallenge(snap.val() || ''));
    onValue(rRef,  snap => {
      const v = snap.val(); if (v !== null) setCurrentRound(v);
    });
    onValue(rsRef, snap => {
      const t = snap.val(); if (t !== null) _setRoundStart(t);
    });
  }, [roomId]);

  const createRoom = async (opts: { totalRounds: number; timeLimit: number; category: string }) => {
    const id = uuidv4();
    const now = Date.now();

    setRoomId(id);
    _setTotalRounds(opts.totalRounds);
    _setTimeLimit(opts.timeLimit);
    _setCategory(opts.category);
    _setRoundStart(now);

    // crea la sala con roundStartTime y sin reto aún
    await set(dbRef(db, `rooms/${id}`), {
      players: {}, photos: {}, votes: {}, scores: {},
      challenge: '', round: 1,
      totalRounds: opts.totalRounds,
      timeLimit: opts.timeLimit,
      category: opts.category,
      roundStartTime: now
    });

    // genera y guarda el reto inicial (primera ronda) inmediatamente
    const prompt = `Crea un reto de fotografía para la categoría "${opts.category}" , indica **únicamente en una sola frase** cómo debe ser la fotografía.`;
    let retoIA = '';
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await res.json();
      retoIA = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
              || 'Reto por defecto';
    } catch {
      retoIA = 'Reto por defecto';
    }
    await set(dbRef(db, `rooms/${id}/challenge`), retoIA);
  };

  const joinRoom = async () => {
    if (!roomId) return;
    await set(dbRef(db, `rooms/${roomId}/players/${userId}`), {
      userId, username, userPhoto
    });
  };

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

  const STATIC: Record<string,string[]> = {
    'Family friendly': ['Selfie con tu bebida favorita','Foto de un abrazo de grupo','Captura a alguien bailando'],
    'Plan tranqui':     ['Foto relajada en el sofá','Toma una foto con mascota','Captura un libro que estés leyendo'],
    'Al siguiente nivel':['Foto haciendo acrobacia suave','Captura un salto al aire','Recrea una escena de película'],
    'Pongámonos picantes...':['Selfie con gesto coqueto','Foto con algún accesorio rojo','Captura mirada intensa']
  };

  const startRound = async () => {
    if (!roomId) return;
    const ts = Date.now();
    _setRoundStart(ts);
    await set(dbRef(db, `rooms/${roomId}/roundStartTime`), ts);

    const prompt = `Crea un reto de fotografía para la categoría "${category}" , indica **únicamente en una sola frase** cómo debe ser la fotografía, estilo "toma una foto haciendo" y algo relacionado a la categoria ya, recuerda que es un juego de fotos con amigos para divertirse`;
    let retoIA = '';
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await res.json();
      retoIA = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
              || STATIC[category]?.[0]
              || 'Reto por defecto';
    } catch {
      const list = STATIC[category] || STATIC['Family friendly'];
      retoIA = list[Math.floor(Math.random()*list.length)];
    }

    await set(dbRef(db, `rooms/${roomId}/challenge`), retoIA);
    await set(dbRef(db, `rooms/${roomId}/round`), currentRound + 1);
    await set(dbRef(db, `rooms/${roomId}/photos`), {});
    await set(dbRef(db, `rooms/${roomId}/votes`), {});
    await set(dbRef(db, `rooms/${roomId}/scores`), {});
  };

  const advanceRound = async () => {
    if (!roomId) return;
    await set(dbRef(db, `rooms/${roomId}/round`), currentRound + 1);
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

  const submitPhotoFromUri = async (uri: string) => {
    if (!roomId) return;
    try {
      // 1) Traer la imagen como Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // 2) Definir ruta y subir
      const path = `photos/${roomId}/${userId}.jpg`;
      const ref  = storageRef(storage, path);
      await uploadBytes(ref, blob);

      // 3) Obtener URL pública
      const url = await getDownloadURL(ref);

      // 4) Guardar en RTDB
      await set(dbRef(db, `rooms/${roomId}/photos/${userId}`), {
        userId,
        username,
        userPhoto,
        photoUrl: url
      });

      return url;
    } catch (e) {
      console.error('submitPhotoFromUri error:', e);
      throw e;
    }
  };

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
      totalRounds, timeLimit, roundStartTime, category, setCategory: _setCategory,
      createRoom, joinRoom, joinRoomWithInfo,
      startRound, advanceRound,
      submitPhoto, submitPhotoFromUri, submitVote,
      registerForPushNotifications, sendUserJoinedNotification
    }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
export const useRoom = () => useContext(RoomContext);
