import { io } from 'socket.io-client';

// Cambia esta IP a la de tu ordenador en la red local
const SOCKET_URL = 'https://back-end-final-movil-2025-1.vercel.app';

const socket = io(SOCKET_URL, {
  path: '/socket.io',
  transports: ['websocket'],
  // reconnection: true, // opcional
});

export { socket };
export default socket;
