// src/app/chats/_components/hooks/useBlockedUsers.ts
import { useState, useEffect, useCallback } from 'react';

interface UseBlockedUsersProps {
  apiBase: string;
  token: string | null;
}

export function useBlockedUsers({ apiBase, token }: UseBlockedUsersProps) {
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const fetchBlockedUsers = useCallback(async () => {
    if (!token) return;
    try {
      const baseUrl = apiBase || 'https://bo-chat.space';
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

      const response = await fetch(`${cleanBaseUrl}/block`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return;

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        return;
      }

      let blockedIds: string[] = [];

      if (data.success && Array.isArray(data.response)) {
        blockedIds = data.response.map((u: any) => u._id || u.id || u);
      } else if (Array.isArray(data)) {
        blockedIds = data.map((u: any) => u._id || u.id || u);
      } else if (Array.isArray(data.blockedUsers)) {
        blockedIds = data.blockedUsers.map((u: any) => u._id || u.id || u);
      } else if (Array.isArray(data.users)) {
        blockedIds = data.users.map((u: any) => u._id || u.id || u);
      } else if (Array.isArray(data.data)) {
        blockedIds = data.data.map((u: any) => u._id || u.id || u);
      }

      setBlockedUsers(blockedIds);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    }
  }, [apiBase, token]);

  useEffect(() => {
    if (token) fetchBlockedUsers();
  }, [token, fetchBlockedUsers]);

  const isUserBlocked = useCallback(
    (chatId: string) => blockedUsers.includes(chatId),
    [blockedUsers]
  );

  const addBlockedUser = useCallback((chatId: string) => {
    setBlockedUsers((prev) => [...prev, chatId]);
  }, []);

  const removeBlockedUser = useCallback((chatId: string) => {
    setBlockedUsers((prev) => prev.filter((id) => id !== chatId));
  }, []);

  return { blockedUsers, isUserBlocked, addBlockedUser, removeBlockedUser };
}