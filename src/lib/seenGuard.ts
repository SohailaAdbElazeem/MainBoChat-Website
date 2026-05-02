// const KEY = "bochat_seen_chats";

// function load(): Set<string> {
//   if (typeof window === "undefined") return new Set();
//   try {
//     return new Set(JSON.parse(sessionStorage.getItem(KEY) || "[]"));
//   } catch {
//     return new Set();
//   }
// }

// function save(set: Set<string>) {
//   if (typeof window === "undefined") return;
//   sessionStorage.setItem(KEY, JSON.stringify(Array.from(set)));
// }

// // let seenChats = load();
// const seenChats = load();
// export const markChatSeen = (chatId: string) => {
//   seenChats.add(chatId);
//   save(seenChats);
// };

// export const isChatSeen = (chatId: string) => {
//   return seenChats.has(chatId);
// };

const KEY = "bochat_seen_chats";

function load(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(sessionStorage.getItem(KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function save(set: Set<string>) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(Array.from(set)));
}

const seenChats = load(); 

export const markChatSeen = (chatId: string) => {
  seenChats.add(chatId);
  save(seenChats);
};

export const isChatSeen = (chatId: string) => {
  return seenChats.has(chatId);
};