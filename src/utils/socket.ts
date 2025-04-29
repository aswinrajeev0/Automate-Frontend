import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_HOST, {
  autoConnect: true,
});

export default socket;