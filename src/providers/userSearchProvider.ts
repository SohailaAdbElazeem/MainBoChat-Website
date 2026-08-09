// src/providers/userSearchProvider.ts
import { SearchResult } from '@/types/search-result';
import { SearchProvider } from '@/types/search-provider';

export const userSearchProvider: SearchProvider = {
  key: 'users',
  label: 'المستخدمون',
  search: async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) {
       return [];
    }

    if (typeof window === 'undefined') {
       return [];
    }

     const allKeys = Object.keys(localStorage);
    if (allKeys.length === 0) {
     } else {
      allKeys.forEach(key => {
        const value = localStorage.getItem(key);
        const displayValue = value ? value.substring(0, 60) + (value.length > 60 ? '...' : '') : '(فارغ)';
       });
    }

    let userDataRaw = null;
    let accessToken = null;

    const userDataKeys = ['userData', 'user', 'userInfo', 'authUser', 'currentUser'];
    for (const key of userDataKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        userDataRaw = value;
         break;
      }
    }

    const tokenKeys = ['accesstoken', 'accessToken', 'token', 'authToken', 'Authorization'];
    for (const key of tokenKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        accessToken = value;
         break;
      }
    }

    if (!userDataRaw || !accessToken) {
       return [{
        id: 'login-required',
        title: 'سجل دخولك للبحث عن المستخدمين',
        subtitle: 'تسجيل الدخول يمنحك نتائج أكثر',
        href: '/login',
      }];
    }

    let user;
    try {
      user = JSON.parse(userDataRaw);
    } catch (parseError) {
       return [];
    }

    const userId = user._id || user.id || user.userId;
    if (!userId) {
       return [];
    }
    const url = `https://bo-chat.space/search?userid=${userId}&value=${encodeURIComponent(query)}`;
     
    try {
       const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("📡 Status =", res.status);
      console.log("📡 StatusText =", res.statusText);

      if (!res.ok) {
        let errorText = '';
        try {
          errorText = await res.text();
        } catch (_) {
          errorText = 'تعذر قراءة نص الخطأ';
        }
       
        if (res.status === 401) {
           localStorage.clear(); 
          alert('انتهت صلاحية الجلسة، سيتم تسجيل الخروج'); 
           setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }, 500);
          return [];  
        }
        return [];
      }
      const data = await res.json();
 
       let items: any[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data.users && Array.isArray(data.users)) {
        items = data.users;
      } else if (data.results && Array.isArray(data.results)) {
        items = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
      } else if (data.response && Array.isArray(data.response)) {
        items = data.response;
      } else {
         return [];
      }

      if (items.length === 0) {
         return [];
      }
       return items.slice(0, 5).map((item: any) => ({
        id: item._id || item.id || `user-${Math.random()}`,
        title: item.name || item.username || 'مستخدم',
        subtitle: item.email || item.bio || '',
        href: `/profile/${item._id || item.id}`,
        meta: item.followers ? `${item.followers} متابع` : '',
      }));
    } catch (fetchError) {
       return [];
    }
  },
};