// app/messages/page.jsx
"use client";
// import ChatListFromApi from "./_components/ChatList";
export default function MessagesIndex() {
  const userId = "688cd75691e0a8db0c1a252c";
  return (
    <div className="flex flex-col items-center justify-center h-full pb-15">
      <img src="/icons/globe.svg" alt="" />
      <div className="mt-4 text-[35px]"> ابدأ الدردشة الآن</div>
      <p className="text-[20px]">تواصل مع أصدقائك على بوشات</p>
    </div>
  );
}