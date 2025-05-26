// src/services/photoService.js
const { storage } = require('./firebase.js/index.js');

async function savePhoto(fileBuffer, roomId, userId) {
  const bucketFile = storage
    .bucket()
    .file(`photos/${roomId}/${userId}.jpg`);
  await bucketFile.save(fileBuffer, {
    metadata: { contentType: 'image/jpeg' }
  });
  return bucketFile.publicUrl();
}

module.exports = { savePhoto };