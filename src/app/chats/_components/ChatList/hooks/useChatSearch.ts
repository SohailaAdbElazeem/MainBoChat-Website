/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useMemo } from "react";
import { ChatItem } from "@/types/types";

export function useChatSearch(filteredChats: ChatItem[]) {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ البحث في المحادثات
  const searchedChats = useMemo(() => {
    if (!searchTerm.trim()) return filteredChats;
    
    return filteredChats.filter((chat) => {
      const userName = chat.userinfo?.name || chat.userinfo?.username || '';
      return userName.toLowerCase().includes(searchTerm.toLowerCase().trim());
    });
  }, [filteredChats, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchedChats,
  };
}