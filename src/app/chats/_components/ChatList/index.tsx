// // src/app/messages/_components/ChatList/index.tsx
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import { useChatList } from './useChatList';
// import ChatHeader from './ChatHeader';
// import ChatSearch from './ChatSearch';
// import ChatFilters from '../ChatFilters';
// import ChatMessages from './ChatMessages';

// type Props = {
//   apiBase: string;
//   userId?: string | null;
//   activeChatId?: string | null;
// };

// export default function ChatList({ apiBase, userId, activeChatId }: Props) {
//   const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

//   const {
//     loading,
//     searchTerm,
//     setSearchTerm,
//     activeFilter,
//     filterLoading,
//     getFilterCounts,
//     handleFilterChange,
//     getSectionTitle,
//     searchedChats,
//     router,
//     myUserId,
//   } = useChatList({ apiBase, token, userId, activeChatId });

//   if (loading) {
//     return <div className="p-4">جارٍ التحميل...</div>;
//   }

//   return (
//     <div>
//       <ChatHeader title={getSectionTitle()} />
      
//       <ChatSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

//       <ChatFilters 
//         onFilterChange={handleFilterChange}
//         activeFilter={activeFilter}
//         counts={getFilterCounts}
//       />

//       {filterLoading ? (
//         <div className="text-center py-10 text-gray-500">جاري تحميل المحادثات...</div>
//       ) : (
//         <ChatMessages
//           chats={searchedChats}
//           myUserId={myUserId}
//           activeChatId={activeChatId || undefined}
//           searchTerm={searchTerm}
//           onChatClick={(chatId) => router.push(`/chats/${chatId}`)}
//         />
//       )}
//     </div>
//   );
// }


// src/app/chats/_components/ChatList/index.tsx

'use client';
import { useEffect, useState } from 'react';
import { useChatList } from './useChatList'; // ✅ هذا هو المسار الصحيح
import ChatHeader from './ChatHeader';
import ChatSearch from './ChatSearch';
import ChatFilters from '../ChatFilters';
import ChatMessages from './ChatMessages';

type Props = {
  apiBase?: string;
  userId?: string | null;
  activeChatId?: string | null;
  token?: string | null;
};

export default function ChatList({ 
  apiBase = 'https://bo-chat.space',
  userId, 
  activeChatId,
  token: propToken
}: Props) {
  console.log('🔴🔴🔴 CHAT LIST COMPONENT RENDERED 🔴🔴🔴');
  console.log('📌 userId prop:', userId);
  console.log('📌 propToken:', propToken ? '✅ موجود' : '❌ غير موجود');

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔴 TOKEN EFFECT IN CHAT LIST');
    
    if (propToken) {
      console.log('✅ Using propToken');
      setToken(propToken);
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    console.log('📌 accessToken from localStorage:', accessToken ? '✅ موجود' : '❌ غير موجود');
    setToken(accessToken);
  }, [propToken]);

  console.log('📌 Token state:', token ? '✅ موجود' : '❌ غير موجود');

  // ✅ استدعاء useChatList
  console.log('🔴🔴🔴 ABOUT TO CALL useChatList 🔴🔴🔴');
  const chatListData = useChatList({ 
    apiBase, 
    token, 
    userId, 
    activeChatId 
  });
  console.log('🔴🔴🔴 useChatList RETURNED 🔴🔴🔴');

  console.log('📊 useChatList returned:', {
    loading: chatListData.loading,
    error: chatListData.error,
    myUserId: chatListData.myUserId,
    chatsCount: chatListData.searchedChats?.length || 0,
  });

  const {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    activeFilter,
    filterLoading,
    getFilterCounts,
    handleFilterChange,
    getSectionTitle,
    searchedChats,
    router,
    myUserId,
  } = chatListData;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>❌ {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ChatHeader title={getSectionTitle()} />
      
      <ChatSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ChatFilters 
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
        counts={getFilterCounts}
      />

      {filterLoading ? (
        <div className="text-center py-10 text-gray-500">جاري تحميل المحادثات...</div>
      ) : (
        <ChatMessages
          chats={searchedChats || []}
          myUserId={myUserId}
          activeChatId={activeChatId || undefined}
          searchTerm={searchTerm}
          onChatClick={(chatId) => {
            console.log('📱 Opening chat:', chatId);
            router.push(`/chats/${chatId}`);
          }}
        />
      )}
    </div>
  );
}