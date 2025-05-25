// src/services/playerService.js
import { ref, set, onValue } from 'firebase/database';
import { db } from './firebase';

export async function addPlayer(roomId, player) {
  await set(ref(db, `rooms/${roomId}/players/${player.userId}`), player);
}

export function onPlayers(roomId, cb) {
  return onValue(ref(db, `rooms/${roomId}/players`), snap => {
    const players = snap.exists() ? Object.values(snap.val()) : [];
    cb(players);
  });
}
