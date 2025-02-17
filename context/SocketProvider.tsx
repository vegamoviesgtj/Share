"use client";
import { customAlphabet, nanoid } from "nanoid";
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client/debug";

const SocketContext = createContext<any>({});

export const useSocket = () => {
  const socket: {
    socket: Socket;
    userId: any;
    SocketId: any;
    setSocketId: any;
    peerState: any;
    setpeerState: any;
  } = useContext(SocketContext);
  return socket;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [peerState, setpeerState] = useState<any>();
  const [SocketId, setSocketId] = useState<any>();
  const [socketInstance, setSocketInstance] = useState<any>(null);
  
  const userId = useMemo(() => {
    return nanoid(10);
  }, []);

  useEffect(() => {
    // Initialize socket connection
    const socket = io('', {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });

    // Socket event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setSocketId(socket.id);
      socket.emit("details", {
        socketId: socket.id,
        uniqueId: userId,
      });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('detailsReceived', (data) => {
      console.log('Details received:', data);
    });

    setSocketInstance(socket);

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider
      value={{ 
        socket: socketInstance, 
        userId, 
        SocketId, 
        setSocketId, 
        peerState, 
        setpeerState 
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
