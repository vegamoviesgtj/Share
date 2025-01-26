'use client';

import React, { useEffect } from "react";
import { Button } from "./button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InfoToolTip from "./InfoToolTip";
import { useSocket } from "@/context/SocketProvider";

const Home = () => {
  const { socket, userId } = useSocket();

  useEffect(() => {
    if (!socket) {
      console.warn('Socket connection not established');
      return;
    }

    // Log connection status
    console.log('Socket Status:', {
      connected: socket.connected,
      id: socket.id,
      userId: userId
    });
  }, [socket, userId]);

  return (
    <div className="flex flex-col mt-[30vh] justify-center items-center">
      <h1 className="sm:text-3xl text-xl sm:w-[410px] text-center font-extrabold tracking-wide">
        Share Files Seamlessly 🌐, Connect P2P 🤝, and Chat Instantly 💬 with
        FileDrop!
      </h1>
      <InfoToolTip />
      <Link href="/transfer">
        <Button variant="outline">
          Get Started <ArrowRight className="ml-1" size={18}/>
        </Button>
      </Link>
      {!socket?.connected && (
        <p className="text-yellow-500 mt-4 text-sm">
          Connecting to server...
        </p>
      )}
    </div>
  );
};

export default Home;
