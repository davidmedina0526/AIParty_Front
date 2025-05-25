// src/services/voteService.js
import { ref, set, onValue } from 'firebase/database';
import { db } from './firebase';

export async function vote(roomId, voterId, targetUserId) {
  await set(ref(db, `rooms/${roomId}/votes/${voterId}`), { votedFor: targetUserId });
}

export function onScores(roomId, cb) {
  return onValue(ref(db, `rooms/${roomId}/votes`), snap => {
    const votes = snap.exists() ? snap.val() : {};
    const tally = {};
    Object.values(votes).forEach(v => {
      tally[v.votedFor] = (tally[v.votedFor] || 0) + 1;
    });
    const scores = Object.entries(tally).map(([userId, votes]) => ({ userId, votes }));
    cb(scores);
  });
}
