'use client';
import { useRouter } from "next/navigation";

type ChatHeaderProps = {
  title: string;
};

export default function ChatHeader({ title }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 mb-5">
      <h1 className="text-[20px] font-semibold text-right text-black leading-[100%] font-[Cairo]">
        {title}
      </h1>
      
      <button
        onClick={() => router.push('/chats/create-group')}
        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors bg-transparent border-none p-0 cursor-pointer"
        aria-label="إنشاء مجموعة"
      >
        <img 
          src="/imgs/createGrup.svg" 
          alt="إنشاء مجموعة"
          className="w-6 h-6 block"
        />
      </button>
    </div>
  );
}