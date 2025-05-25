import { io, Socket } from 'socket.io-client';
import { API_URL } from './api';
// quito el `/api` para apuntar al servidor http+ws
const WS_URL = API_URL.replace('/api', '');
export const socket: Socket = io(WS_URL, { transports: ['websocket'] });