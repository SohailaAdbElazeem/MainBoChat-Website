// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import { useCallback } from "react";
// import { ChatItem, Message } from "@/types/types";

// type UseChatApiProps = {
//   apiBase: string;
//   token: string | null;
//   myUserId: string;
//   normalizeChats: (messages: Message[], myId: string) => ChatItem[];
// };

// export function useChatApi({ apiBase, token, myUserId, normalizeChats }: UseChatApiProps) {
//   // ✅ جلب كل المحادثات
//   const fetchAllChats = useCallback(async () => {
//     if (!myUserId || !token) return null;
//     try {
//       // const res = await fetch(`${apiBase}/chats/${myUserId}`, {
//       const res = await fetch(`${apiBase}/chats/chats/${myUserId}?category=all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Failed to fetch chats');
//       const data = await res.json();
//       return normalizeChats(data.userchats || [], myUserId);
//     } catch (error) {
//       console.error('Error fetching chats:', error);
//       return null;
//     }
//   }, [apiBase, token, myUserId, normalizeChats]);

//   // ✅ جلب المحادثات المفلترة
//   const fetchFilteredChats = useCallback(async (filter: string) => {
//     if (!myUserId || !token) return null;
//     try {
//       const res = await fetch(`${apiBase}/chats/${myUserId}?filter=${filter}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Failed to fetch filtered chats');
//       const data = await res.json();
//       return normalizeChats(data.userchats || [], myUserId);
//     } catch (error) {
//       console.error('Error fetching filtered chats:', error);
//       return null;
//     }
//   }, [apiBase, token, myUserId, normalizeChats]);
//   return {
//     fetchAllChats,
//     fetchFilteredChats,
//   };
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback } from "react";

type FilterType = 'all' | 'read' | 'unread' | 'starred' | 'groups' | 'calls';

type UseChatApiProps = {
  apiBase: string;
  token: string | null;
  myUserId: string;
  normalizeChats: (chats: any[], myId: string) => any[];
};

export function useChatApi({ apiBase, token, myUserId, normalizeChats }: UseChatApiProps) {
  
  // ✅ جلب كل المحادثات
  const fetchAllChats = useCallback(async () => {
    console.log('🔴🔴🔴 FETCH ALL CHATS STARTED 🔴🔴🔴');
    console.log('📌 myUserId:', myUserId);
    console.log('📌 token:', token ? '✅ موجود' : '❌ غير موجود');
    
    if (!myUserId || !token) {
      console.log('⚠️ Missing userId or token');
      return null;
    }
    
    try {
      const url = `${apiBase}/chats/chats/${myUserId}`;
      console.log('📡 Fetching all chats from:', url);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📊 Response status:', res.status);
      console.log('📊 Response ok:', res.ok);
      
      if (!res.ok) {
        console.error(`❌ Failed to fetch chats: ${res.status}`);
        if (res.status === 401) {
          console.error('❌ Unauthorized! Token may be invalid or expired.');
        }
        return null;
      }
      
      const data = await res.json();
      console.log('✅ Raw API response:', data);
      console.log('✅ Response type:', typeof data);
      console.log('✅ Response keys:', Object.keys(data));
      
      // ✅ استخراج الـ chats من الاستجابة
      let chats = [];
      if (data.success && Array.isArray(data.response)) {
        chats = data.response;
        console.log(`✅ Found ${chats.length} chats in response`);
      } else if (Array.isArray(data)) {
        chats = data;
        console.log(`✅ Found ${chats.length} chats in array`);
      } else if (data.data && Array.isArray(data.data)) {
        chats = data.data;
        console.log(`✅ Found ${chats.length} chats in data`);
      } else {
        console.error('❌ Unexpected response structure:', data);
        console.log('📦 Full response preview:', JSON.stringify(data).substring(0, 300));
        return [];
      }
      
      if (chats.length === 0) {
        console.warn('⚠️ No chats found in response');
        return [];
      }
      
      console.log('📊 First chat sample:', JSON.stringify(chats[0], null, 2));
      
      const normalized = normalizeChats(chats, myUserId);
      console.log('✅ Normalized chats count:', normalized?.length || 0);
      console.log('✅ Normalized chats sample:', normalized?.[0]);
      return normalized;
    } catch (error) {
      console.error('❌ Error fetching chats:', error);
      return null;
    }
  }, [apiBase, token, myUserId, normalizeChats]);

  // ✅ جلب المحادثات المفلترة
  const fetchFilteredChats = useCallback(async (category: FilterType = 'all') => {
    console.log('🔴🔴🔴 FETCH FILTERED CHATS STARTED 🔴🔴🔴');
    console.log('📌 category:', category);
    
    if (!myUserId || !token) {
      console.log('⚠️ Missing userId or token');
      return null;
    }
    
    try {
      const url = `${apiBase}/chats/chats/${myUserId}?category=${category}`;
      console.log(`📡 Fetching filtered chats (${category}) from:`, url);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`📊 Response status for ${category}:`, res.status);
      
      if (!res.ok) {
        console.error(`❌ Failed to fetch filtered chats: ${res.status}`);
        return null;
      }
      
      const data = await res.json();
      console.log(`✅ Filtered API response (${category}):`, data);
      
      let chats = [];
      if (data.success && Array.isArray(data.response)) {
        chats = data.response;
        console.log(`✅ Found ${chats.length} chats for filter: ${category}`);
      } else if (Array.isArray(data)) {
        chats = data;
      } else if (data.data && Array.isArray(data.data)) {
        chats = data.data;
      } else {
        console.error('❌ Unexpected response structure:', data);
        return [];
      }
      
      const normalized = normalizeChats(chats, myUserId);
      console.log(`✅ Normalized chats (${category}):`, normalized);
      return normalized;
    } catch (error) {
      console.error(`❌ Error fetching filtered chats (${category}):`, error);
      return null;
    }
  }, [apiBase, token, myUserId, normalizeChats]);

  return {
    fetchAllChats,
    fetchFilteredChats,
  };
}