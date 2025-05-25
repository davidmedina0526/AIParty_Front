import React, { createContext, useContext, useState, ReactNode } from 'react';

type RoomContextType = {
  roomId: string;
  userId: string;
  username: string;
  userPhoto: string;
  gameMode: 'Desafío de fotos' | 'El Reto';
  category: 'Family friendly' | 'Plan tranqui' | 'Al siguiente nivel' | 'Pongámonos picantes...';
  challenge: string;
  timeLimit: number;
  totalRounds: number;
  currentRound: number;
  setRoomId: (id: string) => void;
  setUserId: (id: string) => void;
  setUsername: (n: string) => void;
  setUserPhoto: (photo: string) => void;
  setGameMode: (m: RoomContextType['gameMode']) => void;
  setCategory: (c: RoomContextType['category']) => void;
  setChallenge: (c: string) => void;
  setTimeLimit: (t: number) => void;
  setTotalRounds: (r: number) => void;
  setCurrentRound: (r: number) => void;
};

const RoomContext = createContext<RoomContextType | null>(null);
export const useRoom = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoom must be inside RoomProvider');
  return ctx;
};

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [gameMode, setGameMode] = useState<RoomContextType['gameMode']>('Desafío de fotos');
  const [category, setCategory] = useState<RoomContextType['category']>('Family friendly');
  const [challenge, setChallenge] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [totalRounds, setTotalRounds] = useState(4);
  const [currentRound, setCurrentRound] = useState(1);

  return (
    <RoomContext.Provider value={{
      roomId, userId, username, userPhoto, gameMode, category, challenge,
      timeLimit, totalRounds, currentRound,
      setRoomId, setUserId, setUsername, setUserPhoto, setGameMode, setCategory,
      setChallenge, setTimeLimit, setTotalRounds, setCurrentRound
    }}>
      {children}
    </RoomContext.Provider>
  );
}
