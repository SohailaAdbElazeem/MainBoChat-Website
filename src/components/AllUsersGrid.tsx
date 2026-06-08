// /* eslint-disable @next/next/no-img-element */
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";

// type UserRaw = {
//   rate: string;
//   _id: string;
//   name?: string;
//   username?: string;
//   img?: string;
//   visit?: number;
// };


// function shuffleArray<T>(arr: T[]) {
//   const a = arr.slice();
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

// export default function AllUsersSlider({
//   endpoint = "https://bo-chat.space/allUsers",
// }: {
//   endpoint?: string;
// }) {
//   const [users, setUsers] = useState<UserRaw[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const scrollerRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   useEffect(() => {
// const TOKEN = localStorage.getItem("accessToken") || "";

//     (async () => {
//       try {
//         const res = await fetch(endpoint, {
//           cache: "no-store",
//           headers: {
//             Authorization: `Bearer ${TOKEN}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await res.json();
//         const rows = Array.isArray(data) ? data : data?.data ?? [];

//         // ترتيب عشوائي مرة واحدة
//         setUsers(shuffleArray(rows));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [endpoint]);

//   const scrollByAmount = 320; // مقدار حركة السلايدر يمين/شمال

//   const moveLeft = () => {
//     scrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
//   };

//   const moveRight = () => {
//     scrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
//   };

//   const goToProfile = (id: string) => {
//     // ينتقل إلى المسار profile/{id}
//     router.push(`/profile/${id}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex gap-4 overflow-hidden">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div
//             key={i}
//             className="w-[240px] h-[320px] bg-gray-200 rounded-2xl animate-pulse"
//           />
//         ))}
//       </div>
//     );
//   }

//   if (!users || users.length === 0) {
//     return <p className="text-gray-500">لا يوجد مستخدمين.</p>;
//   }
// const truncate = (str: string | undefined, max: number) => {
//   if (!str) return "";
//   return str.length > max ? str.slice(0, max) + "..." : str;
// };
//   return (
//     <section className="relative w-full">
//         <div>
//   <h2 className="text-2xl mb-3 px-2">صور</h2>

//   <button
//     onClick={moveLeft}
//     className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#000000]/10 backdrop-blur flex items-center justify-center"
//     aria-label="Move left"
//   >
//     <img src="/imgs/arrowleft.svg" className="w-6 h-6" alt="left" />
//   </button>
// </div>

//       <h2 className="text-2xl mb-3 px-2">أشخاص على مزاجك</h2>

//       {/* ====== السهمين ======= */}
//       <button
//         onClick={moveLeft}
//         className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#000000]/10 backdrop-blur flex items-center justify-center"
//         aria-label="Move left"
//       >
//         <img src="/imgs/arrowleft.svg" className="w-6 h-6 " alt="left" />
//       </button>

//       <button
//         onClick={moveRight}
//         className="absolute z-10 right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#000000]/10 backdrop-blur flex items-center justify-center"
//         aria-label="Move right"
//       >
//         <img src="/imgs/arrowright.svg" className="w-6 h-6 " alt="right" />
//       </button>

//       {/* ====== السلايدر ======= */}
//       <div
//         ref={scrollerRef}
//         className="flex gap-3 overflow-x-auto scrollbar-hidden px-2 py-3 scroll-smooth"
//         dir="ltr"
//       >
//         {users.filter(u => u._id !== "697c63efd671ce6c29e6f84d").map((u) => (
//           <div
//             key={u._id}
//             className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px]  shrink-0"
//           >
//             <div
//               role="button"
//               tabIndex={0}
//               onClick={() => goToProfile(u._id)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
//               }}
//               className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
//               aria-label={`افتح بروفايل ${u.name ?? "المستخدم"}`}
//             >
//               <img
//                 className="w-[153px] h-[153px] rounded-full object-cover "
//                 alt={u.name ?? "User"}
//                 src={u?.img || "/icons/user.svg"}
//                 onError={(e) => {
//                   e.currentTarget.src = "/icons/user.svg";
//                 }}
//               />
//               <div className="rounded-full bg-white absolute bottom-0 left-3 w-8 h-8 flex items-center justify-center gap-1">
//                 <img src="/icons/star.svg" width={10} alt="" />
//                 <p >{u.rate}</p>
//               </div>
//             </div>

//             <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
//                 {truncate(u.name, 10)}
//             </h3>

//             <p className="text-gray-500 me-2 text-right text-[9px]">
//                 @{truncate(u.username, 10)}
//             </p>

//             <div className="mt-3 flex justify-center">
//               <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
//                 👁 {u.visit ?? 0}
//               </span>
//               <button className="px-3 py-2 flex items-center gap-3 rounded-full border border-[#D72229] text-[#D72229] cursor-pointer text-sm">
//                 <img src="/icons/follow.svg" className="w-4 h-4" alt="" />
//                 متابعه
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

 "use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UserRaw = {
  rate: string;
  _id: string;
  name?: string;
  username?: string;
  img?: string;
  visit?: number;
};

function shuffleArray<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AllUsersSlider({
  endpoint = "https://bo-chat.space/allUsers",
}: {
  endpoint?: string;
}) {
  const [users, setUsers] = useState<UserRaw[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllImages, setShowAllImages] = useState(false); 
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ✅ refs منفصلة لكل سلايدر
  const imagesScrollerRef = useRef<HTMLDivElement>(null);
  const peopleScrollerRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
// دالة لتبديل حالة عرض كل الصور
const toggleAllImages = () => {
  setShowAllImages(!showAllImages);
};

 useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setCurrentUserId(userData._id || null);
      } catch (e) {
        console.error("Failed to parse userData", e);
      }
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";
    (async () => {
      try {
        const res = await fetch(endpoint, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        const rows = Array.isArray(data) ? data : data?.data ?? [];
        setUsers(shuffleArray(rows));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint]);

  const scrollByAmount = 320;

  // ✅ دوال التمرير للسلايدر الأول (صور)
  const scrollImagesLeft = () => {
    imagesScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };
  const scrollImagesRight = () => {
    imagesScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  // ✅ دوال التمرير للسلايدر الثاني (أشخاص)
  const scrollPeopleLeft = () => {
    peopleScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };
  const scrollPeopleRight = () => {
    peopleScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  const goToProfile = (id: string) => {
    router.push(`/profile/${id}`);
  };

  const truncate = (str: string | undefined, max: number) => {
    if (!str) return "";
    return str.length > max ? str.slice(0, max) + "..." : str;
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-[240px] h-[320px] bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <p className="text-gray-500">لا يوجد مستخدمين.</p>;
  }

  const filteredUsers = users?.filter((u) => {
    if (!currentUserId) return true; 
    return u._id !== currentUserId;
  }) ?? [];
  return (
    <section className="relative w-full space-y-8">
 {/* ===== سلايدر الصور (فقط صور) ===== */}
<div className="relative">
  <div className="flex items-center justify-between px-2">
    <h2 className="text-2xl mb-3">صور</h2>
     {filteredUsers.length > 0 && (
      <button
        onClick={toggleAllImages}
        className="mb-3 p-1 rounded-full hover:bg-gray-200 transition"
        aria-label={showAllImages ? "إخفاء كل الصور" : "عرض كل الصور"}
      >
        <img
          src={showAllImages ? "/imgs/Vector (5).svg" : "/imgs/Vector (5).svg"}
          className="w-5 h-5"
          alt="toggle images"
        />
      </button>
    )}
  </div>

  {/* حالة عدم وجود صور */}
  {filteredUsers.length === 0 ? (
    <div className="text-center py-8 px-2">
    <img src="/imgs/Group 9156.svg" alt="No images" />
      <p className="text-gray-500 text-lg">مفيش صور هنا دلوقتي</p>
      <p className="text-gray-400 text-sm mt-2">
        لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا
      </p>
    </div>
  ) : (
    <>
      {/* إذا لم يتم الضغط على السهم: نعرض السلايدر وأسهمه */}
      {!showAllImages && (
        <>
          <button
            onClick={scrollImagesLeft}
            className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
            aria-label="تمرير لليسار"
          >
            <img src="/imgs/arrowleft.svg" className="w-6 h-6" alt="left" />
          </button>
          <button
            onClick={scrollImagesRight}
            className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
            aria-label="تمرير لليمين"
          >
            <img src="/imgs/arrowright.svg" className="w-6 h-6" alt="right" />
          </button>

          <div
            ref={imagesScrollerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hidden px-2 py-3 scroll-smooth"
            dir="ltr"
          >
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="shrink-0 cursor-pointer"
                style={{ width: "183px", height: "242px" }}
                onClick={() => goToProfile(u._id)}
              >
                <div className="relative w-full h-full overflow-hidden rounded-[30px]">
                  <img
                    className="w-full h-full object-cover"
                    alt={u.name ?? "User"}
                    src={u?.img || "/icons/user.svg"}
                    onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* إذا تم الضغط على السهم: نعرض جميع الصور بشكل شبكي (بدون السلايدر) */}
      {showAllImages && (
        <div className="mt-4 px-2 flex flex-col gap-4">
          {/* <h3 className="text-xl font-semibold">جميع الصور</h3> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="cursor-pointer"
                onClick={() => goToProfile(u._id)}
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-md">
                  <img
                    className="w-full h-full object-cover"
                    alt={u.name ?? "User"}
                    src={u?.img || "/icons/user.svg"}
                    onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )}
</div>

      {/* ===== سلايدر أشخاص على مزاجك (بطاقات كاملة) ===== */}
      <div className="relative">
        <h2 className="text-2xl mb-3 px-2">أشخاص على مزاجك</h2>

        {/* أسهم هذا السلايدر */}
        <button
          onClick={scrollPeopleLeft}
          className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
          aria-label="تمرير لليسار"
        >
          <img src="/imgs/arrowleft.svg" className="w-6 h-6" alt="left" />
        </button>
        <button
          onClick={scrollPeopleRight}
          className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
          aria-label="تمرير لليمين"
        >
          <img src="/imgs/arrowright.svg" className="w-6 h-6" alt="right" />
        </button>

        <div
          ref={peopleScrollerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hidden px-2 py-3 scroll-smooth"
          dir="ltr"
        >
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px] shrink-0"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => goToProfile(u._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
                }}
                className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
              >
                <img
                  className="w-[153px] h-[153px] rounded-full object-cover"
                  alt={u.name ?? "User"}
                  src={u?.img || "/icons/user.svg"}
                  onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
                />
                <div className="rounded-full bg-white absolute bottom-0 left-3 w-8 h-8 flex items-center justify-center gap-1">
                  <img src="/icons/star.svg" width={10} alt="" />
                  <p>{u.rate}</p>
                </div>
              </div>
              <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
                {truncate(u.name, 10)}
              </h3>
              <p className="text-gray-500 me-2 text-right text-[9px]">
                @{truncate(u.username, 10)}
              </p>
              <div className="mt-3 flex justify-center">
                <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                  👁 {u.visit ?? 0}
                </span>
                <button className="px-3 py-2 flex items-center gap-3 rounded-full border border-[#D72229] text-[#D72229] cursor-pointer text-sm">
                  <img src="/icons/follow.svg" className="w-4 h-4" alt="" />
                  متابعه
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}