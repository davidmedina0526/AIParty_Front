// src/services/roomService.js
import { ref, push, set, get, onValue } from 'firebase/database';
import { db } from './firebase';

export async function createRoom({ name, totalRounds, timeLimit, category }) {
  const roomRef = push(ref(db, 'rooms'));
  await set(roomRef, {
    id: roomRef.key,
    name,
    totalRounds,
    timeLimit,
    category,
    round: 1,
    status: 'waiting'
  });
  return roomRef.key;
}

export async function fetchRoom(roomId) {
  const snap = await get(ref(db, `rooms/${roomId}`));
  return snap.exists() ? snap.val() : null;
}

export function onRoom(roomId, cb) {
  return onValue(ref(db, `rooms/${roomId}`), snap => cb(snap.val()));
}
