'use client';
import { Search } from "lucide-react";

type ChatSearchProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function ChatSearch({ searchTerm, setSearchTerm }: ChatSearchProps) {
  return (
    <div className="flex items-center justify-center w-full mb-3">
      <div className="w-[90%] bg-[#F2F2F2] flex h-[61px] items-center px-4 gap-1 rounded-[27px]">
        <Search className="text-[#B6B7B7]"/>
        <input 
          type="text" 
          placeholder="ابحث عن اسم الشخص..." 
          className="focus:outline-none placeholder:text-[#B6B7B7] bg-transparent w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}