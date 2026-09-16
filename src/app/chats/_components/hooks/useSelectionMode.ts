// src/app/chats/_components/hooks/useSelectionMode.ts
import { useState, useRef, useEffect, useCallback } from 'react';

export function useSelectionMode() {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const longPressTimer = useRef<any>(null);

  const toggleChatSelection = useCallback((chatId: string) => {
    setSelectedChats((prev) => {
      if (prev.includes(chatId)) {
        const newSelected = prev.filter((id) => id !== chatId);
        if (newSelected.length === 0) setSelectionMode(false);
        return newSelected;
      }
      return [...prev, chatId];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedChats([]);
    setSelectionMode(false);
  }, []);

  const handleMouseDown = useCallback(
    (chatId: string, e: React.MouseEvent) => {
      if (e.button === 0 && !selectionMode) {
        longPressTimer.current = setTimeout(() => {
          setSelectionMode(true);
          setSelectedChats([chatId]);
        }, 500);
      }
    },
    [selectionMode]
  );

  const handleMouseUp = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(longPressTimer.current);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(longPressTimer.current);
    };
  }, []);

  return {
    selectionMode,
    selectedChats,
    setSelectionMode,
    toggleChatSelection,
    clearSelection,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
  };
}