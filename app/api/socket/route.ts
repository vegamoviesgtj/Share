import { Server } from 'socket.io';
import { NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';
import { Server as NetServer } from 'http';
import { NextApiResponseWithSocket } from '@/types/socket';

export async function GET(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    return NextResponse.json({ message: 'Socket is already running' }, { status: 200 });
  }

  console.log('Socket is initializing');
  const io = new Server(res.socket.server as any, {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
      origin: '*',
    },
  });

  const records = new Map();
  const usersToUniquedID = new Map();
  const uniqueIdTousers = new Map();

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinRoom', (temp) => {
      socket.join(Number(temp));
      records.set(socket.id, Number(temp));
      socket.emit('ack', `You have joined room ${temp}`);
    });

    socket.on('message', (temp) => {
      const roomNum = records.get(socket.id);
      io.to(roomNum).emit('roomMsg', temp);
    });

    socket.on('details', (data) => {
      const user = data.socketId;
      const uniqueId = data.uniqueId;
      usersToUniquedID.set(user, uniqueId);
      uniqueIdTousers.set(uniqueId, user);
      socket.emit('detailsReceived', { socketId: user, uniqueId: uniqueId });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      const uniqueId = usersToUniquedID.get(socket.id);
      if (uniqueId) {
        usersToUniquedID.delete(socket.id);
        uniqueIdTousers.delete(uniqueId);
      }
    });
  });

  res.socket.server.io = io;
  return NextResponse.json({ message: 'Socket server started' }, { status: 200 });
}
