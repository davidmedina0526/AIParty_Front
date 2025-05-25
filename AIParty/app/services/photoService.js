// src/services/photoService.js
import { ref, set, onValue } from 'firebase/database';
import { db, storage }      from './firebase';
import { ref as sRef, uploadString, getDownloadURL } from 'firebase/storage';

export async function uploadPhoto(roomId, { userId, imageBase64 }) {
  // 1) sube a Firebase Storage
  const path = `photos/${roomId}/${userId}.jpg`;
  const stRef = sRef(storage, path);
  await uploadString(stRef, imageBase64, 'data_url');
  const photoUrl = await getDownloadURL(stRef);

  // 2) guarda metadata en Realtime DB
  await set(ref(db, `rooms/${roomId}/photos/${userId}`), {
    userId,
    photoUrl
  });

  return photoUrl;
}

export function onPhotos(roomId, cb) {
  return onValue(ref(db, `rooms/${roomId}/photos`), snap => {
    const arr = snap.exists() ? Object.values(snap.val()) : [];
    cb(arr);
  });
}
