/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef, useCallback } from "react";
import wsService from "@/lib/websocketService";
import { Message } from "@/types/types";

type UseWebSocketProps = {
  myUserId: string;
  onMessage: (msg: Message) => void;
  onTyping: (payload: any) => void;
  onSeen: (payload: any) => void;
};

export function useWebSocket({ 
  myUserId, 
  onMessage, 
  onTyping, 
  onSeen 
}: UseWebSocketProps) {
  const bcRef = useRef<BroadcastChannel | null>(null);

  // ✅ WebSocket
  useEffect(() => {
    if (!myUserId) return;
    
    wsService.connect(myUserId);

    const handleWsEvent = (payload: any) => {
      if (!payload) return;
      
      if (payload.event === "message" && payload.metadata) {
        onMessage(payload.metadata);
        return;
      }
      if (payload.event === "typing" && payload.metadata) {
        onTyping(payload.metadata);
        return;
      }
      if (payload.event === "seen" && payload.metadata) {
        onSeen(payload.metadata);
        return;
      }
      if (payload._id && payload.sender && payload.receiver && payload.message) {
        onMessage(payload);
        return;
      }
    };

    const unsub = wsService.addHandler(handleWsEvent);
    return () => unsub();
  }, [myUserId, onMessage, onTyping, onSeen]);

  // ✅ Broadcast Channel
  useEffect(() => {
    bcRef.current = new BroadcastChannel("bochat-typing");
    bcRef.current.onmessage = (ev) => {
      if (ev.data?.type === "chat_update") {
        // handle broadcast events
      }
    };
    return () => {
      bcRef.current?.close();
      bcRef.current = null;
    };
  }, []);

  // ✅ Send typing event
  const sendTyping = useCallback((receiver: string) => {
    if (!myUserId) return;
    wsService.send({
      event: "typing",
      metadata: { sender: myUserId, reicever: receiver }
    });
  }, [myUserId]);

  // ✅ Send seen event
  const sendSeen = useCallback((sender: string) => {
    if (!myUserId) return;
    wsService.send({
      event: "seen",
      metadata: { sender: myUserId, receiver: sender }
    });
  }, [myUserId]);

  return {
    sendTyping,
    sendSeen,
  };
}