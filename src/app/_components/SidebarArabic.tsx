// "use client";

// import Link from "next/link";
// import { useMemo, useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import { useLoginModal } from "@/contexts/LoginModalContext";
// import { useTranslation } from "@/contexts/TranslationContext";
// import { useCallContext } from '@/contexts/CallContext';
// import CallModal from '@/app/chats/_components/components/calls/CallModal';

// type ItemId = "home" | "videos" | "messages" | "notifications" | "settings" | "profile" | "chats";

// type MenuItem = {
//   id: ItemId;
//   label: string;
//   href?: string;
//   icon: JSX.Element;
//   badgeCount?: number;
//   dot?: boolean;
// };

// export default function Sidebar({
//   unreadMessages = 2,
// }: {
//   unreadMessages?: number;
// }) {
//   const pathname = usePathname();
//   const { openLoginModal } = useLoginModal();
//   const [userId, setUserId] = useState<string | null>(null);
//   const [mounted, setMounted] = useState(false);


//    // ✅ جديد: استخدمي الـ context
//   const {
//     isCallModalOpen,
//     selectedCallChat,
//     callMinutes,
//     isStarting,
//     closeCallModal,
//     startCallHandler,
//   } = useCallContext();


//    const { language } = useTranslation();
//   const isAr = language === "ar";

//   useEffect(() => {
//     setMounted(true);

//     const updateUserData = () => {
//       const storedUserData = localStorage.getItem("userData");
//       if (storedUserData) {
//         try {
//           const user = JSON.parse(storedUserData);
//           setUserId(user?._id || null);
//         } catch (error) {
//           console.error("Failed to parse userData", error);
//           setUserId(null);
//         }
//       } else {
//         setUserId(null);
//       }
//     };

//     updateUserData();
//     window.addEventListener("userDataUpdated", updateUserData);

//     const handleStorage = (e: StorageEvent) => {
//       if (e.key === "userData") {
//         updateUserData();
//       }
//     };
//     window.addEventListener("storage", handleStorage);

//     const interval = setInterval(() => {
//       const storedUserData = localStorage.getItem("userData");
//       let newUserId = null;
//       if (storedUserData) {
//         try {
//           const user = JSON.parse(storedUserData);
//           newUserId = user?._id || null;
//         } catch (e) {}
//       }
//       setUserId((prev) => (prev !== newUserId ? newUserId : prev));
//     }, 1000);

//     return () => {
//       window.removeEventListener("userDataUpdated", updateUserData);
//       window.removeEventListener("storage", handleStorage);
//       clearInterval(interval);
//     };
//   }, []);

//   const active = pathname === "/"
//     ? "home"
//     : pathname?.startsWith?.("/videos")
//     ? "videos"
//     : pathname?.startsWith?.("/chats")
//     ? "chats"
//     : pathname?.startsWith?.("/profile")
//     ? "profile"
//     : undefined;

//   const icons = {
//     home: <img src="/icons/home.svg" className="w-[25px]" alt="home" />,
//     play: <img src="/icons/videos.svg" className="w-[20px]" alt="videos" />,
//     mail: <img src="/icons/messages.svg" className="w-[20px]" alt="chats" />,
//     user: <img src="/icons/user.svg" className="w-[20px]" alt="user" />,
//   };

//    const allItems: MenuItem[] = useMemo(
//     () => [
//       { 
//         id: "home", 
//         label: isAr ? "الصفحة الرئيسية" : "Home", 
//         href: "/", 
//         icon: icons.home 
//       },
//       {
//         id: "videos",
//         label: isAr ? "الريلز" : "Reels",
//         href: "/videos",
//         icon: icons.play,
//       },
//       {
//         id: "chats",
//         label: isAr ? "الرسائل" : "Messages",
//         href: userId ? "/chats" : "#",
//         icon: icons.mail,
//         // badgeCount: unreadMessages,
//       },
//       {
//         id: "profile",
//         label: isAr ? "الدرج الشخصي" : "Profile",
//         href: userId ? `/profile/${userId}` : "#",
//         icon: icons.user,
//       },
//     ],
//     [unreadMessages, userId, isAr]
//   );

//   const visibleItems = useMemo(() => {
//     if (userId) {
//       return allItems;
//     }
//     return allItems.filter(item => item.id === "home" || item.id === "videos");
//   }, [allItems, userId]);

//    const activeClass = isAr
//     ? "bg-gradient-to-l from-white to-[#D72229] text-white rounded-tl-[24px] rounded-bl-[24px] py-3 flex items-center gap-2"
//     : "bg-gradient-to-r from-white to-[#D72229] text-white rounded-tr-[24px] rounded-br-[24px] py-3 flex items-center gap-2";

//   if (!mounted) {
//     return (
//       <aside
//         dir={isAr ? "rtl" : "ltr"}
//         className={`select-none text-right text-[#111] overflow-y-auto scrollbar-hidden ${isAr ? "text-right" : "text-left"}`}
//         style={{ height: "calc(100vh - 90px)" }}
//       >
//         <nav className="space-y-2 mb-1">
//           <div className="h-10 rounded bg-gray-100 animate-pulse" />
//           <div className="h-10 rounded bg-gray-100 animate-pulse" />
//           <div className="h-10 rounded bg-gray-100 animate-pulse" />
//         </nav>
//       </aside>
//     );
//   }

//   return (
//     <aside
//       dir={isAr ? "rtl" : "ltr"}
//       className={`select-none text-[#111] overflow-y-auto scrollbar-hidden flex flex-col ${isAr ? "text-right" : "text-left"}`}
//       style={{ height: "calc(100vh - 90px)" }}
//     >
//       <nav className="space-y-2 mb-1">
//         {visibleItems.map((item) => {
//           const isActive = active === item.id;
//           const isProtected = (item.id === "chats" || item.id === "profile" || item.id === "videos") && !userId;

//           return (
//             <Link
//               key={item.id}
//               href={item.href ?? "#"}
//               onClick={(e) => {
//                 if (isProtected) {
//                   e.preventDefault();
//                   openLoginModal();
//                 }
//               }}
//               className={`${isActive ? activeClass : ""} flex justify-between ${isAr ? "!pr-10 !pl-4" : "!pl-10 !pr-4"}`}
//             >
//               <span className="flex items-center gap-2">
//                 <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-[26px]">
//                   <span className={`${isActive ? "text-white filter invert" : "text-black"}`}>
//                     {item.icon}
//                   </span>
//                   {item.dot && (
//                     <span className="absolute bottom-[-5px] left-[50%] -translate-x-1/2 h-[8px] w-[8px] rounded-full bg-[#D72229]" />
//                   )}
//                 </span>
//                 {item.label}
//               </span>
//               {item.badgeCount ? (
//                 <span className={`grid h-[28px] w-[26px] place-items-center rounded-[11px] bg-[#D72229] text-sm text-white ${isAr ? "ml-3" : "mr-3"}`}>
//                   {item.badgeCount}
//                 </span>
//               ) : null}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* <div className="max-w-[380px] mb-2">banner</div> */}


//       {/* ////// */}
      
// {/* ===== CallModal مكان الـ banner ===== */}
// {/* {isCallModalOpen && selectedCallChat && (
//   <CallModal
//     isOpen={isCallModalOpen}
//     calleeName={
//       selectedCallChat?.userinfo?.name ||
//       selectedCallChat?.name ||
//       'مستخدم'
//     }
//     calleeUsername={
//       selectedCallChat?.userinfo?.username
//         ? `@${selectedCallChat.userinfo.username}`
//         : selectedCallChat?.userinfo?.name
//         ? `@${selectedCallChat.userinfo.name}`
//         : '@user'
//     }
//     calleeAvatar={
//       selectedCallChat?.userinfo?.img || '/imgs/user.png'
//     }
//     callTitle="مكالمة صوتية صادرة"
//     freeMinutes={callMinutes.free}
//     totalMinutes={callMinutes.total}
//     isStarting={isStarting}
//     onClose={closeCallModal}
//     onStart={(type) => {
//       if (startCallHandler) {
//         startCallHandler(type);
//       }
//     }}
//   />
// )} */}
// {/* ===== CallModal مكان الـ banner ===== */}
// {isCallModalOpen && selectedCallChat && (
//   <CallModal
//     isOpen={isCallModalOpen}
//     // ✅ تحديد هل الشات عبارة عن جروب أم لا
//     isGroupCall={
//       selectedCallChat?.isGroup || 
//       selectedCallChat?.type === 'group' || 
//       Boolean(selectedCallChat?.members?.length)
//     }
//     // ✅ مصفوفة صور أعضاء الجروب (في حال كان جروب)
//     groupAvatars={
//       selectedCallChat?.members?.map((member: any) => member?.img || member?.avatar || '/imgs/user.png') ||
//       selectedCallChat?.groupAvatars ||
//       ['/imgs/user.png', '/imgs/user.png', '/imgs/user.png', '/imgs/user.png']
//     }
//     // ✅ عدد أعضاء الجروب
//     groupCount={
//       selectedCallChat?.members?.length || 
//       selectedCallChat?.groupCount || 
//       4
//     }
//     calleeName={
//       selectedCallChat?.userinfo?.name ||
//       selectedCallChat?.name ||
//       'مستخدِم'
//     }
//     calleeUsername={
//       selectedCallChat?.userinfo?.username
//         ? `@${selectedCallChat.userinfo.username}`
//         : selectedCallChat?.userinfo?.name
//         ? `@${selectedCallChat.userinfo.name}`
//         : '@user'
//     }
//     calleeAvatar={
//       selectedCallChat?.userinfo?.img || selectedCallChat?.img || '/imgs/user.png'
//     }
//     callTitle="مكالمة صوتية صادرة"
//     freeMinutes={callMinutes.free}
//     totalMinutes={callMinutes.total}
//     isStarting={isStarting}
//     onClose={closeCallModal}
//     onStart={(type) => {
//       if (startCallHandler) {
//         startCallHandler(type);
//       }
//     }}
//   />
// )}

//       {/* ////////// */}
//       {/* أسفل القائمة: روابط سياسة الخصوصية والحقوق */}
//       <div className={`space-y-3 text-sm text-black/70 mt-auto ${isAr ? "mr-3 ml-2" : "ml-3 mr-2"} ${userId ? 'pb-10' : 'pb-20'}`}>
//         <div className="flex flex-wrap items-center gap-x-2 gap-y-1">  
//           <Link
//             href="https://bo-eg.online/PrivacyPolicies.html"
//             target="_blank"
//             className="hover:underline text-[#D72229] whitespace-nowrap text-[14px] font-normal leading-[1.2]"
//             style={{ fontFamily: 'Cairo, sans-serif' }}
//           >
//             {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
//           </Link>

//           <span className="inline-block h-3 border-r border-[#D72229] opacity-100" />

//           <Link
//             href="https://bo-eg.online/PrivacyCenter.html"
//             target="_blank"
//             className="hover:underline text-[#D72229] whitespace-nowrap text-[14px] font-normal leading-[1.2]"
//             style={{ fontFamily: 'Cairo, sans-serif' }}
//           >
//             {isAr ? "مركز الخصوصية" : "Privacy Center"}
//           </Link>

//           <span className="inline-block h-3 border-r border-[#D72229] opacity-100" />

//           <Link
//             href="https://bo-eg.online/ContactUs.html"
//             target="_blank"
//             className="hover:underline text-[#D72229] whitespace-nowrap text-[14px] font-normal leading-[1.2]"
//             style={{ fontFamily: 'Cairo, sans-serif' }}
//           >
//             {isAr ? "اتصل بنا" : "Contact Us"}
//           </Link>

//           <span className="inline-block h-3 border-r border-[#D72229] opacity-100" />

//           <Link
//             href="https://bo-eg.online/SocialGuiedLines.html"
//             target="_blank"
//             className="hover:underline text-[#D72229] whitespace-nowrap text-[14px] font-normal leading-[1.2]"
//             style={{ fontFamily: 'Cairo, sans-serif' }}
//           >
//             {isAr ? "إرشادات المجتمع" : "Community Guidelines"}
//           </Link>

//           <span className="inline-block h-3 border-r border-[#D72229] opacity-100" />

//           <p
//             className="text-[14px] font-normal leading-[1.2] text-[#000000] whitespace-nowrap"
//             style={{ fontFamily: 'Cairo, sans-serif' }}
//           >
//             {isAr ? "مشغل بواسطة" : "Powered by"} <span className="font-semibold text-[#D72229]">panda oracle</span>
//           </p>
//         </div>
//       </div>
//     </aside>
//   );
// }


"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useCallContext } from '@/contexts/CallContext';
import CallModal from '@/app/chats/_components/components/calls/CallModal';

type ItemId = "home" | "videos" | "messages" | "notifications" | "settings" | "profile" | "chats";

type MenuItem = {
  id: ItemId;
  label: string;
  href?: string;
  icon: JSX.Element;
  badgeCount?: number;
  dot?: boolean;
};

export default function Sidebar({
  unreadMessages = 2,
}: {
  unreadMessages?: number;
}) {
  const pathname = usePathname();
  const { openLoginModal } = useLoginModal();
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    isCallModalOpen,
    selectedCallChat,
    callMinutes,
    isStarting,
    closeCallModal,
    startCallHandler,
  } = useCallContext();

  const { language } = useTranslation();
  const isAr = language === "ar";

  useEffect(() => {
    setMounted(true);

    const updateUserData = () => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          setUserId(user?._id || null);
        } catch (error) {
          console.error("Failed to parse userData", error);
          setUserId(null);
        }
      } else {
        setUserId(null);
      }
    };

    updateUserData();
    window.addEventListener("userDataUpdated", updateUserData);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "userData") {
        updateUserData();
      }
    };
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(() => {
      const storedUserData = localStorage.getItem("userData");
      let newUserId = null;
      if (storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          newUserId = user?._id || null;
        } catch (e) {}
      }
      setUserId((prev) => (prev !== newUserId ? newUserId : prev));
    }, 1000);

    return () => {
      window.removeEventListener("userDataUpdated", updateUserData);
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // ✅ حساب ما إذا كان الشات الحالي هو جروب
  // const isGroup = useMemo(() => {
  //   if (!selectedCallChat) return false;
  //   return Boolean(
  //     selectedCallChat.isGroup ||
  //     selectedCallChat.type === 'group' ||
  //     selectedCallChat.chatType === 'group' ||
  //     (Array.isArray(selectedCallChat.members) && selectedCallChat.members.length > 1) ||
  //     (Array.isArray(selectedCallChat.participants) && selectedCallChat.participants.length > 1)
  //   );
  // }, [selectedCallChat]);
  // ✅ 1. حساب حالة الجروب بدقة
const isGroup = useMemo(() => {
  if (!selectedCallChat) return false;
  return Boolean(
    selectedCallChat.isGroup ||
    selectedCallChat.type === 'group' ||
    (selectedCallChat as any).chatType === 'group' ||
    (Array.isArray(selectedCallChat.members) && selectedCallChat.members.length > 1) ||
    (Array.isArray((selectedCallChat as any).participants) && (selectedCallChat as any).participants.length > 1)
  );
}, [selectedCallChat]);

  // ✅ استخراج صور الأعضاء في حال كان جروب
  // const groupAvatars = useMemo(() => {
  //   if (!selectedCallChat) return [];
  //   const membersList =
  //     selectedCallChat.members ||
  //     selectedCallChat.participants ||
  //     selectedCallChat.users ||
  //     [];

  //   if (Array.isArray(membersList) && membersList.length > 0) {
  //     return membersList.map(
  //       (m: any) => m?.img || m?.avatar || m?.userinfo?.img || '/imgs/user.png'
  //     );
  //   }
  //   return selectedCallChat.groupAvatars || ['/imgs/user.png', '/imgs/user.png', '/imgs/user.png', '/imgs/user.png'];
  // }, [selectedCallChat]);

  // // ✅ حساب عدد الأعضاء
  // const groupCount = useMemo(() => {
  //   if (!selectedCallChat) return 0;
  //   const membersList =
  //     selectedCallChat.members ||
  //     selectedCallChat.participants ||
  //     selectedCallChat.users ||
  //     [];

  //   return membersList.length || selectedCallChat.groupCount || 4;
  // }, [selectedCallChat]);
  // ✅ 2. استخراج صور الأعضاء بالشكل الصحيح
const groupAvatars = useMemo(() => {
  if (!selectedCallChat) return [];
  
  const membersList =
    selectedCallChat.members ||
    (selectedCallChat as any).participants ||
    (selectedCallChat as any).users ||
    [];

  if (Array.isArray(membersList) && membersList.length > 0) {
    return membersList.map(
      (m: any) =>
        m?.img ||
        m?.avatar ||
        m?.userinfo?.img ||
        m?.userinfo?.avatar ||
        '/imgs/user.png'
    );
  }

  return selectedCallChat.groupAvatars || [
    '/imgs/user.png',
    '/imgs/user.png',
    '/imgs/user.png',
    '/imgs/user.png'
  ];
}, [selectedCallChat]);

// ✅ 3. حساب عدد الأعضاء
const groupCount = useMemo(() => {
  if (!selectedCallChat) return 0;
  
  const membersList =
    selectedCallChat.members ||
    (selectedCallChat as any).participants ||
    (selectedCallChat as any).users ||
    [];

  return membersList.length || selectedCallChat.groupCount || 4;
}, [selectedCallChat]);

  const active = pathname === "/"
    ? "home"
    : pathname?.startsWith?.("/videos")
    ? "videos"
    : pathname?.startsWith?.("/chats")
    ? "chats"
    : pathname?.startsWith?.("/profile")
    ? "profile"
    : undefined;

  const icons = {
    home: <img src="/icons/home.svg" className="w-[25px]" alt="home" />,
    play: <img src="/icons/videos.svg" className="w-[20px]" alt="videos" />,
    mail: <img src="/icons/messages.svg" className="w-[20px]" alt="chats" />,
    user: <img src="/icons/user.svg" className="w-[20px]" alt="user" />,
  };

  const allItems: MenuItem[] = useMemo(
    () => [
      { 
        id: "home", 
        label: isAr ? "الصفحة الرئيسية" : "Home", 
        href: "/", 
        icon: icons.home 
      },
      {
        id: "videos",
        label: isAr ? "الريلز" : "Reels",
        href: "/videos",
        icon: icons.play,
      },
      {
        id: "chats",
        label: isAr ? "الرسائل" : "Messages",
        href: userId ? "/chats" : "#",
        icon: icons.mail,
      },
      {
        id: "profile",
        label: isAr ? "الدرج الشخصي" : "Profile",
        href: userId ? `/profile/${userId}` : "#",
        icon: icons.user,
      },
    ],
    [unreadMessages, userId, isAr]
  );

  const visibleItems = useMemo(() => {
    if (userId) {
      return allItems;
    }
    return allItems.filter(item => item.id === "home" || item.id === "videos");
  }, [allItems, userId]);

  const activeClass = isAr
    ? "bg-gradient-to-l from-white to-[#D72229] text-white rounded-tl-[24px] rounded-bl-[24px] py-3 flex items-center gap-2"
    : "bg-gradient-to-r from-white to-[#D72229] text-white rounded-tr-[24px] rounded-br-[24px] py-3 flex items-center gap-2";

  if (!mounted) {
    return (
      <aside
        dir={isAr ? "rtl" : "ltr"}
        className={`select-none text-right text-[#111] overflow-y-auto scrollbar-hidden ${isAr ? "text-right" : "text-left"}`}
        style={{ height: "calc(100vh - 90px)" }}
      >
        <nav className="space-y-2 mb-1">
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
        </nav>
      </aside>
    );
  }

  return (
    <aside
      dir={isAr ? "rtl" : "ltr"}
      className={`select-none text-[#111] overflow-y-auto scrollbar-hidden flex flex-col ${isAr ? "text-right" : "text-left"}`}
      style={{ height: "calc(100vh - 90px)" }}
    >
      <nav className="space-y-2 mb-1">
        {visibleItems.map((item) => {
          const isActive = active === item.id;
          const isProtected = (item.id === "chats" || item.id === "profile" || item.id === "videos") && !userId;

          return (
            <Link
              key={item.id}
              href={item.href ?? "#"}
              onClick={(e) => {
                if (isProtected) {
                  e.preventDefault();
                  openLoginModal();
                }
              }}
              className={`${isActive ? activeClass : ""} flex justify-between ${isAr ? "!pr-10 !pl-4" : "!pl-10 !pr-4"}`}
            >
              <span className="flex items-center gap-2">
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-[26px]">
                  <span className={`${isActive ? "text-white filter invert" : "text-black"}`}>
                    {item.icon}
                  </span>
                  {item.dot && (
                    <span className="absolute bottom-[-5px] left-[50%] -translate-x-1/2 h-[8px] w-[8px] rounded-full bg-[#D72229]" />
                  )}
                </span>
                {item.label}
              </span>
              {item.badgeCount ? (
                <span className={`grid h-[28px] w-[26px] place-items-center rounded-[11px] bg-[#D72229] text-sm text-white ${isAr ? "ml-3" : "mr-3"}`}>
                  {item.badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* ===== CallModal مكان الـ banner ===== */}
      {isCallModalOpen && selectedCallChat && (
        <CallModal
          isOpen={isCallModalOpen}
          isGroupCall={isGroup}
          groupAvatars={groupAvatars}
          groupCount={groupCount}
          calleeName={
            selectedCallChat?.name ||
            selectedCallChat?.userinfo?.name ||
            'مستخدِم'
          }
          calleeUsername={
            selectedCallChat?.userinfo?.username
              ? `@${selectedCallChat.userinfo.username}`
              : selectedCallChat?.userinfo?.name
              ? `@${selectedCallChat.userinfo.name}`
              : '@user'
          }
          calleeAvatar={
            selectedCallChat?.userinfo?.img || 
            selectedCallChat?.userinfo?.avatar || 
            selectedCallChat?.img || 
            '/imgs/user.png'
          }
          callTitle="مكالمة صوتية صادرة"
          freeMinutes={callMinutes.free}
          totalMinutes={callMinutes.total}
          isStarting={isStarting}
          onClose={closeCallModal}
          onStart={(type) => {
            if (startCallHandler) {
              startCallHandler(type);
            }
          }}
        />
      )}

      {/* أسفل القائمة: روابط سياسة الخصوصية والحقوق */}
      <div className={`space-y-3 text-sm text-black/70 mt-auto ${isAr ? "mr-3 ml-2" : "ml-3 mr-2"} ${userId ? 'pb-10' : 'pb-20'}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">  
          <Link
            href="https://bo-eg.online/PrivacyPolicies.html"
            target="_blank"
            className="hover:underline text-[#D72229] whitespace-nowrap text-[14px] font-normal leading-[1.2]"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
          </Link>

          <span className="inline-block h-3 border-r border-[#D72229] opacity-100" />

          <Link
            href="https://bo-eg.online/PrivacyCenter.html"
            target="_blank"
            className="hover:underline text-[#D72229] whitespace-nowrap text-[14px] font-normal leading-[1.2]"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isAr ? "مركز الخصوصية" : "Privacy Center"}
          </Link>

          <span className="inline-block h-3 border-r border-[#D72229] opacity-100" />

          <Link
            href="https://bo-eg.online/ContactUs.html"
            target="_blank"
            className="hover:underline text-[#D72229] whitespace-nowrap text-[14px] font-normal leading-[1.2]"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isAr ? "اتصل بنا" : "Contact Us"}
          </Link>

          <span className="inline-block h-3 border-r border-[#D72229] opacity-100" />

          <Link
            href="https://bo-eg.online/SocialGuiedLines.html"
            target="_blank"
            className="hover:underline text-[#D72229] whitespace-nowrap text-[14px] font-normal leading-[1.2]"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isAr ? "إرشادات المجتمع" : "Community Guidelines"}
          </Link>

          <span className="inline-block h-3 border-r border-[#D72229] opacity-100" />

          <p
            className="text-[14px] font-normal leading-[1.2] text-[#000000] whitespace-nowrap"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isAr ? "مشغل بواسطة" : "Powered by"} <span className="font-semibold text-[#D72229]">panda oracle</span>
          </p>
        </div>
      </div>
    </aside>
  );
}