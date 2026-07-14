 

// // // // //  Update Images
// // // // "use client";
// // // // import React, { useEffect, useRef, useState } from "react";
 
// // // // import { useRouter, useParams } from "next/navigation";
// // // //  type UserRaw = {
// // // //   rate: string;
// // // //   _id: string;
// // // //   name?: string;
// // // //   username?: string;
// // // //   img?: string;
// // // //   visit?: number;
// // // //     followers?: any[]; // لإضافة بيانات المتابعين إذا كانت موجودة
// // // // };

// // // // type MyPost = {
// // // //   _id: string;
// // // //   type?: string;
// // // //   image?: {
// // // //     image: string;
// // // //     width?: string;
// // // //     height?: string;
// // // //   }[];
// // // // };

// // // // function shuffleArray<T>(arr: T[]) {
// // // //   const a = arr.slice();
// // // //   for (let i = a.length - 1; i > 0; i--) {
// // // //     const j = Math.floor(Math.random() * (i + 1));
// // // //     [a[i], a[j]] = [a[j], a[i]];
// // // //   }
// // // //   return a;
// // // // }

// // // // export default function AllUsersSlider({
// // // //   endpoint = "https://bo-chat.space/allUsers",
// // // //   viewedUserId,
 
// // // // }: {
// // // //   endpoint?: string;
// // // //   viewedUserId?: string;
// // // // }) {
// // // //   const router = useRouter();
// // // //   const params = useParams();
// // // //   const profileOwnerId = (viewedUserId || params.id) as string; // صاحب المنشورات (من الرابط)

// // // //   // ---------- State for "أشخاص على مزاجك" ----------
// // // //   const [users, setUsers] = useState<UserRaw[] | null>(null);
// // // //   const [loadingPeople, setLoadingPeople] = useState(true);
// // // //   //Follow
    
// // // // const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
// // // // // const [followersMap, setFollowersMap] = useState<Record<string, UserRaw[]>>({});
// // // //  type FollowerPreview = {
// // // //   _id: string;
// // // //   name: string;
// // // //   img: string;
// // // // };

// // // // const [followersMap, setFollowersMap] = useState<Record<string, FollowerPreview[]>>({});
// // // // // ---------- State for "صور" ----------
// // // //   const [profileImages, setProfileImages] = useState<string[]>([]);
// // // //   const [loadingImages, setLoadingImages] = useState(true);
// // // //   const [imagesError, setImagesError] = useState<string | null>(null);

// // // //   // ---------- Shared UI state ----------
// // // //   const [showAllImages, setShowAllImages] = useState(false);
// // // //   const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

// // // //   const imagesScrollerRef = useRef<HTMLDivElement>(null);
// // // //   const peopleScrollerRef = useRef<HTMLDivElement>(null);

// // // //   // ---------- Get logged-in user ID from localStorage ----------
// // // //   useEffect(() => {
// // // //     const storedUserData = localStorage.getItem("userData");
// // // //     if (storedUserData) {
// // // //       try {
// // // //         const userData = JSON.parse(storedUserData);
// // // //         setLoggedInUserId(userData._id || null);
// // // //       } catch (e) {
// // // //         console.error("Failed to parse userData", e);
// // // //       }
// // // //     }
// // // //   }, []);

// // // //   // ---------- Fetch other users (for "أشخاص على مزاجك") ----------
// // // //   // useEffect(() => {
// // // //   //   if (!loggedInUserId) return;
// // // //   //   const token = localStorage.getItem("accessToken") || "";
// // // //   //   (async () => {
// // // //   //     try {
// // // //   //       const res = await fetch(endpoint, {
// // // //   //         cache: "no-store",
// // // //   //         headers: {
// // // //   //           Authorization: `Bearer ${token}`,
// // // //   //           "Content-Type": "application/json",
// // // //   //         },
// // // //   //       });
// // // //   //       const data = await res.json();
// // // //   //       const rows = Array.isArray(data) ? data : data?.data ?? [];
// // // //   //       const filtered = rows.filter((u: UserRaw) => u._id !== loggedInUserId);
// // // //   //       setUsers(shuffleArray(filtered));
// // // //   //     } catch (err) {
// // // //   //       console.error(err);
// // // //   //     } finally {
// // // //   //       setLoadingPeople(false);
// // // //   //     }
// // // //   //   })();
// // // //   // }, [endpoint, loggedInUserId]);
// // // //   useEffect(() => {
// // // //   if (!loggedInUserId) return;
// // // //   const token = localStorage.getItem("accessToken") || "";
// // // //   (async () => {
// // // //     try {
// // // //       // 1. جلب قائمة المستخدمين
// // // //       const res = await fetch(endpoint, {
// // // //         cache: "no-store",
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });
// // // //       const data = await res.json();
// // // //       const rows = Array.isArray(data) ? data : data?.data ?? [];
// // // //       const filtered = rows.filter((u: UserRaw) => u._id !== loggedInUserId);
// // // //       const shuffled = shuffleArray(filtered);
// // // //       setUsers(shuffled);

// // // //       // 2. جلب بيانات المتابعين لأول 10 مستخدمين فقط (لتحسين الأداء)
// // // //       const usersToFetch = shuffled.slice(0, 10);
// // // //       const followersPromises = usersToFetch.map(async (user) => {
// // // //         try {
// // // //           const url = `https://bo-chat.space/users/${user._id}?guestid=${loggedInUserId}`;
// // // //           const fRes = await fetch(url, {
// // // //             headers: { Authorization: `Bearer ${token}` },
// // // //           });
// // // //           const fData = await fRes.json();
// // // //           console.log("User ID:", user._id);
// // // // console.log("Followers Response:", fData);
// // // //           const followers = fData?.followers || [];
// // // //           console.log("Followers Array:", followers);

// // // //           if (followers.length > 0) {
// // // //             console.log("First Follower:", followers[0]);
// // // //           }
// // // //           return { userId: user._id, followers };
// // // //         } catch (error) {
// // // //           console.error(`Error fetching followers for ${user._id}:`, error);
// // // //           return { userId: user._id, followers: [] };
// // // //         }
// // // //       });

// // // //       const followersResults = await Promise.all(followersPromises);
// // // //       const map: Record<string, UserRaw[]> = {};
// // // //       followersResults.forEach(({ userId, followers }) => {
// // // //         // استخراج أول 3 متابعين مع بياناتهم
// // // //         const previewFollowers = followers.slice(0, 3).map((f: any) => ({
// // // //           _id: f.followerid || f._id,
// // // //           name: f.followerdata?.name || "مستخدم",
// // // //           img: f.followerdata?.img || "/icons/user.svg",
// // // //         }));
// // // //         map[userId] = previewFollowers;
// // // //       });
// // // //       setFollowersMap(map);
// // // //       console.log("Followers Map:", map);
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //     } finally {
// // // //       setLoadingPeople(false);
// // // //     }
// // // //   })();
// // // // }, [endpoint, loggedInUserId]);

// // // //   // Follow
// // // // const toggleFollow = async (userId: string, currentStatus: boolean) => {
// // // //   const token = localStorage.getItem("accessToken") || "";

// // // //   try {
// // // //     const res = await fetch("https://bo-chat.space/follow", {
// // // //       method: "POST",
// // // //       headers: {
// // // //         Authorization: `Bearer ${token}`,
// // // //         "Content-Type": "application/json",
// // // //       },
// // // //     body: JSON.stringify({
// // // //   userId: userId.toString()
// // // // })
// // // //     });

// // // //     const data = await res.json();
// // // //     console.log("Follow response:", data);

// // // //     if (!res.ok) throw new Error("Follow failed");

// // // //     // استخدم response الحقيقي بدل toggle العشوائي
// // // //     setFollowingMap(prev => ({
// // // //       ...prev,
// // // //       [userId]: data.isFollowing ?? !currentStatus,
// // // //     }));

// // // //   } catch (error) {
// // // //     console.error(error);
// // // //   }
// // // // };

// // // //   // ---------- Fetch images for the profile being viewed ----------
// // // //   // صاحب المنشورات: profileOwnerId   |   الزائر: loggedInUserId
// // // //   useEffect(() => {
// // // //     if (!profileOwnerId || !loggedInUserId) return;

// // // //     const fetchProfileImages = async () => {
// // // //       setLoadingImages(true);
// // // //       setImagesError(null);
// // // //       const token = localStorage.getItem("accessToken") || "";
// // // //       // الرابط الصحيح: https://bo-chat.space/myposts/{ownerId}?guestid={visitorId}
// // // //       const url = `https://bo-chat.space/myposts/${profileOwnerId}?guestid=${loggedInUserId}&page=1&limit=50`;

// // // //       try {
// // // //         const res = await fetch(url, {
// // // //           headers: {
// // // //             Authorization: `Bearer ${token}`,
// // // //             "Content-Type": "application/json",
// // // //           },
// // // //         });
// // // //         if (!res.ok) throw new Error(`HTTP ${res.status}`);
// // // //         const data = await res.json();

// // // //         let posts: MyPost[] = [];
// // // //         if (Array.isArray(data)) posts = data;
// // // //         else if (data.posts && Array.isArray(data.posts)) posts = data.posts;
// // // //         else if (data.data && Array.isArray(data.data)) posts = data.data;

// // // //         const images: string[] = [];
// // // //         posts.forEach((post) => {
// // // //           if (post.type === "image" && Array.isArray(post.image)) {
// // // //             post.image.forEach((img) => {
// // // //               if (img?.image) images.push(img.image);
// // // //             });
// // // //           }
// // // //         });
// // // //         setProfileImages(images);
// // // //       } catch (err: any) {
// // // //         console.error("Error fetching profile images:", err);
// // // //         setImagesError(err.message || "حدث خطأ أثناء تحميل الصور");
// // // //       } finally {
// // // //         setLoadingImages(false);
// // // //       }
// // // //     };

// // // //     fetchProfileImages();
// // // //   }, [profileOwnerId, loggedInUserId]);

// // // //   // Scroll helpers
// // // //   const scrollByAmount = 320;
// // // //   const scrollImagesLeft = () => {
// // // //     imagesScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// // // //   };
// // // //   const scrollImagesRight = () => {
// // // //     imagesScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// // // //   };
// // // //   const scrollPeopleLeft = () => {
// // // //     peopleScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// // // //   };
// // // //   const scrollPeopleRight = () => {
// // // //     peopleScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// // // //   };

// // // //   const goToProfile = (id: string) => {
// // // //     router.push(`/profile/${id}`);
// // // //   };

// // // //   const truncate = (str: string | undefined, max: number) => {
// // // //     if (!str) return "";
// // // //     return str.length > max ? str.slice(0, max) + "..." : str;
// // // //   };

// // // //   const toggleAllImages = () => {
// // // //     setShowAllImages(!showAllImages);
// // // //   };

// // // //   const hasImages = !loadingImages && !imagesError && profileImages.length > 0;
// // // //   const noImages = !loadingImages && (imagesError || profileImages.length === 0);

// // // //   return (
// // // //     <section className="relative w-full space-y-8">
// // // //       {/* ===== سلايدر الصور ===== */}
// // // //       <div className="relative">
// // // //         <div className="flex items-center justify-between px-2">
// // // //           <h2 className="text-2xl mb-3">صور</h2>
// // // //           {/* السهم (أيقونة التبديل) يظهر دائماً */}
// // // //           <button
// // // //             onClick={toggleAllImages}
// // // //             className="mb-3 p-1 rounded-full hover:bg-gray-200 transition"
// // // //             aria-label={showAllImages ? "إخفاء كل الصور" : "عرض كل الصور"}
// // // //           >
// // // //             <img src="/imgs/Vector (5).svg"  className="w-[17px] h-[15px]  opacity-100" alt="toggle" />
// // // //           </button>
// // // //         </div>

// // // //         {loadingImages && (
// // // //           <div className="flex gap-4 overflow-hidden px-2">
// // // //             {Array.from({ length: 3 }).map((_, i) => (
// // // //               <div key={i} className="w-[183px] h-[242px] bg-gray-200 rounded-[30px] animate-pulse shrink-0" />
// // // //             ))}
// // // //           </div>
// // // //         )}

// // // //         {/* حالة عدم وجود صور: نعرض الرسالة فقط إذا كان showAllImages = true */}
// // // //         {noImages && showAllImages && (
// // // //           <div className="flex flex-col items-center justify-center text-center py-55 px-2">
// // // //             <img src="/imgs/Group 9156.svg" alt="No images" />
// // // //             <p className="font-cairo font-medium text-[30px] leading-[100%] text-center text-black mt-4">
// // // //               مفيش صور هنا دلوقتي
// // // //             </p>
// // // //             <p className="font-cairo font-normal text-[20px] leading-[30px] text-center text-black mt-2">
// // // //               لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا
// // // //             </p>
// // // //           </div>
// // // //         )}

// // // //         {/* حالة وجود صور: نعرض السلايدر أو الشبكة حسب showAllImages */}
// // // //         {hasImages && (
// // // //           <>
// // // //             {!showAllImages && (
// // // //               <>
// // // //                 <button
// // // //                   onClick={scrollImagesLeft}
// // // //                   className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // // //                   aria-label="تمرير لليسار"
// // // //                 >
// // // //                   <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={scrollImagesRight}
// // // //                   className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // // //                   aria-label="تمرير لليمين"
// // // //                 >
// // // //                   <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// // // //                 </button>
// // // //                 <div
// // // //                   ref={imagesScrollerRef}
// // // //                   // className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// // // //                    className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// // // //                   dir="ltr"
// // // //                 >
// // // //                   {profileImages.map((imgUrl, idx) => (
// // // //                     <div
// // // //                       key={idx}
// // // //                       className="shrink-0 cursor-pointer"
// // // //                       style={{ width: "183px", height: "242px" }}
// // // //                       onClick={() => goToProfile(profileOwnerId)}
// // // //                     >
// // // //                       <div className="relative w-full h-full overflow-hidden rounded-[30px]">
// // // //                         <img
// // // //                           className="w-full h-full object-cover"
// // // //                           alt={`صورة ${idx + 1}`}
// // // //                           src={imgUrl}
// // // //                           onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
// // // //                         />
// // // //                       </div>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               </>
// // // //             )}

// // // //             {showAllImages && (
// // // //               <div className="mt-4 px-2 flex flex-col gap-4">
// // // //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// // // //                   {profileImages.map((imgUrl, idx) => (
// // // //                     <div
// // // //                       key={idx}
// // // //                       className="cursor-pointer"
// // // //                       onClick={() => goToProfile(profileOwnerId)}
// // // //                     >
// // // //                       <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-md">
// // // //                         <img
// // // //                           className="w-full h-full object-cover"
// // // //                           alt={`صورة ${idx + 1}`}
// // // //                           src={imgUrl}
// // // //                           onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
// // // //                         />
// // // //                       </div>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </>
// // // //         )}

// // // //         {/* إذا كانت noImages و showAllImages == false، لا نعرض شيئاً (فراغ خفيف) */}
// // // //         {noImages && !showAllImages && (
// // // //           <div className="py-4 text-center text-gray-400">
// // // //             {/* يمكنك وضع أي عنصر فارغ هنا، أو حذفه تماماً */}
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* ===== سلايدر أشخاص على مزاجك ===== */}
// // // //       <div className="relative">
// // // //         <h2 className="text-2xl mb-3 px-2">أشخاص على مزاجك</h2>

// // // //         {loadingPeople && (
// // // //           <div className="flex gap-3 overflow-hidden px-2">
// // // //             {Array.from({ length: 3 }).map((_, i) => (
// // // //               <div key={i} className="w-[163px] h-[280px] bg-gray-200 rounded-2xl animate-pulse shrink-0" />
// // // //             ))}
// // // //           </div>
// // // //         )}

// // // //         {!loadingPeople && (!users || users.length === 0) && (
// // // //           <p className="text-gray-500 px-2">لا يوجد مستخدمين آخرين.</p>
// // // //         )}

// // // //         {!loadingPeople && users && users.length > 0 && (
// // // //           <>
// // // //             <button
// // // //               onClick={scrollPeopleLeft}
// // // //               className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // // //               aria-label="تمرير لليسار"
// // // //             >
// // // //               <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// // // //             </button>
// // // //             <button
// // // //               onClick={scrollPeopleRight}
// // // //               className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // // //               aria-label="تمرير لليمين"
// // // //             >
// // // //               <img src="/imgs/arrowright.svg"className="w-[18px] h-[15px] opacity-100" alt="right" />
// // // //             </button>

// // // //             <div
// // // //   ref={peopleScrollerRef}
// // // //   className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// // // //   dir="ltr"
// // // // >
// // // //   {users.map((u) => {
// // // //      const isFollowing = followingMap[u._id] ?? false;
// // // //      console.log("Current User:", u._id);
// // // // console.log("Followers:", followersMap[u._id]);
// // // //   const userFollowers = followersMap[u._id] || [];
// // // //   const displayFollowers = userFollowers.slice(0, 3);

// // // //     return (
// // // //       <div
// // // //         key={u._id}
// // // //         className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px] shrink-0"
// // // //       >
// // // //         <div
// // // //           role="button"
// // // //           tabIndex={0}
// // // //           onClick={() => goToProfile(u._id)}
// // // //           onKeyDown={(e) => {
// // // //             if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
// // // //           }}
// // // //           className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
// // // //         >
// // // //           <img
// // // //             className="w-[153px] h-[153px] rounded-full object-cover"
// // // //             alt={u.name ?? "User"}
// // // //             src={u?.img || "/icons/user.svg"}
// // // //             onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
// // // //           />
// // // //           {/* التقييم برقم عشري واحد */}
          
// // // //           <div className="absolute bottom-0 left-3 w-8 h-8 rounded-full bg-white border border-[#FBFBFB] flex items-center justify-center gap-0.5">
// // // //           <img
// // // //             src="/icons/star.svg"
// // // //             width={7}
// // // //             height={13}
// // // //             className="w-[7px] h-[13px]"
// // // //             alt=""
// // // //           />
// // // //           <p className="font-cairo font-bold text-[12px] leading-[165%] text-right text-black">
// // // //           {Number.isInteger(parseFloat(u.rate)) ? parseFloat(u.rate).toString() : parseFloat(u.rate).toFixed(1)}
// // // //         </p>
// // // //         </div>
// // // //         </div>
// // // //         <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
// // // //           {truncate(u.name, 10)}
// // // //         </h3>
// // // //         <p className="text-gray-500 me-2 text-right text-[9px]">
// // // //           @{truncate(u.username, 10)}
// // // //         </p>
// // // //         <div className="mt-3 flex justify-center">
       

// // // //       {/* عرض المتابعين */}
// // // //  <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center">
// // // //   {Array.from({ length: 3 }).map((_, i) => {
// // // //     const follower = displayFollowers[i];
// // // //     return (
// // // //       <img
// // // //         key={i}
// // // //         src={follower?.img || "/icons/user.svg"}
// // // //         className="w-[18px] h-[18px] rounded-full object-cover border border-[#F6F6F6] -ml-1 first:ml-0"
// // // //         style={{ zIndex: 3 - i }}
// // // //         alt={follower?.name || "user"}
// // // //       />
// // // //     );
// // // //   })}
// // // //   <span className="mr-1">+{u.visit ?? 0}</span>
// // // // </span>

// // // //           {/* زر المتابعة التفاعلي */}
// // // //           <button
// // // //             onClick={() => toggleFollow(u._id, isFollowing)}
// // // //             className={`px-3 py-2 flex items-center gap-3 rounded-full border cursor-pointer text-sm ${
// // // //               isFollowing
// // // //                 ? "border-[#D72229] text-[#D72229] bg-white"
// // // //                 : "border-[#D72229] text-[#D72229]"
// // // //             }`}
// // // //           >
// // // //             <img src="/icons/follow.svg" className="w-4 h-4" alt="" />
// // // //             {isFollowing ? "إلغاء المتابعة" : "متابعه"}
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   })}
// // // // </div>
// // // //           </>
// // // //         )}
// // // //       </div>
// // // //     </section>
// // // //   );
// // // // }




// // // // ظظظظظظظظظظظظظظظظظظظظظ
// // // "use client";
// // // import React, { useEffect, useRef, useState } from "react";
// // // import { useRouter, useParams } from "next/navigation";

// // // type UserRaw = {
// // //   rate: string;
// // //   _id: string;
// // //   name?: string;
// // //   username?: string;
// // //   img?: string;
// // //   visit?: number;
// // //   followers?: any[];
// // //   requestedFollow?: boolean; // قد يرد من API
// // // };

// // // type MyPost = {
// // //   _id: string;
// // //   type?: string;
// // //   image?: {
// // //     image: string;
// // //     width?: string;
// // //     height?: string;
// // //   }[];
// // // };

// // // function shuffleArray<T>(arr: T[]) {
// // //   const a = arr.slice();
// // //   for (let i = a.length - 1; i > 0; i--) {
// // //     const j = Math.floor(Math.random() * (i + 1));
// // //     [a[i], a[j]] = [a[j], a[i]];
// // //   }
// // //   return a;
// // // }

// // // export default function AllUsersSlider({
// // //   endpoint = "https://bo-chat.space/allUsers",
// // //   viewedUserId,
// // // }: {
// // //   endpoint?: string;
// // //   viewedUserId?: string;
// // // }) {
// // //   const router = useRouter();
// // //   const params = useParams();
// // //   const profileOwnerId = (viewedUserId || params.id) as string;

// // //   // ---------- State for "أشخاص على مزاجك" ----------
// // //   const [users, setUsers] = useState<UserRaw[] | null>(null);
// // //   const [loadingPeople, setLoadingPeople] = useState(true);
// // //   const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
// // //   const [followLoadingMap, setFollowLoadingMap] = useState<Record<string, boolean>>({});
// // //   type FollowerPreview = { _id: string; name: string; img: string };
// // //   const [followersMap, setFollowersMap] = useState<Record<string, FollowerPreview[]>>({});
// // // const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>({});
// // //   // ---------- State for "صور" ----------
// // //   const [profileImages, setProfileImages] = useState<string[]>([]);
// // //   const [loadingImages, setLoadingImages] = useState(true);
// // //   const [imagesError, setImagesError] = useState<string | null>(null);
// // //   const [showAllImages, setShowAllImages] = useState(false);
// // //   const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

// // //   const imagesScrollerRef = useRef<HTMLDivElement>(null);
// // //   const peopleScrollerRef = useRef<HTMLDivElement>(null);

// // //   // ---------- Toast state ----------
// // //   const [toastMessage, setToastMessage] = useState<string | null>(null);
// // //   const [toastType, setToastType] = useState<"success" | "error">("success");

// // //   const showToast = (message: string, type: "success" | "error" = "success") => {
// // //     setToastMessage(message);
// // //     setToastType(type);
// // //     setTimeout(() => setToastMessage(null), 3000);
// // //   };

// // //   // ---------- Get logged-in user ID ----------
// // //   useEffect(() => {
// // //     const storedUserData = localStorage.getItem("userData");
// // //     if (storedUserData) {
// // //       try {
// // //         const userData = JSON.parse(storedUserData);
// // //         setLoggedInUserId(userData._id || null);
// // //       } catch (e) {
// // //         console.error("Failed to parse userData", e);
// // //       }
// // //     }
// // //   }, []);

// // //   // ---------- Fetch users + followers + initial follow status ----------
// // //   useEffect(() => {
// // //     if (!loggedInUserId) return;
// // //     const token = localStorage.getItem("accessToken") || "";
// // //     (async () => {
// // //       try {
// // //         // 1. جلب قائمة المستخدمين
// // //         const res = await fetch(endpoint, {
// // //           cache: "no-store",
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
// // //         const data = await res.json();
// // //         const rows = Array.isArray(data) ? data : data?.data ?? [];
// // //         const filtered = rows.filter((u: UserRaw) => u._id !== loggedInUserId);
// // //         const shuffled = shuffleArray(filtered);
// // //         setUsers(shuffled);

// // //         // 2. جلب بيانات المتابعين وحالة المتابعة لأول 10 مستخدمين
// // //         const usersToFetch = shuffled.slice(0, 10);
// // //         const promises = usersToFetch.map(async (user) => {
// // //           try {
// // //             const url = `https://bo-chat.space/users/${user._id}?guestid=${loggedInUserId}`;
// // //             const fRes = await fetch(url, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             });
// // //             const fData = await fRes.json();
// // //             const followers = fData?.followers ?? [];
// // //             // const followers = fData?.followers || [];
// // //             const totalCount = followers.length; // العدد الكلي
// // //             const requestedFollow = fData?.requestedFollow || false; // حالة المتابعة من API

// // //             // تجهيز معاينة المتابعين (أول 3)
// // //             // const previewFollowers = followers.slice(0, 3).map((f: any) => ({
// // //             //   _id: f.followerid || f._id,
// // //             //   name: f.followerdata?.name || "مستخدم",
// // //             //   img: f.followerdata?.img || "/icons/user.svg",
// // //             // }));
// // //             const previewFollowers: FollowerPreview[] = followers
// // //             .slice(0, 3)
// // //             .map((f: any) => ({
// // //               _id: f.followerid,
// // //               name: f.followerdata?.name ?? "User",
// // //               img: f.followerdata?.img ?? "/icons/user.svg",
// // //             }));

// // //             return { userId: user._id, followers: previewFollowers, requestedFollow };
// // //           } catch (error) {
// // //             console.error(`Error fetching data for ${user._id}:`, error);
// // //             return { userId: user._id, followers: [], requestedFollow: false };
// // //           }
// // //         });

// // //         const results = await Promise.all(promises);
// // //         // const followersMapTemp: Record<string, FollowerPreview[]> = {};
// // //         // const followingMapTemp: Record<string, boolean> = {};
// // //         // ////////////////
// // //         const followersMapTemp: Record<string, FollowerPreview[]> = {};
// // // const followersCountMapTemp: Record<string, number> = {};
// // // const followingMapTemp: Record<string, boolean> = {};

// // // // /////////////
// // //         results.forEach(({ userId, followers,count, requestedFollow }) => {
// // //           followersMapTemp[userId] = followers;
// // //           followersCountMapTemp[userId] = count; // ← العدد الكلي
// // //           followingMapTemp[userId] = requestedFollow;
// // //         });

// // //         setFollowersMap(followersMapTemp);
// // //         setFollowingMap(followingMapTemp);
// // //       } catch (err) {
// // //         console.error(err);
// // //         showToast("حدث خطأ أثناء تحميل البيانات", "error");
// // //       } finally {
// // //         setLoadingPeople(false);
// // //       }
// // //     })();
// // //   }, [endpoint, loggedInUserId]);

// // //   // ---------- دالة المتابعة / إلغاء المتابعة ----------
   
// // // const toggleFollow = async (userId: string, currentStatus: boolean) => {
// // //   const token = localStorage.getItem("accessToken") || "";
// // //   if (!token) {
// // //     showToast("يجب تسجيل الدخول أولاً", "error");
// // //     return;
// // //   }
// // //   if (followLoadingMap[userId]) return;
// // //   setFollowLoadingMap((prev) => ({ ...prev, [userId]: true }));

// // //   const newStatus = !currentStatus;
// // //   setFollowingMap((prev) => ({ ...prev, [userId]: newStatus }));

// // //   try {
// // //     const res = await fetch("https://bo-chat.space/follow", {
// // //       method: "POST",
// // //       headers: {
// // //         Authorization: `Bearer ${token}`,
// // //         "Content-Type": "application/json",
// // //       },
// // //       body: JSON.stringify({
// // //         followerid: loggedInUserId, // المستخدم الحالي
// // //         followingid: userId, // المستخدم المطلوب متابعته
// // //       }),
// // //     });

// // //     const data = await res.json();
// // //     console.log("Follow response:", data);

// // //     if (!res.ok) {
// // //       throw new Error(data.message || "فشل تحديث المتابعة");
// // //     }

// // //     // بناءً على نجاح الطلب، نعتبر أن الحالة تغيرت
// // //     // يمكن أن يعيد الخادم isFollowing أو أي إشارة
// // //     // لكننا بالفعل قمنا بتحديث الـ UI مسبقاً، ونتركها كما هي
// // //     showToast(newStatus ? "تم المتابعة بنجاح" : "تم إلغاء المتابعة", "success");
// // //   } catch (error: any) {
// // //     console.error("Toggle follow error:", error);
// // //     setFollowingMap((prev) => ({ ...prev, [userId]: currentStatus }));
// // //     showToast(error.message || "حدث خطأ أثناء محاولة المتابعة", "error");
// // //   } finally {
// // //     setFollowLoadingMap((prev) => ({ ...prev, [userId]: false }));
// // //   }
// // // };
// // //   // ---------- باقي الدوال (جلب الصور، التمرير، إلخ) ----------
// // //   useEffect(() => {
// // //     if (!profileOwnerId || !loggedInUserId) return;
// // //     const fetchProfileImages = async () => {
// // //       setLoadingImages(true);
// // //       setImagesError(null);
// // //       const token = localStorage.getItem("accessToken") || "";
// // //       const url = `https://bo-chat.space/myposts/${profileOwnerId}?guestid=${loggedInUserId}&page=1&limit=50`;
// // //       try {
// // //         const res = await fetch(url, {
// // //           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// // //         });
// // //         if (!res.ok) throw new Error(`HTTP ${res.status}`);
// // //         const data = await res.json();
// // //         let posts: MyPost[] = [];
// // //         if (Array.isArray(data)) posts = data;
// // //         else if (data.posts && Array.isArray(data.posts)) posts = data.posts;
// // //         else if (data.data && Array.isArray(data.data)) posts = data.data;

// // //         const images: string[] = [];
// // //         posts.forEach((post) => {
// // //           if (post.type === "image" && Array.isArray(post.image)) {
// // //             post.image.forEach((img) => {
// // //               if (img?.image) images.push(img.image);
// // //             });
// // //           }
// // //         });
// // //         setProfileImages(images);
// // //       } catch (err: any) {
// // //         console.error("Error fetching profile images:", err);
// // //         setImagesError(err.message || "حدث خطأ أثناء تحميل الصور");
// // //       } finally {
// // //         setLoadingImages(false);
// // //       }
// // //     };
// // //     fetchProfileImages();
// // //   }, [profileOwnerId, loggedInUserId]);

// // //   // Scroll helpers
// // //   const scrollByAmount = 320;
// // //   const scrollImagesLeft = () => {
// // //     imagesScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// // //   };
// // //   const scrollImagesRight = () => {
// // //     imagesScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// // //   };
// // //   const scrollPeopleLeft = () => {
// // //     peopleScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// // //   };
// // //   const scrollPeopleRight = () => {
// // //     peopleScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// // //   };

// // //   const goToProfile = (id: string) => {
// // //     router.push(`/profile/${id}`);
// // //   };

// // //   const truncate = (str: string | undefined, max: number) => {
// // //     if (!str) return "";
// // //     return str.length > max ? str.slice(0, max) + "..." : str;
// // //   };

// // //   const toggleAllImages = () => {
// // //     setShowAllImages(!showAllImages);
// // //   };

// // //   const hasImages = !loadingImages && !imagesError && profileImages.length > 0;
// // //   const noImages = !loadingImages && (imagesError || profileImages.length === 0);

// // //   return (
// // //     <section className="relative w-full space-y-8">
// // //       {/* Toast */}
// // //       {toastMessage && (
// // //         <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] p-3 rounded-lg shadow-lg text-sm font-medium ${
// // //           toastType === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"
// // //         }`}>
// // //           {toastMessage}
// // //         </div>
// // //       )}

// // //       {/* ===== سلايدر الصور ===== */}
// // //       <div className="relative">
// // //         <div className="flex items-center justify-between px-2">
// // //           <h2 className="text-2xl mb-3">صور</h2>
// // //           <button
// // //             onClick={toggleAllImages}
// // //             className="mb-3 p-1 rounded-full hover:bg-gray-200 transition"
// // //             aria-label={showAllImages ? "إخفاء كل الصور" : "عرض كل الصور"}
// // //           >
// // //             <img src="/imgs/Vector (5).svg" className="w-[17px] h-[15px] opacity-100" alt="toggle" />
// // //           </button>
// // //         </div>

// // //         {loadingImages && (
// // //           <div className="flex gap-4 overflow-hidden px-2">
// // //             {Array.from({ length: 3 }).map((_, i) => (
// // //               <div key={i} className="w-[183px] h-[242px] bg-gray-200 rounded-[30px] animate-pulse shrink-0" />
// // //             ))}
// // //           </div>
// // //         )}

// // //         {noImages && showAllImages && (
// // //           <div className="flex flex-col items-center justify-center text-center py-55 px-2">
// // //             <img src="/imgs/Group 9156.svg" alt="No images" />
// // //             <p className="font-cairo font-medium text-[30px] leading-[100%] text-center text-black mt-4">
// // //               مفيش صور هنا دلوقتي
// // //             </p>
// // //             <p className="font-cairo font-normal text-[20px] leading-[30px] text-center text-black mt-2">
// // //               لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا
// // //             </p>
// // //           </div>
// // //         )}

// // //         {hasImages && (
// // //           <>
// // //             {!showAllImages && (
// // //               <>
// // //                 <button
// // //                   onClick={scrollImagesLeft}
// // //                   className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // //                   aria-label="تمرير لليسار"
// // //                 >
// // //                   <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// // //                 </button>
// // //                 <button
// // //                   onClick={scrollImagesRight}
// // //                   className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // //                   aria-label="تمرير لليمين"
// // //                 >
// // //                   <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// // //                 </button>
// // //                 <div
// // //                   ref={imagesScrollerRef}
// // //                   className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// // //                   dir="ltr"
// // //                 >
// // //                   {profileImages.map((imgUrl, idx) => (
// // //                     <div
// // //                       key={idx}
// // //                       className="shrink-0 cursor-pointer"
// // //                       style={{ width: "183px", height: "242px" }}
// // //                       onClick={() => goToProfile(profileOwnerId)}
// // //                     >
// // //                       <div className="relative w-full h-full overflow-hidden rounded-[30px]">
// // //                         <img
// // //                           className="w-full h-full object-cover"
// // //                           alt={`صورة ${idx + 1}`}
// // //                           src={imgUrl}
// // //                           onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </>
// // //             )}
// // //             {showAllImages && (
// // //               <div className="mt-4 px-2 flex flex-col gap-4">
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// // //                   {profileImages.map((imgUrl, idx) => (
// // //                     <div
// // //                       key={idx}
// // //                       className="cursor-pointer"
// // //                       onClick={() => goToProfile(profileOwnerId)}
// // //                     >
// // //                       <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-md">
// // //                         <img
// // //                           className="w-full h-full object-cover"
// // //                           alt={`صورة ${idx + 1}`}
// // //                           src={imgUrl}
// // //                           onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </>
// // //         )}

// // //         {noImages && !showAllImages && (
// // //           <div className="py-4 text-center text-gray-400"></div>
// // //         )}
// // //       </div>

// // //       {/* ===== سلايدر أشخاص على مزاجك ===== */}
// // //       <div className="relative">
// // //         <h2 className="text-2xl mb-3 px-2">أشخاص على مزاجك</h2>

// // //         {loadingPeople && (
// // //           <div className="flex gap-3 overflow-hidden px-2">
// // //             {Array.from({ length: 3 }).map((_, i) => (
// // //               <div key={i} className="w-[163px] h-[280px] bg-gray-200 rounded-2xl animate-pulse shrink-0" />
// // //             ))}
// // //           </div>
// // //         )}

// // //         {!loadingPeople && (!users || users.length === 0) && (
// // //           <p className="text-gray-500 px-2">لا يوجد مستخدمين آخرين.</p>
// // //         )}

// // //         {!loadingPeople && users && users.length > 0 && (
// // //           <>
// // //             <button
// // //               onClick={scrollPeopleLeft}
// // //               className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // //               aria-label="تمرير لليسار"
// // //             >
// // //               <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// // //             </button>
// // //             <button
// // //               onClick={scrollPeopleRight}
// // //               className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // //               aria-label="تمرير لليمين"
// // //             >
// // //               <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// // //             </button>

// // //             <div
// // //               ref={peopleScrollerRef}
// // //               className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// // //               dir="ltr"
// // //             >
// // //               {users.map((u) => {
// // //                 const isFollowing = followingMap[u._id] ?? false;
// // //                 const isLoading = followLoadingMap[u._id] ?? false;
// // //                 const userFollowers = followersMap[u._id] || [];
// // //                 const totalFollowers = followersCountMap[u._id] ?? 0;

// // //                 // const displayFollowers = userFollowers.slice(0, 3);
// // //               const displayFollowers =
// // //                 userFollowers?.length > 0 ? userFollowers.slice(0, 3) : [];
// // //                 return (
// // //                   <div
// // //                     key={u._id}
// // //                     className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px] shrink-0"
// // //                   >
// // //                     <div
// // //                       role="button"
// // //                       tabIndex={0}
// // //                       onClick={() => goToProfile(u._id)}
// // //                       onKeyDown={(e) => {
// // //                         if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
// // //                       }}
// // //                       className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
// // //                     >
// // //                       <img
// // //                         className="w-[153px] h-[153px] rounded-full object-cover"
// // //                         alt={u.name ?? "User"}
// // //                         src={u?.img || "/icons/user.svg"}
// // //                         onError={(e) => { e.currentTarget.src = "/icons/user.svg"; }}
// // //                       />
// // //                       <div className="absolute bottom-0 left-3 w-8 h-8 rounded-full bg-white border border-[#FBFBFB] flex items-center justify-center gap-0.5">
// // //                         <img
// // //                           src="/icons/star.svg"
// // //                           width={7}
// // //                           height={13}
// // //                           className="w-[7px] h-[13px]"
// // //                           alt=""
// // //                         />
// // //                         <p className="font-cairo font-bold text-[12px] leading-[165%] text-right text-black">
// // //                           {Number.isInteger(parseFloat(u.rate))
// // //                             ? parseFloat(u.rate).toString()
// // //                             : parseFloat(u.rate).toFixed(1)}
// // //                         </p>
// // //                       </div>
// // //                     </div>
// // //                     <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
// // //                       {truncate(u.name, 10)}
// // //                     </h3>
// // //                     <p className="text-gray-500 me-2 text-right text-[9px]">
// // //                       @{truncate(u.username, 10)}
// // //                     </p>
// // //                     <div className="mt-3 flex justify-center">
// // //                       {/* عرض المتابعين */}
// // //                       {/* <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center">
// // //                       {displayFollowers.map((follower, i) => (
// // //                       <img
// // //                         key={i}
// // //                         src={follower?.img || "/icons/user.svg"}
// // //                         className="w-[18px] h-[18px] rounded-full object-cover border border-[#F6F6F6] -ml-1 first:ml-0"
// // //                         style={{ zIndex: 3 - i }}
// // //                         alt={follower?.name || "user"}
// // //                       />
// // //                     ))}
// // //                     <span className="mr-1">+{userFollowers.length}</span>
// // //                       </span> */}
// // //                       <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center">
  
// // //   {userFollowers.length > 0 ? (
// // //     displayFollowers.map((follower, i) => (
// // //       <img
// // //         key={i}
// // //         src={follower?.img || "/icons/user.svg"}
// // //         className="w-[18px] h-[18px] rounded-full object-cover border border-[#F6F6F6] -ml-1 first:ml-0"
// // //         style={{ zIndex: 3 - i }}
// // //         alt={follower?.name || "user"}
// // //       />
// // //     ))
// // //   ) : (
// // //     // 👇 fallback لما مفيش followers
// // //     <img
// // //       src="/icons/user.svg"
// // //       className="w-[18px] h-[18px] rounded-full object-cover"
// // //       alt="no followers"
// // //     />
// // //   )}

// // //   <span className="mr-1">
// // //     +{totalFollowers}
// // //   </span>
// // // </span>

// // //                       {/* زر المتابعة */}
// // //                     <button
// // //                       onClick={() => toggleFollow(u._id, isFollowing)}
// // //                       disabled={isLoading}
// // //                       className={`
// // //                         w-[70px] h-[30px]
// // //                         flex items-center justify-center gap-1
// // //                         rounded-full border
// // //                         text-[12px] font-semibold leading-[100%]
// // //                         transition-all
// // //                         ${isFollowing
// // //                           ? "border-[#D72229] text-[#D72229] bg-white"
// // //                           : "border-[#ffffff] text-[#000000] bg-white"
// // //                         }
// // //                         ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#D72229] hover:text-white"}
// // //                       `}
// // //                       style={{
// // //                         fontFamily: "Cairo, sans-serif",
// // //                         verticalAlign: "middle",
// // //                       }}
// // //                     >
// // //                       <img
// // //                         src={isFollowing ? "/icons/follow.svg":"/icons/Vector (13).svg"}
// // //                         className="w-[14px] h-[14px] object-contain"
// // //                         alt=""
// // //                       />
// // //                       <span>{isLoading ? "جاري..." : isFollowing ? "إلغاء" : "متابعه"}</span>
// // //                     </button>
// // //                     </div>
// // //                   </div>
// // //                 );
// // //               })}
// // //                            </div>
// // //           </>
// // //         )}
// // //       </div>
// // //     </section>
// // //   );
// // // }

// // // "use client";
// // // import React, { useEffect, useRef, useState } from "react";
// // // import { useRouter, useParams } from "next/navigation";

// // // type UserRaw = {
// // //   rate: string;
// // //   _id: string;
// // //   name?: string;
// // //   username?: string;
// // //   img?: string;
// // //   visit?: number;
// // //   followers?: any[];
// // //   requestedFollow?: boolean;
// // // };

// // // type MyPost = {
// // //   _id: string;
// // //   type?: string;
// // //   image?: {
// // //     image: string;
// // //     width?: string;
// // //     height?: string;
// // //   }[];
// // // };

// // // function shuffleArray<T>(arr: T[]) {
// // //   const a = arr.slice();
// // //   for (let i = a.length - 1; i > 0; i--) {
// // //     const j = Math.floor(Math.random() * (i + 1));
// // //     [a[i], a[j]] = [a[j], a[i]];
// // //   }
// // //   return a;
// // // }

// // // export default function AllUsersSlider({
// // //   endpoint = "https://bo-chat.space/allUsers",
// // //   viewedUserId,
// // // }: {
// // //   endpoint?: string;
// // //   viewedUserId?: string;
// // // }) {
// // //   const router = useRouter();
// // //   const params = useParams();
// // //   const profileOwnerId = (viewedUserId || params.id) as string;

// // //   // ---------- State for "أشخاص على مزاجك" ----------
// // //   const [users, setUsers] = useState<UserRaw[] | null>(null);
// // //   const [loadingPeople, setLoadingPeople] = useState(true);
// // //   const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
// // //   const [followLoadingMap, setFollowLoadingMap] = useState<Record<string, boolean>>({});
// // //   type FollowerPreview = { _id: string; name: string; img: string };
// // //   const [followersMap, setFollowersMap] = useState<Record<string, FollowerPreview[]>>({});
// // //   const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>({});

// // //   // ---------- State for "صور" ----------
// // //   const [profileImages, setProfileImages] = useState<string[]>([]);
// // //   const [loadingImages, setLoadingImages] = useState(true);
// // //   const [imagesError, setImagesError] = useState<string | null>(null);
// // //   const [showAllImages, setShowAllImages] = useState(false);
// // //   const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

// // //   const imagesScrollerRef = useRef<HTMLDivElement>(null);
// // //   const peopleScrollerRef = useRef<HTMLDivElement>(null);

// // //   // ---------- Toast state ----------
// // //   const [toastMessage, setToastMessage] = useState<string | null>(null);
// // //   const [toastType, setToastType] = useState<"success" | "error">("success");

// // //   const showToast = (message: string, type: "success" | "error" = "success") => {
// // //     setToastMessage(message);
// // //     setToastType(type);
// // //     setTimeout(() => setToastMessage(null), 3000);
// // //   };

// // //   // ---------- Get logged-in user ID ----------
// // //   useEffect(() => {
// // //     const storedUserData = localStorage.getItem("userData");
// // //     if (storedUserData) {
// // //       try {
// // //         const userData = JSON.parse(storedUserData);
// // //         setLoggedInUserId(userData._id || null);
// // //       } catch (e) {
// // //         console.error("Failed to parse userData", e);
// // //       }
// // //     }
// // //   }, []);

// // //   // ---------- Fetch users + followers + initial follow status ----------
// // //   useEffect(() => {
// // //     if (!loggedInUserId) return;
// // //     const token = localStorage.getItem("accessToken") || "";
// // //     (async () => {
// // //       try {
// // //         // 1. جلب قائمة المستخدمين
// // //         const res = await fetch(endpoint, {
// // //           cache: "no-store",
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
// // //         const data = await res.json();
// // //         const rows = Array.isArray(data) ? data : data?.data ?? [];
// // //         const filtered = rows.filter((u: UserRaw) => u._id !== loggedInUserId);
// // //         const shuffled = shuffleArray(filtered);
// // //         setUsers(shuffled);

// // //         // 2. جلب بيانات المتابعين وحالة المتابعة لأول 10 مستخدمين
// // //         const usersToFetch = shuffled.slice(0, 10);
// // //         const promises = usersToFetch.map(async (user) => {
// // //           try {
// // //             const url = `https://bo-chat.space/users/${user._id}?guestid=${loggedInUserId}`;
// // //             const fRes = await fetch(url, {
// // //               headers: { Authorization: `Bearer ${token}` },
// // //             });
// // //             const fData = await fRes.json();
// // //             const followers = fData?.followers ?? [];
// // //             const totalCount = followers.length; // العدد الكلي

// // //             const requestedFollow = fData?.requestedFollow || false; // حالة المتابعة

// // //             // معاينة أول 3 متابعين
// // //             const previewFollowers: FollowerPreview[] = followers
// // //               .slice(0, 3)
// // //               .map((f: any) => ({
// // //                 _id: f.followerid,
// // //                 name: f.followerdata?.name ?? "User",
// // //                 img: f.followerdata?.img ?? "/icons/user.svg",
// // //               }));

// // //             return { userId: user._id, followers: previewFollowers, count: totalCount, requestedFollow };
// // //           } catch (error) {
// // //             console.error(`Error fetching data for ${user._id}:`, error);
// // //             return { userId: user._id, followers: [], count: 0, requestedFollow: false };
// // //           }
// // //         });

// // //         const results = await Promise.all(promises);
// // //         const followersMapTemp: Record<string, FollowerPreview[]> = {};
// // //         const followersCountMapTemp: Record<string, number> = {};
// // //         const followingMapTemp: Record<string, boolean> = {};

// // //         results.forEach(({ userId, followers, count, requestedFollow }) => {
// // //           followersMapTemp[userId] = followers;
// // //           followersCountMapTemp[userId] = count;
// // //           followingMapTemp[userId] = requestedFollow;
// // //         });

// // //         setFollowersMap(followersMapTemp);
// // //         setFollowersCountMap(followersCountMapTemp);
// // //         setFollowingMap(followingMapTemp);
// // //       } catch (err) {
// // //         console.error(err);
// // //         showToast("حدث خطأ أثناء تحميل البيانات", "error");
// // //       } finally {
// // //         setLoadingPeople(false);
// // //       }
// // //     })();
// // //   }, [endpoint, loggedInUserId]);

// // //   // ---------- دالة المتابعة / إلغاء المتابعة ----------
// // //   const toggleFollow = async (userId: string, currentStatus: boolean) => {
// // //     const token = localStorage.getItem("accessToken") || "";
// // //     if (!token) {
// // //       showToast("يجب تسجيل الدخول أولاً", "error");
// // //       return;
// // //     }
// // //     if (followLoadingMap[userId]) return;
// // //     setFollowLoadingMap((prev) => ({ ...prev, [userId]: true }));

// // //     const newStatus = !currentStatus;
// // //     setFollowingMap((prev) => ({ ...prev, [userId]: newStatus }));

// // //     try {
// // //       const res = await fetch("https://bo-chat.space/follow", {
// // //         method: "POST",
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           followerid: loggedInUserId,
// // //           followingid: userId,
// // //         }),
// // //       });

// // //       const data = await res.json();
// // //       console.log("Follow response:", data);

// // //       if (!res.ok) {
// // //         throw new Error(data.message || "فشل تحديث المتابعة");
// // //       }

// // //       showToast(newStatus ? "تم المتابعة بنجاح" : "تم إلغاء المتابعة", "success");
// // //     } catch (error: any) {
// // //       console.error("Toggle follow error:", error);
// // //       setFollowingMap((prev) => ({ ...prev, [userId]: currentStatus }));
// // //       showToast(error.message || "حدث خطأ أثناء محاولة المتابعة", "error");
// // //     } finally {
// // //       setFollowLoadingMap((prev) => ({ ...prev, [userId]: false }));
// // //     }
// // //   };

// // //   // ---------- جلب صور الملف الشخصي ----------
// // //   useEffect(() => {
// // //     if (!profileOwnerId || !loggedInUserId) return;
// // //     const fetchProfileImages = async () => {
// // //       setLoadingImages(true);
// // //       setImagesError(null);
// // //       const token = localStorage.getItem("accessToken") || "";
// // //       const url = `https://bo-chat.space/myposts/${profileOwnerId}?guestid=${loggedInUserId}&page=1&limit=50`;
// // //       try {
// // //         const res = await fetch(url, {
// // //           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// // //         });
// // //         if (!res.ok) throw new Error(`HTTP ${res.status}`);
// // //         const data = await res.json();
// // //         let posts: MyPost[] = [];
// // //         if (Array.isArray(data)) posts = data;
// // //         else if (data.posts && Array.isArray(data.posts)) posts = data.posts;
// // //         else if (data.data && Array.isArray(data.data)) posts = data.data;

// // //         const images: string[] = [];
// // //         posts.forEach((post) => {
// // //           if (post.type === "image" && Array.isArray(post.image)) {
// // //             post.image.forEach((img) => {
// // //               if (img?.image) images.push(img.image);
// // //             });
// // //           }
// // //         });
// // //         setProfileImages(images);
// // //       } catch (err: any) {
// // //         console.error("Error fetching profile images:", err);
// // //         setImagesError(err.message || "حدث خطأ أثناء تحميل الصور");
// // //       } finally {
// // //         setLoadingImages(false);
// // //       }
// // //     };
// // //     fetchProfileImages();
// // //   }, [profileOwnerId, loggedInUserId]);

// // //   // دوال التمرير
// // //   const scrollByAmount = 320;
// // //   const scrollImagesLeft = () => {
// // //     imagesScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// // //   };
// // //   const scrollImagesRight = () => {
// // //     imagesScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// // //   };
// // //   const scrollPeopleLeft = () => {
// // //     peopleScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// // //   };
// // //   const scrollPeopleRight = () => {
// // //     peopleScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// // //   };

// // //   const goToProfile = (id: string) => {
// // //     router.push(`/profile/${id}`);
// // //   };

// // //   const truncate = (str: string | undefined, max: number) => {
// // //     if (!str) return "";
// // //     return str.length > max ? str.slice(0, max) + "..." : str;
// // //   };

// // //   const toggleAllImages = () => {
// // //     setShowAllImages(!showAllImages);
// // //   };

// // //   const hasImages = !loadingImages && !imagesError && profileImages.length > 0;
// // //   const noImages = !loadingImages && (imagesError || profileImages.length === 0);

// // //   return (
// // //     <section className="relative w-full space-y-8">
// // //       {/* Toast */}
// // //       {toastMessage && (
// // //         <div
// // //           className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] p-3 rounded-lg shadow-lg text-sm font-medium ${
// // //             toastType === "success"
// // //               ? "bg-green-100 text-green-700 border border-green-300"
// // //               : "bg-red-100 text-red-700 border border-red-300"
// // //           }`}
// // //         >
// // //           {toastMessage}
// // //         </div>
// // //       )}

// // //       {/* ===== سلايدر الصور ===== */}
// // //       <div className="relative">
// // //         <div className="flex items-center justify-between px-2">
// // //           <h2 className="text-2xl mb-3">صور</h2>
// // //           <button
// // //             onClick={toggleAllImages}
// // //             className="mb-3 p-1 rounded-full hover:bg-gray-200 transition"
// // //             aria-label={showAllImages ? "إخفاء كل الصور" : "عرض كل الصور"}
// // //           >
// // //             <img src="/imgs/Vector (5).svg" className="w-[17px] h-[15px] opacity-100" alt="toggle" />
// // //           </button>
// // //         </div>

// // //         {loadingImages && (
// // //           <div className="flex gap-4 overflow-hidden px-2">
// // //             {Array.from({ length: 3 }).map((_, i) => (
// // //               <div key={i} className="w-[183px] h-[242px] bg-gray-200 rounded-[30px] animate-pulse shrink-0" />
// // //             ))}
// // //           </div>
// // //         )}

// // //         {noImages && showAllImages && (
// // //           <div className="flex flex-col items-center justify-center text-center py-55 px-2">
// // //             <img src="/imgs/Group 9156.svg" alt="No images" />
// // //             <p className="font-cairo font-medium text-[30px] leading-[100%] text-center text-black mt-4">
// // //               مفيش صور هنا دلوقتي
// // //             </p>
// // //             <p className="font-cairo font-normal text-[20px] leading-[30px] text-center text-black mt-2">
// // //               لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا
// // //             </p>
// // //           </div>
// // //         )}

// // //         {hasImages && (
// // //           <>
// // //             {!showAllImages && (
// // //               <>
// // //                 <button
// // //                   onClick={scrollImagesLeft}
// // //                   className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // //                   aria-label="تمرير لليسار"
// // //                 >
// // //                   <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// // //                 </button>
// // //                 <button
// // //                   onClick={scrollImagesRight}
// // //                   className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // //                   aria-label="تمرير لليمين"
// // //                 >
// // //                   <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// // //                 </button>
// // //                 <div
// // //                   ref={imagesScrollerRef}
// // //                   className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// // //                   dir="ltr"
// // //                 >
// // //                   {profileImages.map((imgUrl, idx) => (
// // //                     <div
// // //                       key={idx}
// // //                       className="shrink-0 cursor-pointer"
// // //                       style={{ width: "183px", height: "242px" }}
// // //                       onClick={() => goToProfile(profileOwnerId)}
// // //                     >
// // //                       <div className="relative w-full h-full overflow-hidden rounded-[30px]">
// // //                         <img
// // //                           className="w-full h-full object-cover"
// // //                           alt={`صورة ${idx + 1}`}
// // //                           src={imgUrl}
// // //                           onError={(e) => {
// // //                             e.currentTarget.src = "/icons/user.svg";
// // //                           }}
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </>
// // //             )}
// // //             {showAllImages && (
// // //               <div className="mt-4 px-2 flex flex-col gap-4">
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// // //                   {profileImages.map((imgUrl, idx) => (
// // //                     <div
// // //                       key={idx}
// // //                       className="cursor-pointer"
// // //                       onClick={() => goToProfile(profileOwnerId)}
// // //                     >
// // //                       <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-md">
// // //                         <img
// // //                           className="w-full h-full object-cover"
// // //                           alt={`صورة ${idx + 1}`}
// // //                           src={imgUrl}
// // //                           onError={(e) => {
// // //                             e.currentTarget.src = "/icons/user.svg";
// // //                           }}
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </>
// // //         )}

// // //         {noImages && !showAllImages && <div className="py-4 text-center text-gray-400"></div>}
// // //       </div>

// // //       {/* ===== سلايدر أشخاص على مزاجك ===== */}
// // //       <div className="relative">
// // //         <h2 className="text-2xl mb-3 px-2">أشخاص على مزاجك</h2>

// // //         {loadingPeople && (
// // //           <div className="flex gap-3 overflow-hidden px-2">
// // //             {Array.from({ length: 3 }).map((_, i) => (
// // //               <div key={i} className="w-[163px] h-[280px] bg-gray-200 rounded-2xl animate-pulse shrink-0" />
// // //             ))}
// // //           </div>
// // //         )}

// // //         {!loadingPeople && (!users || users.length === 0) && (
// // //           <p className="text-gray-500 px-2">لا يوجد مستخدمين آخرين.</p>
// // //         )}

// // //         {!loadingPeople && users && users.length > 0 && (
// // //           <>
// // //             <button
// // //               onClick={scrollPeopleLeft}
// // //               className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // //               aria-label="تمرير لليسار"
// // //             >
// // //               <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// // //             </button>
// // //             <button
// // //               onClick={scrollPeopleRight}
// // //               className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// // //               aria-label="تمرير لليمين"
// // //             >
// // //               <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// // //             </button>

// // //             <div
// // //               ref={peopleScrollerRef}
// // //               className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// // //               dir="ltr"
// // //             >
// // //               {users.map((u) => {
// // //                 const isFollowing = followingMap[u._id] ?? false;
// // //                 const isLoading = followLoadingMap[u._id] ?? false;
// // //                 const userFollowers = followersMap[u._id] || [];
// // //                 const totalFollowers = followersCountMap[u._id] ?? 0;
// // //                 const displayFollowers = userFollowers.slice(0, 3);

// // //                 return (
// // //                   <div
// // //                     key={u._id}
// // //                     className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px] shrink-0"
// // //                   >
// // //                     <div
// // //                       role="button"
// // //                       tabIndex={0}
// // //                       onClick={() => goToProfile(u._id)}
// // //                       onKeyDown={(e) => {
// // //                         if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
// // //                       }}
// // //                       className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
// // //                     >
// // //                       <img
// // //                         className="w-[153px] h-[153px] rounded-full object-cover"
// // //                         alt={u.name ?? "User"}
// // //                         src={u?.img || "/icons/user.svg"}
// // //                         onError={(e) => {
// // //                           e.currentTarget.src = "/icons/user.svg";
// // //                         }}
// // //                       />
// // //                       <div className="absolute bottom-0 left-3 w-8 h-8 rounded-full bg-white border border-[#FBFBFB] flex items-center justify-center gap-0.5">
// // //                         <img
// // //                           src="/icons/star.svg"
// // //                           width={7}
// // //                           height={13}
// // //                           className="w-[7px] h-[13px]"
// // //                           alt=""
// // //                         />
// // //                         <p className="font-cairo font-bold text-[12px] leading-[165%] text-right text-black">
// // //                           {Number.isInteger(parseFloat(u.rate))
// // //                             ? parseFloat(u.rate).toString()
// // //                             : parseFloat(u.rate).toFixed(1)}
// // //                         </p>
// // //                       </div>
// // //                     </div>
// // //                     <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
// // //                       {truncate(u.name, 10)}
// // //                     </h3>
// // //                     <p className="text-gray-500 me-2 text-right text-[9px]">
// // //                       @{truncate(u.username, 10)}
// // //                     </p>
// // //                     <div className="mt-3 flex justify-center">
// // //                       {/* عرض المتابعين */}
// // //                       <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center">
// // //                         {displayFollowers.length > 0 ? (
// // //                           displayFollowers.map((follower, i) => (
// // //                             <img
// // //                               key={i}
// // //                               src={follower?.img || "/icons/user.svg"}
// // //                               className="w-[18px] h-[18px] rounded-full object-cover border border-[#F6F6F6] -ml-1 first:ml-0"
// // //                               style={{ zIndex: 3 - i }}
// // //                               alt={follower?.name || "user"}
// // //                             />
// // //                           ))
// // //                         ) : (
// // //                           <img
// // //                             src="/icons/user.svg"
// // //                             className="w-[18px] h-[18px] rounded-full object-cover"
// // //                             alt="no followers"
// // //                           />
// // //                         )}
// // //                         <span className="mr-1">+{totalFollowers}</span>
// // //                       </span>

// // //                       {/* زر المتابعة */}
// // //                       <button
// // //                         onClick={() => toggleFollow(u._id, isFollowing)}
// // //                         disabled={isLoading}
// // //                         className={`w-[70px] h-[30px] flex items-center justify-center gap-1 rounded-full border text-[12px] font-semibold leading-[100%] transition-all ${
// // //                           isFollowing
// // //                             ? "border-[#D72229] text-[#D72229] bg-white"
// // //                             : "border-[#ffffff] text-[#000000] bg-white"
// // //                         } ${
// // //                           isLoading
// // //                             ? "opacity-50 cursor-not-allowed"
// // //                             : "hover:bg-[#D72229] hover:text-white"
// // //                         }`}
// // //                         style={{
// // //                           fontFamily: "Cairo, sans-serif",
// // //                           verticalAlign: "middle",
// // //                         }}
// // //                       >
// // //                         <img
// // //                           src={isFollowing ? "/icons/follow.svg" : "/icons/Vector (13).svg"}
// // //                           className="w-[14px] h-[14px] object-contain"
// // //                           alt=""
// // //                         />
// // //                         <span>{isLoading ? "جاري..." : isFollowing ? "إلغاء" : "متابعه"}</span>
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 );
// // //               })}
// // //             </div>
// // //           </>
// // //         )}
// // //       </div>
// // //     </section>
// // //   );
// // // }







// // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // "use client";
// // import React, { useEffect, useRef, useState } from "react";
// // import { useRouter, useParams } from "next/navigation";

// // type UserRaw = {
// //   rate: string;
// //   _id: string;
// //   name?: string;
// //   username?: string;
// //   img?: string;
// //   visit?: number;
// //   followers?: any[];
// //   requestedFollow?: boolean;
// // };

// // type MyPost = {
// //   _id: string;
// //   type?: string;
// //   image?: {
// //     image: string;
// //     width?: string;
// //     height?: string;
// //   }[];
// // };

// // function shuffleArray<T>(arr: T[]) {
// //   const a = arr.slice();
// //   for (let i = a.length - 1; i > 0; i--) {
// //     const j = Math.floor(Math.random() * (i + 1));
// //     [a[i], a[j]] = [a[j], a[i]];
// //   }
// //   return a;
// // }

// // export default function AllUsersSlider({
// //   endpoint = "https://bo-chat.space/allUsers",
// //   viewedUserId,
// // }: {
// //   endpoint?: string;
// //   viewedUserId?: string;
// // }) {
// //   const router = useRouter();
// //   const params = useParams();
// //   const profileOwnerId = (viewedUserId || params.id) as string;

// //   // ---------- State for "أشخاص على مزاجك" ----------
// //   const [users, setUsers] = useState<UserRaw[] | null>(null);
// //   const [loadingPeople, setLoadingPeople] = useState(true);
// //   const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
// //   const [followLoadingMap, setFollowLoadingMap] = useState<Record<string, boolean>>({});
// //   type FollowerPreview = { _id: string; name: string; img: string };
// //   const [followersMap, setFollowersMap] = useState<Record<string, FollowerPreview[]>>({});
// //   const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>({});

// //   // ---------- State for "صور" ----------
// //   const [profileImages, setProfileImages] = useState<string[]>([]);
// //   const [loadingImages, setLoadingImages] = useState(true);
// //   const [imagesError, setImagesError] = useState<string | null>(null);
// //   const [showAllImages, setShowAllImages] = useState(false);
// //   const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

// //   const [rightVisibleIndex, setRightVisibleIndex] = useState(0);
// // useEffect(() => {
// //   const slider = imagesScrollerRef.current;
// //   if (!slider) return;

// //   const handleScroll = () => {
// //     const cardWidth = 183 + 12; // عرض الكارت + gap (3 = 12px)
// //     const index = Math.floor(
// //       (slider.scrollLeft + slider.clientWidth - 1) / cardWidth
// //     );

// //     setRightVisibleIndex(Math.min(index, profileImages.length - 1));
// //   };

// //   handleScroll();
// //   slider.addEventListener("scroll", handleScroll);

// //   return () => slider.removeEventListener("scroll", handleScroll);
// // }, [profileImages]);

// //   // ---------- Lightbox state ----------
// //   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
// //   const [currentImageIndex, setCurrentImageIndex] = useState(0);

// //   const imagesScrollerRef = useRef<HTMLDivElement>(null);
// //   const peopleScrollerRef = useRef<HTMLDivElement>(null);

// //   // ---------- Toast state ----------
// //   const [toastMessage, setToastMessage] = useState<string | null>(null);
// //   const [toastType, setToastType] = useState<"success" | "error">("success");

// //   const showToast = (message: string, type: "success" | "error" = "success") => {
// //     setToastMessage(message);
// //     setToastType(type);
// //     setTimeout(() => setToastMessage(null), 3000);
// //   };

// //   // ---------- Get logged-in user ID ----------
// //   useEffect(() => {
// //     const storedUserData = localStorage.getItem("userData");
// //     if (storedUserData) {
// //       try {
// //         const userData = JSON.parse(storedUserData);
// //         setLoggedInUserId(userData._id || null);
// //       } catch (e) {
// //         console.error("Failed to parse userData", e);
// //       }
// //     }
// //   }, []);

// //   // ---------- Fetch users + followers + initial follow status ----------
// //   useEffect(() => {
// //     if (!loggedInUserId) return;
// //     const token = localStorage.getItem("accessToken") || "";
// //     (async () => {
// //       try {
// //         const res = await fetch(endpoint, {
// //           cache: "no-store",
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const data = await res.json();
// //         const rows = Array.isArray(data) ? data : data?.data ?? [];
// //         const filtered = rows.filter((u: UserRaw) => u._id !== loggedInUserId);
// //         const shuffled = shuffleArray(filtered);
// //         setUsers(shuffled);

// //         const usersToFetch = shuffled.slice(0, 10);
// //         const promises = usersToFetch.map(async (user) => {
// //           try {
// //             const url = `https://bo-chat.space/users/${user._id}?guestid=${loggedInUserId}`;
// //             const fRes = await fetch(url, {
// //               headers: { Authorization: `Bearer ${token}` },
// //             });
// //             const fData = await fRes.json();
// //             const followers = fData?.followers ?? [];
// //             const totalCount = followers.length;
// //             const requestedFollow = fData?.requestedFollow || false;

// //             const previewFollowers: FollowerPreview[] = followers
// //               .slice(0, 3)
// //               .map((f: any) => ({
// //                 _id: f.followerid,
// //                 name: f.followerdata?.name ?? "User",
// //                 img: f.followerdata?.img ?? "/icons/user.svg",
// //               }));

// //             return { userId: user._id, followers: previewFollowers, count: totalCount, requestedFollow };
// //           } catch (error) {
// //             console.error(`Error fetching data for ${user._id}:`, error);
// //             return { userId: user._id, followers: [], count: 0, requestedFollow: false };
// //           }
// //         });

// //         const results = await Promise.all(promises);
// //         const followersMapTemp: Record<string, FollowerPreview[]> = {};
// //         const followersCountMapTemp: Record<string, number> = {};
// //         const followingMapTemp: Record<string, boolean> = {};

// //         results.forEach(({ userId, followers, count, requestedFollow }) => {
// //           followersMapTemp[userId] = followers;
// //           followersCountMapTemp[userId] = count;
// //           followingMapTemp[userId] = requestedFollow;
// //         });

// //         setFollowersMap(followersMapTemp);
// //         setFollowersCountMap(followersCountMapTemp);
// //         setFollowingMap(followingMapTemp);
// //       } catch (err) {
// //         console.error(err);
// //         showToast("حدث خطأ أثناء تحميل البيانات", "error");
// //       } finally {
// //         setLoadingPeople(false);
// //       }
// //     })();
// //   }, [endpoint, loggedInUserId]);

// //   // ---------- دالة المتابعة / إلغاء المتابعة ----------
// //   const toggleFollow = async (userId: string, currentStatus: boolean) => {
// //     const token = localStorage.getItem("accessToken") || "";
// //     if (!token) {
// //       showToast("يجب تسجيل الدخول أولاً", "error");
// //       return;
// //     }
// //     if (followLoadingMap[userId]) return;
// //     setFollowLoadingMap((prev) => ({ ...prev, [userId]: true }));

// //     const newStatus = !currentStatus;
// //     setFollowingMap((prev) => ({ ...prev, [userId]: newStatus }));

// //     try {
// //       const res = await fetch("https://bo-chat.space/follow", {
// //         method: "POST",
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           followerid: loggedInUserId,
// //           followingid: userId,
// //         }),
// //       });

// //       const data = await res.json();
// //       console.log("Follow response:", data);

// //       if (!res.ok) {
// //         throw new Error(data.message || "فشل تحديث المتابعة");
// //       }

// //       showToast(newStatus ? "تم المتابعة بنجاح" : "تم إلغاء المتابعة", "success");
// //     } catch (error: any) {
// //       console.error("Toggle follow error:", error);
// //       setFollowingMap((prev) => ({ ...prev, [userId]: currentStatus }));
// //       showToast(error.message || "حدث خطأ أثناء محاولة المتابعة", "error");
// //     } finally {
// //       setFollowLoadingMap((prev) => ({ ...prev, [userId]: false }));
// //     }
// //   };

// //   // ---------- جلب صور الملف الشخصي ----------
// //   useEffect(() => {
// //     if (!profileOwnerId || !loggedInUserId) return;
// //     const fetchProfileImages = async () => {
// //       setLoadingImages(true);
// //       setImagesError(null);
// //       const token = localStorage.getItem("accessToken") || "";
// //       const url = `https://bo-chat.space/myposts/${profileOwnerId}?guestid=${loggedInUserId}&page=1&limit=50`;
// //       try {
// //         const res = await fetch(url, {
// //           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// //         });
// //         if (!res.ok) throw new Error(`HTTP ${res.status}`);
// //         const data = await res.json();
// //         let posts: MyPost[] = [];
// //         if (Array.isArray(data)) posts = data;
// //         else if (data.posts && Array.isArray(data.posts)) posts = data.posts;
// //         else if (data.data && Array.isArray(data.data)) posts = data.data;

// //         const images: string[] = [];
// //         posts.forEach((post) => {
// //           if (post.type === "image" && Array.isArray(post.image)) {
// //             post.image.forEach((img) => {
// //               if (img?.image) images.push(img.image);
// //             });
// //           }
// //         });
// //         setProfileImages(images);
// //       } catch (err: any) {
// //         console.error("Error fetching profile images:", err);
// //         setImagesError(err.message || "حدث خطأ أثناء تحميل الصور");
// //       } finally {
// //         setLoadingImages(false);
// //       }
// //     };
// //     fetchProfileImages();
// //   }, [profileOwnerId, loggedInUserId]);

// //   // Lightbox functions
// //   const openLightbox = (index: number) => {
// //     setCurrentImageIndex(index);
// //     setIsLightboxOpen(true);
// //   };

// //   const closeLightbox = () => {
// //     setIsLightboxOpen(false);
// //   };

// //   const goToPrev = () => {
// //     setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : profileImages.length - 1));
// //   };

// //   const goToNext = () => {
// //     setCurrentImageIndex((prev) => (prev < profileImages.length - 1 ? prev + 1 : 0));
// //   };

// //   // keyboard navigation
// //   useEffect(() => {
// //     if (!isLightboxOpen) return;
// //     const handleKey = (e: KeyboardEvent) => {
// //       if (e.key === "Escape") closeLightbox();
// //       if (e.key === "ArrowLeft") goToPrev();
// //       if (e.key === "ArrowRight") goToNext();
// //     };
// //     window.addEventListener("keydown", handleKey);
// //     return () => window.removeEventListener("keydown", handleKey);
// //   }, [isLightboxOpen, profileImages.length]);

// //   // Scroll helpers
// //   const scrollByAmount = 320;
// //   const scrollImagesLeft = () => {
// //     imagesScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// //   };
// //   const scrollImagesRight = () => {
// //     imagesScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// //   };
// //   const scrollPeopleLeft = () => {
// //     peopleScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// //   };
// //   const scrollPeopleRight = () => {
// //     peopleScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// //   };

// //   const goToProfile = (id: string) => {
// //     router.push(`/profile/${id}`);
// //   };

// //   const truncate = (str: string | undefined, max: number) => {
// //     if (!str) return "";
// //     return str.length > max ? str.slice(0, max) + "..." : str;
// //   };

// //   const toggleAllImages = () => {
// //     setShowAllImages(!showAllImages);
// //   };

// //   const hasImages = !loadingImages && !imagesError && profileImages.length > 0;
// //   const noImages = !loadingImages && (imagesError || profileImages.length === 0);

// //   return (
// //     <section className="relative w-full space-y-8">
// //       {/* Toast */}
// //       {toastMessage && (
// //         <div
// //           className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] p-3 rounded-lg shadow-lg text-sm font-medium ${
// //             toastType === "success"
// //               ? "bg-green-100 text-green-700 border border-green-300"
// //               : "bg-red-100 text-red-700 border border-red-300"
// //           }`}
// //         >
// //           {toastMessage}
// //         </div>
// //       )}

// //       {/* ===== سلايدر الصور ===== */}
// //       <div className="relative">
// //         <div className="flex items-center justify-between px-2">
// //           <h2 className="text-2xl mb-3">صور</h2>
// //           <button
// //             onClick={toggleAllImages}
// //             className="mb-3 p-1 rounded-full hover:bg-gray-200 transition"
// //             aria-label={showAllImages ? "إخفاء كل الصور" : "عرض كل الصور"}
// //           >
// //             <img src="/imgs/Vector (5).svg" className="w-[17px] h-[15px] opacity-100" alt="toggle" />
// //           </button>
// //         </div>

// //         {loadingImages && (
// //           <div className="flex gap-4 overflow-hidden px-2">
// //             {Array.from({ length: 3 }).map((_, i) => (
// //               <div key={i} className="w-[183px] h-[242px] bg-gray-200 rounded-[30px] animate-pulse shrink-0" />
// //             ))}
// //           </div>
// //         )}

// //         {noImages && showAllImages && (
// //           <div className="flex flex-col items-center justify-center text-center py-55 px-2">
// //             <img src="/imgs/Group 9156.svg" alt="No images" />
// //             <p className="font-cairo font-medium text-[30px] leading-[100%] text-center text-black mt-4">
// //               مفيش صور هنا دلوقتي
// //             </p>
// //             <p className="font-cairo font-normal text-[20px] leading-[30px] text-center text-black mt-2">
// //               لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا
// //             </p>
// //           </div>
// //         )}

// //         {hasImages && (
// //           <>
// //             {!showAllImages && (
// //               <>
// //                 <button
// //                   onClick={scrollImagesLeft}
// //                   className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// //                   aria-label="تمرير لليسار"
// //                 >
// //                   <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// //                 </button>
// //                 <button
// //                   onClick={scrollImagesRight}
// //                   className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// //                   aria-label="تمرير لليمين"
// //                 >
// //                   <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// //                 </button>
// //                 <div
// //                   ref={imagesScrollerRef}
// //                   className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// //                   dir="ltr"
// //                 >
                
                 
// // {profileImages.map((imgUrl, idx) => (
// //   <div
// //     key={idx}
// //     className="shrink-0 cursor-pointer relative"
// //     style={{ width: "183px", height: "242px" }}
// //     onClick={() => openLightbox(idx)}
// //   >
// //     <div className="relative w-full h-full overflow-hidden rounded-[30px] bg-white" 
// //       style={{
// //     boxShadow: "0px 1px 10px 0px #0000001A",
// //   }}
// // >
// //       {/* <img
// //         className="w-full h-full object-cover"
// //         alt={`صورة ${idx + 1}`}
// //         src={imgUrl}
// //         style={{
// //           maskImage: idx === profileImages.length - 1 
// //             ? "linear-gradient(to right, black 25%, transparent 100%)"
// //             : "none",
// //           WebkitMaskImage: idx === profileImages.length - 1 
// //             ? "linear-gradient(to right, black 25%, transparent 100%)"
// //             : "none",
// //         }}
// //         onError={(e) => {
// //           e.currentTarget.src = "/icons/user.svg";
// //         }}
// //       /> */}
// //       <img
// //   className="w-full h-full object-cover"
// //   src={imgUrl}
// //   style={{
// //     maskImage:
// //       idx === rightVisibleIndex
// //         ? "linear-gradient(to right, black 25%, transparent 100%)"
// //         : "none",
// //     WebkitMaskImage:
// //       idx === rightVisibleIndex
// //         ? "linear-gradient(to right, black 25%, transparent 100%)"
// //         : "none",
// //   }}
// // />
// //     </div>
// //   </div>
// // ))}
// //                 </div>
// //               </>
// //             )}
// //             {showAllImages && (
// //               <div className="mt-4 px-2 flex flex-col gap-4">
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// //                   {profileImages.map((imgUrl, idx) => (
// //                     <div
// //                       key={idx}
// //                       className="cursor-pointer"
// //                       onClick={() => openLightbox(idx)}
// //                     >
// //                       <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-md">
// //                         <img
// //                           className="w-full h-full object-cover"
// //                           alt={`صورة ${idx + 1}`}
// //                           src={imgUrl}
// //                           onError={(e) => {
// //                             e.currentTarget.src = "/icons/user.svg";
// //                           }}
// //                         />
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}

// //         {noImages && !showAllImages && <div className="py-4 text-center text-gray-400"></div>}
// //       </div>

// //       {/* ===== سلايدر أشخاص على مزاجك ===== */}
// //       <div className="relative">
// //         <h2 className="text-2xl mb-3 px-2">أشخاص على مزاجك</h2>

// //         {loadingPeople && (
// //           <div className="flex gap-3 overflow-hidden px-2">
// //             {Array.from({ length: 3 }).map((_, i) => (
// //               <div key={i} className="w-[163px] h-[280px] bg-gray-200 rounded-2xl animate-pulse shrink-0" />
// //             ))}
// //           </div>
// //         )}

// //         {!loadingPeople && (!users || users.length === 0) && (
// //           <p className="text-gray-500 px-2">لا يوجد مستخدمين آخرين.</p>
// //         )}

// //         {!loadingPeople && users && users.length > 0 && (
// //           <>
// //             <button
// //               onClick={scrollPeopleLeft}
// //               className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// //               aria-label="تمرير لليسار"
// //             >
// //               <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// //             </button>
// //             <button
// //               onClick={scrollPeopleRight}
// //               className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// //               aria-label="تمرير لليمين"
// //             >
// //               <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// //             </button>

// //             <div
// //               ref={peopleScrollerRef}
// //               className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// //               dir="ltr"
// //             >
// //               {users.map((u) => {
// //                 const isFollowing = followingMap[u._id] ?? false;
// //                 const isLoading = followLoadingMap[u._id] ?? false;
// //                 const userFollowers = followersMap[u._id] || [];
// //                 const totalFollowers = followersCountMap[u._id] ?? 0;
// //                 const displayFollowers = userFollowers.slice(0, 3);

// //                 return (
// //                   <div
// //                     key={u._id}
// //                     className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px] shrink-0"
// //                   >
// //                     <div
// //                       role="button"
// //                       tabIndex={0}
// //                       onClick={() => goToProfile(u._id)}
// //                       onKeyDown={(e) => {
// //                         if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
// //                       }}
// //                       className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
// //                     >
// //                       <img
// //                         className="w-[153px] h-[153px] rounded-full object-cover"
// //                         alt={u.name ?? "User"}
// //                         src={u?.img || "/icons/user.svg"}
// //                         onError={(e) => {
// //                           e.currentTarget.src = "/icons/user.svg";
// //                         }}
// //                       />
// //                       <div className="absolute bottom-0 left-3 w-8 h-8 rounded-full bg-white border border-[#FBFBFB] flex items-center justify-center gap-0.5">
// //                         <img
// //                           src="/icons/star.svg"
// //                           width={7}
// //                           height={13}
// //                           className="w-[7px] h-[13px]"
// //                           alt=""
// //                         />
// //                         <p className="font-cairo font-bold text-[12px] leading-[165%] text-right text-black">
// //                           {Number.isInteger(parseFloat(u.rate))
// //                             ? parseFloat(u.rate).toString()
// //                             : parseFloat(u.rate).toFixed(1)}
// //                         </p>
// //                       </div>
// //                     </div>
// //                     <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
// //                       {truncate(u.name, 10)}
// //                     </h3>
// //                     <p className="text-gray-500 me-2 text-right text-[9px]">
// //                       @{truncate(u.username, 10)}
// //                     </p>
// //                     <div className="mt-3 flex justify-center">
// //                       {/* عرض المتابعين */}
// //                       <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center">
// //                         {displayFollowers.length > 0 ? (
// //                           displayFollowers.map((follower, i) => (
// //                             <img
// //                               key={i}
// //                               src={follower?.img || "/icons/user.svg"}
// //                               className="w-[18px] h-[18px] rounded-full object-cover border border-[#F6F6F6] -ml-1 first:ml-0"
// //                               style={{ zIndex: 3 - i }}
// //                               alt={follower?.name || "user"}
// //                             />
// //                           ))
// //                         ) : (
// //                           <img
// //                             src="/icons/user.svg"
// //                             className="w-[18px] h-[18px] rounded-full object-cover"
// //                             alt="no followers"
// //                           />
// //                         )}
// //                         <span className="mr-1">+{totalFollowers}</span>
// //                       </span>

// //                       {/* زر المتابعة */}
// //                       <button
// //                         onClick={() => toggleFollow(u._id, isFollowing)}
// //                         disabled={isLoading}
// //                         className={`w-[70px] h-[30px] flex items-center justify-center gap-1 rounded-full border text-[12px] font-semibold leading-[100%] transition-all ${
// //                           isFollowing
// //                             ? "border-[#D72229] text-[#D72229] bg-white"
// //                             : "border-[#ffffff] text-[#000000] bg-white"
// //                         } ${
// //                           isLoading
// //                             ? "opacity-50 cursor-not-allowed"
// //                             : "hover:bg-[#D72229] hover:text-white"
// //                         }`}
// //                         style={{
// //                           fontFamily: "Cairo, sans-serif",
// //                           verticalAlign: "middle",
// //                         }}
// //                       >
// //                         <img
// //                           src={isFollowing ? "/icons/follow.svg" : "/icons/Vector (13).svg"}
// //                           className="w-[14px] h-[14px] object-contain"
// //                           alt=""
// //                         />
// //                         <span>{isLoading ? "جاري..." : isFollowing ? "إلغاء" : "متابعه"}</span>
// //                       </button>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </>
// //         )}
// //       </div>

// //       {/* ===== Lightbox ===== */}
// // {/* ===== Lightbox ===== */}
// // {isLightboxOpen && (
// //   <div
// //     className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4"
// //     onClick={closeLightbox}
// //   >
// //     {/* حاوية تحتوي على الصورة والأزرار فوقها */}
// //     <div className="relative flex flex-col items-center justify-center w-full max-w-[600px]">
// //       {/* شريط الأزرار (فوق الصورة) */}
// //       <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
      
// // {/* زر التالي */}
// //         <button
// //           onClick={(e) => {
// //             e.stopPropagation();
// //             goToNext();
// //           }}
// //           className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 transition flex items-center justify-center"
// //           aria-label="التالي"
// //         >
// //           <img src="/imgs/arrowright.svg" className="w-5 h-5 invert" alt="التالي" />
// //         </button>
// //         {/* زر السابق */}
// //         <button
// //           onClick={(e) => {
// //             e.stopPropagation();
// //             goToPrev();
// //           }}
// //           className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 transition flex items-center justify-center"
// //           aria-label="السابق"
// //         >
// //           <img src="/imgs/arrowleft.svg" className="w-5 h-5 invert" alt="السابق" />
// //         </button>
        
        


// //          {/* زر الإغلاق */}
// //         <button
// //           onClick={closeLightbox}
// //           className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 transition flex items-center justify-center"
// //           aria-label="إغلاق"
// //         >
// //           <img src="/icons/close.svg" className="w-5 h-5" alt="إغلاق" />
// //         </button>
// //       </div>

// //       {/* الصورة الكبيرة */}
// //       <img
// //         src={profileImages[currentImageIndex]}
// //         alt={`صورة ${currentImageIndex + 1}`}
// //         className="w-[600px] max-h-[500px]  object-contain rounded-[65px] max-w-full max-h-[70vh]"
// //         onClick={(e) => e.stopPropagation()}
// //       />
     
// //     </div>

// //     {/* معاينات مصغرة (أسفل الصورة) */}
// //     <div
// //       className="flex gap-4 mt-8 overflow-x-auto max-w-full px-4 pb-2"
// //       onClick={(e) => e.stopPropagation()}
// //     >
// //       {profileImages.map((img, idx) => (
// //         <img
// //           key={idx}
// //           src={img}
// //           alt={`صورة ${idx + 1}`}
// //           className={`w-[100px] h-[90px] object-cover rounded-[20px] cursor-pointer border-2 transition ${
// //             idx === currentImageIndex
// //               ? 'border-white scale-105'
// //               : 'border-transparent hover:border-gray-400 hover:scale-105'
// //           }`}
// //           onClick={() => setCurrentImageIndex(idx)}
// //         />
// //       ))}
// //     </div>
// //   </div>
// // )}

// //     </section>
// //   );
// // }

// // // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// // "use client";
// // import React, { useEffect, useRef, useState } from "react";
// // import { useRouter, useParams } from "next/navigation";

// // type UserRaw = {
// //   rate: string;
// //   _id: string;
// //   name?: string;
// //   username?: string;
// //   img?: string;
// //   visit?: number;
// //   followers?: any[];
// //   requestedFollow?: boolean;
// // };

// // type MyPost = {
// //   _id: string;
// //   type?: string;
// //   image?: {
// //     image: string;
// //     width?: string;
// //     height?: string;
// //   }[];
// // };

// // function shuffleArray<T>(arr: T[]) {
// //   const a = arr.slice();
// //   for (let i = a.length - 1; i > 0; i--) {
// //     const j = Math.floor(Math.random() * (i + 1));
// //     [a[i], a[j]] = [a[j], a[i]];
// //   }
// //   return a;
// // }

// // export default function AllUsersSlider({
// //   endpoint = "https://bo-chat.space/allUsers",
// //   viewedUserId,
// // }: {
// //   endpoint?: string;
// //   viewedUserId?: string;
// // }) {
// //   const router = useRouter();
// //   const params = useParams();
// //   const profileOwnerId = (viewedUserId || params.id) as string;

// //   // ---------- State for "أشخاص على مزاجك" ----------
// //   const [users, setUsers] = useState<UserRaw[] | null>(null);
// //   const [loadingPeople, setLoadingPeople] = useState(true);
// //   const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
// //   const [followLoadingMap, setFollowLoadingMap] = useState<Record<string, boolean>>({});
// //   type FollowerPreview = { _id: string; name: string; img: string };
// //   const [followersMap, setFollowersMap] = useState<Record<string, FollowerPreview[]>>({});
// //   const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>({});

// //   // 
// //   const [isNextActive, setIsNextActive] = useState(false);
// // const [isPrevActive, setIsPrevActive] = useState(false);

// //   // ---------- State for "صور" ----------
// //   const [profileImages, setProfileImages] = useState<string[]>([]);
// //   const [loadingImages, setLoadingImages] = useState(true);
// //   const [imagesError, setImagesError] = useState<string | null>(null);
// //   const [showAllImages, setShowAllImages] = useState(false);
// //   const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

// //   // ----- Groups for images (6 per group) -----
// //   const [imageGroups, setImageGroups] = useState<string[][]>([]);

// //   // Update groups whenever profileImages changes
// //   useEffect(() => {
// //     const groupSize = 6;
// //     const groups: string[][] = [];
// //     for (let i = 0; i < profileImages.length; i += groupSize) {
// //       groups.push(profileImages.slice(i, i + groupSize));
// //     }
// //     setImageGroups(groups);
// //   }, [profileImages]);

// //   const [rightVisibleIndex, setRightVisibleIndex] = useState(0);
// //   useEffect(() => {
// //     const slider = imagesScrollerRef.current;
// //     if (!slider) return;

// //     const handleScroll = () => {
// //       const cardWidth = 183 + 12;
// //       const index = Math.floor(
// //         (slider.scrollLeft + slider.clientWidth - 1) / cardWidth
// //       );
// //       setRightVisibleIndex(Math.min(index, profileImages.length - 1));
// //     };

// //     handleScroll();
// //     slider.addEventListener("scroll", handleScroll);
// //     return () => slider.removeEventListener("scroll", handleScroll);
// //   }, [profileImages]);

// //   // ---------- Lightbox state ----------
// //   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
// //   const [currentImageIndex, setCurrentImageIndex] = useState(0);

// //   const imagesScrollerRef = useRef<HTMLDivElement>(null);
// //   const peopleScrollerRef = useRef<HTMLDivElement>(null);

// //   // ---------- Toast state ----------
// //   const [toastMessage, setToastMessage] = useState<string | null>(null);
// //   const [toastType, setToastType] = useState<"success" | "error">("success");

// //   const showToast = (message: string, type: "success" | "error" = "success") => {
// //     setToastMessage(message);
// //     setToastType(type);
// //     setTimeout(() => setToastMessage(null), 3000);
// //   };

// //   // ---------- Get logged-in user ID ----------
// //   useEffect(() => {
// //     const storedUserData = localStorage.getItem("userData");
// //     if (storedUserData) {
// //       try {
// //         const userData = JSON.parse(storedUserData);
// //         setLoggedInUserId(userData._id || null);
// //       } catch (e) {
// //         console.error("Failed to parse userData", e);
// //       }
// //     }
// //   }, []);

// //   // ---------- Fetch users + followers + initial follow status ----------
// //   useEffect(() => {
// //     if (!loggedInUserId) return;
// //     const token = localStorage.getItem("accessToken") || "";
// //     (async () => {
// //       try {
// //         const res = await fetch(endpoint, {
// //           cache: "no-store",
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const data = await res.json();
// //         const rows = Array.isArray(data) ? data : data?.data ?? [];
// //         const filtered = rows.filter((u: UserRaw) => u._id !== loggedInUserId);
// //         const shuffled = shuffleArray(filtered);
// //         setUsers(shuffled);

// //         const usersToFetch = shuffled.slice(0, 10);
// //         const promises = usersToFetch.map(async (user) => {
// //           try {
// //             const url = `https://bo-chat.space/users/${user._id}?guestid=${loggedInUserId}`;
// //             const fRes = await fetch(url, {
// //               headers: { Authorization: `Bearer ${token}` },
// //             });
// //             const fData = await fRes.json();
// //             const followers = fData?.followers ?? [];
// //             const totalCount = followers.length;
// //             const requestedFollow = fData?.requestedFollow || false;

// //             const previewFollowers: FollowerPreview[] = followers
// //               .slice(0, 3)
// //               .map((f: any) => ({
// //                 _id: f.followerid,
// //                 name: f.followerdata?.name ?? "User",
// //                 img: f.followerdata?.img ?? "/icons/user.svg",
// //               }));

// //             return { userId: user._id, followers: previewFollowers, count: totalCount, requestedFollow };
// //           } catch (error) {
// //             console.error(`Error fetching data for ${user._id}:`, error);
// //             return { userId: user._id, followers: [], count: 0, requestedFollow: false };
// //           }
// //         });

// //         const results = await Promise.all(promises);
// //         const followersMapTemp: Record<string, FollowerPreview[]> = {};
// //         const followersCountMapTemp: Record<string, number> = {};
// //         const followingMapTemp: Record<string, boolean> = {};

// //         results.forEach(({ userId, followers, count, requestedFollow }) => {
// //           followersMapTemp[userId] = followers;
// //           followersCountMapTemp[userId] = count;
// //           followingMapTemp[userId] = requestedFollow;
// //         });

// //         setFollowersMap(followersMapTemp);
// //         setFollowersCountMap(followersCountMapTemp);
// //         setFollowingMap(followingMapTemp);
// //       } catch (err) {
// //         console.error(err);
// //         showToast("حدث خطأ أثناء تحميل البيانات", "error");
// //       } finally {
// //         setLoadingPeople(false);
// //       }
// //     })();
// //   }, [endpoint, loggedInUserId]);

// //   // ---------- دالة المتابعة / إلغاء المتابعة ----------
// //   const toggleFollow = async (userId: string, currentStatus: boolean) => {
// //     const token = localStorage.getItem("accessToken") || "";
// //     if (!token) {
// //       showToast("يجب تسجيل الدخول أولاً", "error");
// //       return;
// //     }
// //     if (followLoadingMap[userId]) return;
// //     setFollowLoadingMap((prev) => ({ ...prev, [userId]: true }));

// //     const newStatus = !currentStatus;
// //     setFollowingMap((prev) => ({ ...prev, [userId]: newStatus }));

// //     try {
// //       const res = await fetch("https://bo-chat.space/follow", {
// //         method: "POST",
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           followerid: loggedInUserId,
// //           followingid: userId,
// //         }),
// //       });

// //       const data = await res.json();
// //       console.log("Follow response:", data);

// //       if (!res.ok) {
// //         throw new Error(data.message || "فشل تحديث المتابعة");
// //       }

// //       showToast(newStatus ? "تم المتابعة بنجاح" : "تم إلغاء المتابعة", "success");
// //     } catch (error: any) {
// //       console.error("Toggle follow error:", error);
// //       setFollowingMap((prev) => ({ ...prev, [userId]: currentStatus }));
// //       showToast(error.message || "حدث خطأ أثناء محاولة المتابعة", "error");
// //     } finally {
// //       setFollowLoadingMap((prev) => ({ ...prev, [userId]: false }));
// //     }
// //   };

// //   // ---------- جلب صور الملف الشخصي ----------
// //   useEffect(() => {
// //     if (!profileOwnerId || !loggedInUserId) return;
// //     const fetchProfileImages = async () => {
// //       setLoadingImages(true);
// //       setImagesError(null);
// //       const token = localStorage.getItem("accessToken") || "";
// //       const url = `https://bo-chat.space/myposts/${profileOwnerId}?guestid=${loggedInUserId}&page=1&limit=50`;
// //       try {
// //         const res = await fetch(url, {
// //           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// //         });
// //         if (!res.ok) throw new Error(`HTTP ${res.status}`);
// //         const data = await res.json();
// //         let posts: MyPost[] = [];
// //         if (Array.isArray(data)) posts = data;
// //         else if (data.posts && Array.isArray(data.posts)) posts = data.posts;
// //         else if (data.data && Array.isArray(data.data)) posts = data.data;

// //         const images: string[] = [];
// //         posts.forEach((post) => {
// //           if (post.type === "image" && Array.isArray(post.image)) {
// //             post.image.forEach((img) => {
// //               if (img?.image) images.push(img.image);
// //             });
// //           }
// //         });
// //         setProfileImages(images);
// //       } catch (err: any) {
// //         console.error("Error fetching profile images:", err);
// //         setImagesError(err.message || "حدث خطأ أثناء تحميل الصور");
// //       } finally {
// //         setLoadingImages(false);
// //       }
// //     };
// //     fetchProfileImages();
// //   }, [profileOwnerId, loggedInUserId]);

// //   // Lightbox functions
// //   const openLightbox = (index: number) => {
// //     setCurrentImageIndex(index);
// //     setIsLightboxOpen(true);
// //   };

// //   const closeLightbox = () => {
// //     setIsLightboxOpen(false);
// //   };

// //   const goToPrev = () => {
// //     setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : profileImages.length - 1));
// //   };

// //   const goToNext = () => {
// //     setCurrentImageIndex((prev) => (prev < profileImages.length - 1 ? prev + 1 : 0));
// //   };

// //   // keyboard navigation
// //   useEffect(() => {
// //     if (!isLightboxOpen) return;
// //     const handleKey = (e: KeyboardEvent) => {
// //       if (e.key === "Escape") closeLightbox();
// //       if (e.key === "ArrowLeft") goToPrev();
// //       if (e.key === "ArrowRight") goToNext();
// //     };
// //     window.addEventListener("keydown", handleKey);
// //     return () => window.removeEventListener("keydown", handleKey);
// //   }, [isLightboxOpen, profileImages.length]);

// //   // Scroll helpers
// //   const scrollByAmount = 320;
// //   const scrollImagesLeft = () => {
// //     imagesScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// //   };
// //   const scrollImagesRight = () => {
// //     imagesScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// //   };
// //   const scrollPeopleLeft = () => {
// //     peopleScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// //   };
// //   const scrollPeopleRight = () => {
// //     peopleScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// //   };

// //   const goToProfile = (id: string) => {
// //     router.push(`/profile/${id}`);
// //   };

// //   const truncate = (str: string | undefined, max: number) => {
// //     if (!str) return "";
// //     return str.length > max ? str.slice(0, max) + "..." : str;
// //   };

// //   const toggleAllImages = () => {
// //     setShowAllImages(!showAllImages);
// //   };

// //   const hasImages = !loadingImages && !imagesError && profileImages.length > 0;
// //   const noImages = !loadingImages && (imagesError || profileImages.length === 0);

// //   return (
// //     <section className="relative w-full space-y-8">
// //       {/* Toast */}
// //       {toastMessage && (
// //         <div
// //           className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] p-3 rounded-lg shadow-lg text-sm font-medium ${
// //             toastType === "success"
// //               ? "bg-green-100 text-green-700 border border-green-300"
// //               : "bg-red-100 text-red-700 border border-red-300"
// //           }`}
// //         >
// //           {toastMessage}
// //         </div>
// //       )}

// //       {/* ===== سلايدر الصور ===== */}
// //       <div className="relative">
// //         <div className="flex items-center justify-between px-2">
// //           <h2 className="text-2xl mb-3">صور</h2>
// //           <button
// //             onClick={toggleAllImages}
// //             className="mb-3 p-1 rounded-full hover:bg-gray-200 transition"
// //             aria-label={showAllImages ? "إخفاء كل الصور" : "عرض كل الصور"}
// //           >
// //             <img src="/imgs/Vector (5).svg" className="w-[17px] h-[15px] opacity-100" alt="toggle" />
// //           </button>
// //         </div>

// //         {loadingImages && (
// //           <div className="flex gap-4 overflow-hidden px-2">
// //             {Array.from({ length: 3 }).map((_, i) => (
// //               <div key={i} className="w-[183px] h-[242px] bg-gray-200 rounded-[30px] animate-pulse shrink-0" />
// //             ))}
// //           </div>
// //         )}

// //         {noImages && (
// //           <div className="flex flex-col items-center justify-center text-center py-55 px-2">
// //             <img src="/imgs/Group 9156.svg" alt="No images" />
// //             <p className="font-cairo font-medium text-[30px] leading-[100%] text-center text-black mt-4">
// //               مفيش صور هنا دلوقتي
// //             </p>
// //             <p className="font-cairo font-normal text-[20px] leading-[30px] text-center text-black mt-2">
// //               لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا
// //             </p>
// //           </div>
// //         )}

// //         {hasImages && (
// //           <>
// //             {!showAllImages ? (
// //               // ----- الوضع العادي (سلايدر) -----
// //               <>
// //                 <button
// //                   onClick={scrollImagesLeft}
// //                   className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// //                   aria-label="تمرير لليسار"
// //                 >
// //                   <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// //                 </button>
// //                 <button
// //                   onClick={scrollImagesRight}
// //                   className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// //                   aria-label="تمرير لليمين"
// //                 >
// //                   <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// //                 </button>
// //                 <div
// //                   ref={imagesScrollerRef}
// //                   className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// //                   dir="ltr"
// //                 >
// //                   {profileImages.map((imgUrl, idx) => (
// //                     <div
// //                       key={idx}
// //                       className="shrink-0 cursor-pointer relative"
// //                       style={{ width: "183px", height: "242px" }}
// //                       onClick={() => openLightbox(idx)}
// //                     >
// //                       <div className="relative w-full h-full overflow-hidden rounded-[30px] bg-white"
// //                         style={{
// //                           boxShadow: "0px 1px 10px 0px #0000001A",
// //                         }}
// //                       >
// //                         <img
// //                           className="w-full h-full object-cover"
// //                           alt={`صورة ${idx + 1}`}
// //                           src={imgUrl}
// //                           style={{
// //                             maskImage:
// //                               idx === rightVisibleIndex
// //                                 ? "linear-gradient(to right, black 25%, transparent 100%)"
// //                                 : "none",
// //                             WebkitMaskImage:
// //                               idx === rightVisibleIndex
// //                                 ? "linear-gradient(to right, black 25%, transparent 100%)"
// //                                 : "none",
// //                           }}
// //                           onError={(e) => {
// //                             e.currentTarget.src = "/icons/user.svg";
// //                           }}
// //                         />
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </>
// //             ) : (
// //               // ----- وضع عرض الكل (بدون ترقيم، جميع المجموعات متتالية) -----
// //               <div className="px-2">
// //                 {imageGroups.map((group, groupIdx) => {
// //                   const isEven = groupIdx % 2 === 0;
                  
// //                   return (
// //                     <div key={groupIdx} className="mb-8 flex flex-col items-center">
// //                       {/* الصف العلوي: صورة كبيرة + عمود الصور الصغيرة */}
// //                       <div className={`flex gap-3 justify-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
// //                         {/* الصورة الكبيرة */}
// //                         {group.length > 0 && (
// //                           <div
// //                             className="cursor-pointer rounded-[15px] overflow-hidden shadow-lg"
// //                             style={{ width: "300px", height: "350px" }}
// //                             onClick={() => {
// //                               const globalIndex = profileImages.indexOf(group[0]);
// //                               openLightbox(globalIndex);
// //                             }}
// //                           >
// //                             <img
// //                               src={group[0]}
// //                               alt="الصورة الرئيسية"
// //                               className="w-full h-full object-cover"
// //                             />
// //                           </div>
// //                         )}

// //                         {/* العمود الجانبي: أول صورتين صغيرتين (بجانب الكبيرة) */}
// //                         {group.length > 1 && (
// //                           <div className="flex flex-col gap-3">
// //                             {group.slice(1, 3).map((imgUrl, idx) => (
// //                               <div
// //                                 key={idx}
// //                                 className="cursor-pointer rounded-[15px] overflow-hidden shadow-md hover:scale-105 transition"
// //                                style={{ width: "130px", height: "170px" }}
// //                                 onClick={() => {
// //                                   const globalIndex = profileImages.indexOf(imgUrl);
// //                                   openLightbox(globalIndex);
// //                                 }}
// //                               >
// //                                 <img
// //                                   src={imgUrl}
// //                                   alt={`صورة مصغرة ${idx + 1}`}
// //                                   className="w-full h-full object-cover"
// //                                   onError={(e) => {
// //                                     e.currentTarget.src = "/icons/user.svg";
// //                                   }}
// //                                 />
// //                               </div>
// //                             ))}
// //                           </div>
// //                         )}
// //                       </div>

// //                       {/* الصف السفلي: ثلاث صور صغيرة (أسفل الكبيرة) */}
// //                       {group.length > 3 && (
// //                         <div className="flex gap-3 justify-center mt-3">
// //                           {group.slice(3, 6).map((imgUrl, idx) => (
// //                             <div
// //                               key={idx}
// //                               className="cursor-pointer rounded-[15px] overflow-hidden shadow-md hover:scale-105 transition"
// //                               style={{ width: "140px", height: "170px" }}
// //                               onClick={() => {
// //                                 const globalIndex = profileImages.indexOf(imgUrl);
// //                                 openLightbox(globalIndex);
// //                               }}
// //                             >
// //                               <img
// //                                 src={imgUrl}
// //                                 alt={`صورة مصغرة ${idx + 3}`}
// //                                 className="w-full h-full object-cover"
// //                                 onError={(e) => {
// //                                   e.currentTarget.src = "/icons/user.svg";
// //                                 }}
// //                               />
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>

// //       {/* ===== سلايدر أشخاص على مزاجك ===== */}
// //       <div className="relative">
// //         <h2 className="text-2xl mb-3 px-2">أشخاص على مزاجك</h2>

// //         {loadingPeople && (
// //           <div className="flex gap-3 overflow-hidden px-2">
// //             {Array.from({ length: 3 }).map((_, i) => (
// //               <div key={i} className="w-[163px] h-[280px] bg-gray-200 rounded-2xl animate-pulse shrink-0" />
// //             ))}
// //           </div>
// //         )}

// //         {!loadingPeople && (!users || users.length === 0) && (
// //           <p className="text-gray-500 px-2">لا يوجد مستخدمين آخرين.</p>
// //         )}

// //         {!loadingPeople && users && users.length > 0 && (
// //           <>
// //             <button
// //               onClick={scrollPeopleLeft}
// //               className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// //               aria-label="تمرير لليسار"
// //             >
// //               <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt="left" />
// //             </button>
// //             <button
// //               onClick={scrollPeopleRight}
// //               className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
// //               aria-label="تمرير لليمين"
// //             >
// //               <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt="right" />
// //             </button>

// //             <div
// //               ref={peopleScrollerRef}
// //               className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
// //               dir="ltr"
// //             >
// //               {users.map((u) => {
// //                 const isFollowing = followingMap[u._id] ?? false;
// //                 const isLoading = followLoadingMap[u._id] ?? false;
// //                 const userFollowers = followersMap[u._id] || [];
// //                 const totalFollowers = followersCountMap[u._id] ?? 0;
// //                 const displayFollowers = userFollowers.slice(0, 3);

// //                 return (
// //                   <div
// //                     key={u._id}
// //                     className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px] shrink-0"
// //                   >
// //                     <div
// //                       role="button"
// //                       tabIndex={0}
// //                       onClick={() => goToProfile(u._id)}
// //                       onKeyDown={(e) => {
// //                         if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
// //                       }}
// //                       className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
// //                     >
// //                       <img
// //                         className="w-[153px] h-[153px] rounded-full object-cover"
// //                         alt={u.name ?? "User"}
// //                         src={u?.img || "/icons/user.svg"}
// //                         onError={(e) => {
// //                           e.currentTarget.src = "/icons/user.svg";
// //                         }}
// //                       />
// //                       <div className="absolute bottom-0 left-3 w-8 h-8 rounded-full bg-white border border-[#FBFBFB] flex items-center justify-center gap-0.5">
// //                         <img
// //                           src="/icons/star.svg"
// //                           width={7}
// //                           height={13}
// //                           className="w-[7px] h-[13px]"
// //                           alt=""
// //                         />
// //                         <p className="font-cairo font-bold text-[12px] leading-[165%] text-right text-black">
// //                           {Number.isInteger(parseFloat(u.rate))
// //                             ? parseFloat(u.rate).toString()
// //                             : parseFloat(u.rate).toFixed(1)}
// //                         </p>
// //                       </div>
// //                     </div>
// //                     <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
// //                       {truncate(u.name, 10)}
// //                     </h3>
// //                     <p className="text-gray-500 me-2 text-right text-[9px]">
// //                       @{truncate(u.username, 10)}
// //                     </p>
// //                     <div className="mt-3 flex justify-center">
// //                       <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center">
// //                         {displayFollowers.length > 0 ? (
// //                           displayFollowers.map((follower, i) => (
// //                             <img
// //                               key={i}
// //                               src={follower?.img || "/icons/user.svg"}
// //                               className="w-[18px] h-[18px] rounded-full object-cover border border-[#F6F6F6] -ml-1 first:ml-0"
// //                               style={{ zIndex: 3 - i }}
// //                               alt={follower?.name || "user"}
// //                             />
// //                           ))
// //                         ) : (
// //                           <img
// //                             src="/icons/user.svg"
// //                             className="w-[18px] h-[18px] rounded-full object-cover"
// //                             alt="no followers"
// //                           />
// //                         )}
// //                         <span className="mr-1">+{totalFollowers}</span>
// //                       </span>

// //                       <button
// //                         onClick={() => toggleFollow(u._id, isFollowing)}
// //                         disabled={isLoading}
// //                         className={`w-[70px] h-[30px] flex items-center justify-center gap-1 rounded-full border text-[12px] font-semibold leading-[100%] transition-all ${
// //                           isFollowing
// //                             ? "border-[#D72229] text-[#D72229] bg-white"
// //                             : "border-[#ffffff] text-[#000000] bg-white"
// //                         } ${
// //                           isLoading
// //                             ? "opacity-50 cursor-not-allowed"
// //                             : "hover:bg-[#D72229] hover:text-white"
// //                         }`}
// //                         style={{
// //                           fontFamily: "Cairo, sans-serif",
// //                           verticalAlign: "middle",
// //                         }}
// //                       >
// //                         <img
// //                           src={isFollowing ? "/icons/follow.svg" : "/icons/Vector (13).svg"}
// //                           className="w-[14px] h-[14px] object-contain"
// //                           alt=""
// //                         />
// //                         <span>{isLoading ? "جاري..." : isFollowing ? "إلغاء" : "متابعه"}</span>
// //                       </button>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </>
// //         )}
// //       </div>
// //       {/* ===== Lightbox ===== */}
// // {isLightboxOpen && (
// //   <div
// //     className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4"
// //     onClick={closeLightbox}
// //   >
// //     <div className="relative flex flex-col items-center justify-center w-full max-w-[600px]">
// //       {/* أزرار التنقل (فوق الصورة) */}
// //       <div className="absolute top-[-65px] left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
      
// //         {/* زر التالي */}
// //         <button
// //           onMouseDown={() => setIsNextActive(true)}
// //           onMouseUp={() => setIsNextActive(false)}
// //           onMouseLeave={() => setIsNextActive(false)}
// //           onClick={(e) => {
// //             e.stopPropagation();
// //             goToNext();
// //           }}
// //           className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
// //           style={{
// //             background: isNextActive ? '#FFFFFF80' : '#FFFFFF26',
// //             backdropFilter: 'blur(20px)',
// //             WebkitBackdropFilter: 'blur(20px)',
// //           }}
// //           aria-label="التالي"
// //         >
// //           <img src="/imgs/Vector (19).svg" className="w-5 h-5" alt="التالي" />
// //         </button>
// //   {/* زر السابق */}
// //         <button
// //           onMouseDown={() => setIsPrevActive(true)}
// //           onMouseUp={() => setIsPrevActive(false)}
// //           onMouseLeave={() => setIsPrevActive(false)}
// //           onClick={(e) => {
// //             e.stopPropagation();
// //             goToPrev();
// //           }}
// //           className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
// //           style={{
// //             background: isPrevActive ? '#FFFFFF80' : '#FFFFFF26',
// //             backdropFilter: 'blur(20px)',
// //             WebkitBackdropFilter: 'blur(20px)',
// //           }}
// //           aria-label="السابق"
// //         >
// //           <img src="/imgs/Vector (19).svg" className="w-5 h-5" alt="السابق" style={{ transform: 'rotate(180deg)' }} />
// //         </button>

// //         {/* زر الإغلاق */}
// //         <button
// //           onClick={closeLightbox}
// //           className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
// //           style={{
// //             background: '#FFFFFF26',
// //             backdropFilter: 'blur(20px)',
// //             WebkitBackdropFilter: 'blur(20px)',
// //           }}
// //           aria-label="إغلاق"
// //         >
// //           <img src="/icons/close.svg" className="w-5 h-5" alt="إغلاق" />
// //         </button>
// //       </div>

// //       {/* الصورة الكبيرة */}
// //       <img
// //         src={profileImages[currentImageIndex]}
// //         alt={`صورة ${currentImageIndex + 1}`}
// //         className="w-full max-w-[450px] h-[450px]   object-cover rounded-[65px] max-w-full max-h-[80vh]"
// //         onClick={(e) => e.stopPropagation()}
// //       />
 
// //     </div>

// //     {/* المعاينات المصغرة */}
// //     <div
// //       className="flex gap-4 mt-8 overflow-x-auto max-w-full px-4 pb-2"
// //       onClick={(e) => e.stopPropagation()}
// //     >
// //       {profileImages.map((img, idx) => (
// //         <img
// //           key={idx}
// //           src={img}
// //           alt={`صورة ${idx + 1}`}
// //           className={`w-[100px] h-[90px] object-cover rounded-[20px] cursor-pointer border-2 transition ${
// //             idx === currentImageIndex
// //               ? 'border-white scale-105'
// //               : 'border-transparent hover:border-gray-400 hover:scale-105'
// //           }`}
// //           onClick={() => setCurrentImageIndex(idx)}
// //         />
// //       ))}
// //     </div>
// //   </div>
// // )}
// //     </section>
// //   );
// // }






// // ظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظظ
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useTranslation } from "@/contexts/TranslationContext";

// // ---------- Helper: TranslateText component with cache ----------
// const translationCache = new Map<string, string>();

// const TranslateText = ({ text }: { text: string }) => {
//   const { translate, language } = useTranslation();
//   const [translated, setTranslated] = useState(text);

//   useEffect(() => {
//     if (!text) {
//       setTranslated("");
//       return;
//     }
//     if (language === "ar") {
//       setTranslated(text);
//       return;
//     }

//     const cacheKey = `${text}-${language}`;
//     if (translationCache.has(cacheKey)) {
//       setTranslated(translationCache.get(cacheKey)!);
//       return;
//     }

//     translate(text)
//       .then((result) => {
//         translationCache.set(cacheKey, result);
//         setTranslated(result);
//       })
//       .catch(() => setTranslated(text));
//   }, [text, language, translate]);

//   return <>{translated}</>;
// };

// // ---------- Hook for translated aria labels ----------
// const useTranslatedLabel = (text: string) => {
//   const { translate, language } = useTranslation();
//   const [label, setLabel] = useState(text);

//   useEffect(() => {
//     if (language === "ar") {
//       setLabel(text);
//       return;
//     }
//     translate(text).then(setLabel).catch(() => setLabel(text));
//   }, [text, language, translate]);

//   return label;
// };

// // ---------- Main Component ----------
// type UserRaw = {
//   rate: string;
//   _id: string;
//   name?: string;
//   username?: string;
//   img?: string;
//   visit?: number;
//   followers?: any[];
//   requestedFollow?: boolean;
// };

// type MyPost = {
//   _id: string;
//   type?: string;
//   image?: {
//     image: string;
//     width?: string;
//     height?: string;
//   }[];
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
//   viewedUserId,
// }: {
//   endpoint?: string;
//   viewedUserId?: string;
// }) {
//   const router = useRouter();
//   const params = useParams();
//   const profileOwnerId = (viewedUserId || params.id) as string;

//   // Translation
//   const { translate, language } = useTranslation();

//   // ---------- State for "أشخاص على مزاجك" ----------
//   const [users, setUsers] = useState<UserRaw[] | null>(null);
//   const [loadingPeople, setLoadingPeople] = useState(true);
//   const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
//   const [followLoadingMap, setFollowLoadingMap] = useState<Record<string, boolean>>({});
//   type FollowerPreview = { _id: string; name: string; img: string };
//   const [followersMap, setFollowersMap] = useState<Record<string, FollowerPreview[]>>({});
//   const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>({});

//   const [isNextActive, setIsNextActive] = useState(false);
//   const [isPrevActive, setIsPrevActive] = useState(false);

//   // ---------- State for "صور" ----------
//   const [profileImages, setProfileImages] = useState<string[]>([]);
//   const [loadingImages, setLoadingImages] = useState(true);
//   const [imagesError, setImagesError] = useState<string | null>(null);
//   const [showAllImages, setShowAllImages] = useState(false);
//   const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

//   // ----- Groups for images (6 per group) -----
//   const [imageGroups, setImageGroups] = useState<string[][]>([]);

//   useEffect(() => {
//     const groupSize = 6;
//     const groups: string[][] = [];
//     for (let i = 0; i < profileImages.length; i += groupSize) {
//       groups.push(profileImages.slice(i, i + groupSize));
//     }
//     setImageGroups(groups);
//   }, [profileImages]);

//   const [rightVisibleIndex, setRightVisibleIndex] = useState(0);
//   useEffect(() => {
//     const slider = imagesScrollerRef.current;
//     if (!slider) return;

//     const handleScroll = () => {
//       const cardWidth = 183 + 12;
//       const index = Math.floor(
//         (slider.scrollLeft + slider.clientWidth - 1) / cardWidth
//       );
//       setRightVisibleIndex(Math.min(index, profileImages.length - 1));
//     };

//     handleScroll();
//     slider.addEventListener("scroll", handleScroll);
//     return () => slider.removeEventListener("scroll", handleScroll);
//   }, [profileImages]);

//   // ---------- Lightbox state ----------
//   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const imagesScrollerRef = useRef<HTMLDivElement>(null);
//   const peopleScrollerRef = useRef<HTMLDivElement>(null);

//   // ---------- Toast state ----------
//   const [toastMessage, setToastMessage] = useState<string | null>(null);
//   const [toastType, setToastType] = useState<"success" | "error">("success");

//   // دالة عرض الـ Toast مع الترجمة
//   const showToast = async (message: string, type: "success" | "error" = "success") => {
//     // ترجمة الرسالة إذا لم تكن عربية
//     let translatedMessage = message;
//     if (language !== "ar") {
//       try {
//         translatedMessage = await translate(message);
//       } catch {
//         translatedMessage = message;
//       }
//     }
//     setToastMessage(translatedMessage);
//     setToastType(type);
//     setTimeout(() => setToastMessage(null), 3000);
//   };

//   // ---------- Get logged-in user ID ----------
//   useEffect(() => {
//     const storedUserData = localStorage.getItem("userData");
//     if (storedUserData) {
//       try {
//         const userData = JSON.parse(storedUserData);
//         setLoggedInUserId(userData._id || null);
//       } catch (e) {
//         console.error("Failed to parse userData", e);
//       }
//     }
//   }, []);

//   // ---------- Fetch users + followers + initial follow status ----------
//   useEffect(() => {
//     if (!loggedInUserId) return;
//     const token = localStorage.getItem("accessToken") || "";
//     (async () => {
//       try {
//         const res = await fetch(endpoint, {
//           cache: "no-store",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         const rows = Array.isArray(data) ? data : data?.data ?? [];
//         const filtered = rows.filter((u: UserRaw) => u._id !== loggedInUserId);
//         const shuffled = shuffleArray(filtered);
//         setUsers(shuffled);

//         const usersToFetch = shuffled.slice(0, 10);
//         const promises = usersToFetch.map(async (user) => {
//           try {
//             const url = `https://bo-chat.space/users/${user._id}?guestid=${loggedInUserId}`;
//             const fRes = await fetch(url, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             const fData = await fRes.json();
//             const followers = fData?.followers ?? [];
//             const totalCount = followers.length;
//             const requestedFollow = fData?.requestedFollow || false;

//             const previewFollowers: FollowerPreview[] = followers
//               .slice(0, 3)
//               .map((f: any) => ({
//                 _id: f.followerid,
//                 name: f.followerdata?.name ?? "User",
//                 img: f.followerdata?.img ?? "/icons/user.svg",
//               }));

//             return { userId: user._id, followers: previewFollowers, count: totalCount, requestedFollow };
//           } catch (error) {
//             console.error(`Error fetching data for ${user._id}:`, error);
//             return { userId: user._id, followers: [], count: 0, requestedFollow: false };
//           }
//         });

//         const results = await Promise.all(promises);
//         const followersMapTemp: Record<string, FollowerPreview[]> = {};
//         const followersCountMapTemp: Record<string, number> = {};
//         const followingMapTemp: Record<string, boolean> = {};

//         results.forEach(({ userId, followers, count, requestedFollow }) => {
//           followersMapTemp[userId] = followers;
//           followersCountMapTemp[userId] = count;
//           followingMapTemp[userId] = requestedFollow;
//         });

//         setFollowersMap(followersMapTemp);
//         setFollowersCountMap(followersCountMapTemp);
//         setFollowingMap(followingMapTemp);
//       } catch (err) {
//         console.error(err);
//         showToast("حدث خطأ أثناء تحميل البيانات", "error");
//       } finally {
//         setLoadingPeople(false);
//       }
//     })();
//   }, [endpoint, loggedInUserId]);

//   // ---------- دالة المتابعة / إلغاء المتابعة ----------
//   const toggleFollow = async (userId: string, currentStatus: boolean) => {
//     const token = localStorage.getItem("accessToken") || "";
//     if (!token) {
//       showToast("يجب تسجيل الدخول أولاً", "error");
//       return;
//     }
//     if (followLoadingMap[userId]) return;
//     setFollowLoadingMap((prev) => ({ ...prev, [userId]: true }));

//     const newStatus = !currentStatus;
//     setFollowingMap((prev) => ({ ...prev, [userId]: newStatus }));

//     try {
//       const res = await fetch("https://bo-chat.space/follow", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           followerid: loggedInUserId,
//           followingid: userId,
//         }),
//       });

//       const data = await res.json();
//       console.log("Follow response:", data);

//       if (!res.ok) {
//         throw new Error(data.message || "فشل تحديث المتابعة");
//       }

//       showToast(newStatus ? "تم المتابعة بنجاح" : "تم إلغاء المتابعة", "success");
//     } catch (error: any) {
//       console.error("Toggle follow error:", error);
//       setFollowingMap((prev) => ({ ...prev, [userId]: currentStatus }));
//       showToast(error.message || "حدث خطأ أثناء محاولة المتابعة", "error");
//     } finally {
//       setFollowLoadingMap((prev) => ({ ...prev, [userId]: false }));
//     }
//   };

//   // ---------- جلب صور الملف الشخصي ----------
//   useEffect(() => {
//     if (!profileOwnerId || !loggedInUserId) return;
//     const fetchProfileImages = async () => {
//       setLoadingImages(true);
//       setImagesError(null);
//       const token = localStorage.getItem("accessToken") || "";
//       const url = `https://bo-chat.space/myposts/${profileOwnerId}?guestid=${loggedInUserId}&page=1&limit=50`;
//       try {
//         const res = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();
//         let posts: MyPost[] = [];
//         if (Array.isArray(data)) posts = data;
//         else if (data.posts && Array.isArray(data.posts)) posts = data.posts;
//         else if (data.data && Array.isArray(data.data)) posts = data.data;

//         const images: string[] = [];
//         posts.forEach((post) => {
//           if (post.type === "image" && Array.isArray(post.image)) {
//             post.image.forEach((img) => {
//               if (img?.image) images.push(img.image);
//             });
//           }
//         });
//         setProfileImages(images);
//       } catch (err: any) {
//         console.error("Error fetching profile images:", err);
//         setImagesError(err.message || "حدث خطأ أثناء تحميل الصور");
//       } finally {
//         setLoadingImages(false);
//       }
//     };
//     fetchProfileImages();
//   }, [profileOwnerId, loggedInUserId]);

//   // Lightbox functions
//   const openLightbox = (index: number) => {
//     setCurrentImageIndex(index);
//     setIsLightboxOpen(true);
//   };

//   const closeLightbox = () => {
//     setIsLightboxOpen(false);
//   };

//   const goToPrev = () => {
//     setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : profileImages.length - 1));
//   };

//   const goToNext = () => {
//     setCurrentImageIndex((prev) => (prev < profileImages.length - 1 ? prev + 1 : 0));
//   };

//   // keyboard navigation
//   useEffect(() => {
//     if (!isLightboxOpen) return;
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") closeLightbox();
//       if (e.key === "ArrowLeft") goToPrev();
//       if (e.key === "ArrowRight") goToNext();
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [isLightboxOpen, profileImages.length]);

//   // Scroll helpers
//   const scrollByAmount = 320;
//   const scrollImagesLeft = () => {
//     imagesScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
//   };
//   const scrollImagesRight = () => {
//     imagesScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
//   };
//   const scrollPeopleLeft = () => {
//     peopleScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
//   };
//   const scrollPeopleRight = () => {
//     peopleScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
//   };

//   const goToProfile = (id: string) => {
//     router.push(`/profile/${id}`);
//   };

//   const truncate = (str: string | undefined, max: number) => {
//     if (!str) return "";
//     return str.length > max ? str.slice(0, max) + "..." : str;
//   };

//   const toggleAllImages = () => {
//     setShowAllImages(!showAllImages);
//   };

//   const hasImages = !loadingImages && !imagesError && profileImages.length > 0;
//   const noImages = !loadingImages && (imagesError || profileImages.length === 0);

//   // Translated labels for aria
//   const toggleLabel = useTranslatedLabel(showAllImages ? "إخفاء كل الصور" : "عرض كل الصور");
//   const leftLabel = useTranslatedLabel("تمرير لليسار");
//   const rightLabel = useTranslatedLabel("تمرير لليمين");
//   const nextLabel = useTranslatedLabel("التالي");
//   const prevLabel = useTranslatedLabel("السابق");
//   const closeLabel = useTranslatedLabel("إغلاق");

//   return (
//     <section className="relative w-full space-y-8">
//       {/* Toast */}
//       {toastMessage && (
//         <div
//           className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] p-3 rounded-lg shadow-lg text-sm font-medium ${
//             toastType === "success"
//               ? "bg-green-100 text-green-700 border border-green-300"
//               : "bg-red-100 text-red-700 border border-red-300"
//           }`}
//         >
//           {toastMessage}
//         </div>
//       )}

//       {/* ===== سلايدر الصور ===== */}
//       <div className="relative">
//         <div className="flex items-center justify-between px-2">
//           <h2 className="text-2xl mb-3">
//             <TranslateText text="صور" />
//           </h2>
//           <button
//             onClick={toggleAllImages}
//             className="mb-3 p-1 rounded-full hover:bg-gray-200 transition"
//             aria-label={toggleLabel}
//           >
//             <img src="/imgs/Vector (5).svg" className="w-[17px] h-[15px] opacity-100" alt={toggleLabel} />
//           </button>
//         </div>

//         {loadingImages && (
//           <div className="flex gap-4 overflow-hidden px-2">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div key={i} className="w-[183px] h-[242px] bg-gray-200 rounded-[30px] animate-pulse shrink-0" />
//             ))}
//           </div>
//         )}

//         {noImages && (
//           <div className="flex flex-col items-center justify-center text-center py-55 px-2">
//             <img src="/imgs/Group 9156.svg" alt="No images" />
//             <p className="font-cairo font-medium text-[30px] leading-[100%] text-center text-black mt-4">
//               <TranslateText text="مفيش صور هنا دلوقتي" />
//             </p>
//             <p className="font-cairo font-normal text-[20px] leading-[30px] text-center text-black mt-2">
//               <TranslateText text="لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا" />
//             </p>
//           </div>
//         )}

//         {hasImages && (
//           <>
//             {!showAllImages ? (
//               // ----- الوضع العادي (سلايدر) -----
//               <>
//                 <button
//                   onClick={scrollImagesLeft}
//                   className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
//                   aria-label={leftLabel}
//                 >
//                   <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt={leftLabel} />
//                 </button>
//                 <button
//                   onClick={scrollImagesRight}
//                   className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
//                   aria-label={rightLabel}
//                 >
//                   <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt={rightLabel} />
//                 </button>
//                 <div
//                   ref={imagesScrollerRef}
//                   className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
//                   dir="ltr"
//                 >
//                   {profileImages.map((imgUrl, idx) => (
//                     <div
//                       key={idx}
//                       className="shrink-0 cursor-pointer relative"
//                       style={{ width: "183px", height: "242px" }}
//                       onClick={() => openLightbox(idx)}
//                     >
//                       <div
//                         className="relative w-full h-full overflow-hidden rounded-[30px] bg-white"
//                         style={{ boxShadow: "0px 1px 10px 0px #0000001A" }}
//                       >
//                         <img
//                           className="w-full h-full object-cover"
//                           alt={`صورة ${idx + 1}`}
//                           src={imgUrl}
//                           style={{
//                             maskImage:
//                               idx === rightVisibleIndex
//                                 ? "linear-gradient(to right, black 25%, transparent 100%)"
//                                 : "none",
//                             WebkitMaskImage:
//                               idx === rightVisibleIndex
//                                 ? "linear-gradient(to right, black 25%, transparent 100%)"
//                                 : "none",
//                           }}
//                           onError={(e) => {
//                             e.currentTarget.src = "/icons/user.svg";
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               // ----- وضع عرض الكل (بدون ترقيم، جميع المجموعات متتالية) -----
//               <div className="px-2">
//                 {imageGroups.map((group, groupIdx) => {
//                   const isEven = groupIdx % 2 === 0;
//                   return (
//                     <div key={groupIdx} className="mb-8 flex flex-col items-center">
//                       <div className={`flex gap-3 justify-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
//                         {group.length > 0 && (
//                           <div
//                             className="cursor-pointer rounded-[15px] overflow-hidden shadow-lg"
//                             style={{ width: "300px", height: "350px" }}
//                             onClick={() => {
//                               const globalIndex = profileImages.indexOf(group[0]);
//                               openLightbox(globalIndex);
//                             }}
//                           >
//                             <img
//                               src={group[0]}
//                               alt="الصورة الرئيسية"
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                         )}
//                         {group.length > 1 && (
//                           <div className="flex flex-col gap-3">
//                             {group.slice(1, 3).map((imgUrl, idx) => (
//                               <div
//                                 key={idx}
//                                 className="cursor-pointer rounded-[15px] overflow-hidden shadow-md hover:scale-105 transition"
//                                 style={{ width: "130px", height: "170px" }}
//                                 onClick={() => {
//                                   const globalIndex = profileImages.indexOf(imgUrl);
//                                   openLightbox(globalIndex);
//                                 }}
//                               >
//                                 <img
//                                   src={imgUrl}
//                                   alt={`صورة مصغرة ${idx + 1}`}
//                                   className="w-full h-full object-cover"
//                                   onError={(e) => {
//                                     e.currentTarget.src = "/icons/user.svg";
//                                   }}
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                       {group.length > 3 && (
//                         <div className="flex gap-3 justify-center mt-3">
//                           {group.slice(3, 6).map((imgUrl, idx) => (
//                             <div
//                               key={idx}
//                               className="cursor-pointer rounded-[15px] overflow-hidden shadow-md hover:scale-105 transition"
//                               style={{ width: "140px", height: "170px" }}
//                               onClick={() => {
//                                 const globalIndex = profileImages.indexOf(imgUrl);
//                                 openLightbox(globalIndex);
//                               }}
//                             >
//                               <img
//                                 src={imgUrl}
//                                 alt={`صورة مصغرة ${idx + 3}`}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.currentTarget.src = "/icons/user.svg";
//                                 }}
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ===== سلايدر أشخاص على مزاجك ===== */}
//       <div className="relative">
//         <h2 className="text-2xl mb-3 px-2">
//           <TranslateText text="أشخاص على مزاجك" />
//         </h2>

//         {loadingPeople && (
//           <div className="flex gap-3 overflow-hidden px-2">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div key={i} className="w-[163px] h-[280px] bg-gray-200 rounded-2xl animate-pulse shrink-0" />
//             ))}
//           </div>
//         )}

//         {!loadingPeople && (!users || users.length === 0) && (
//           <p className="text-gray-500 px-2">
//             <TranslateText text="لا يوجد مستخدمين آخرين." />
//           </p>
//         )}

//         {!loadingPeople && users && users.length > 0 && (
//           <>
//             <button
//               onClick={scrollPeopleLeft}
//               className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
//               aria-label={leftLabel}
//             >
//               <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt={leftLabel} />
//             </button>
//             <button
//               onClick={scrollPeopleRight}
//               className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
//               aria-label={rightLabel}
//             >
//               <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt={rightLabel} />
//             </button>

//             <div
//               ref={peopleScrollerRef}
//               className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
//               dir="ltr"
//             >
//               {users.map((u) => {
//                 const isFollowing = followingMap[u._id] ?? false;
//                 const isLoading = followLoadingMap[u._id] ?? false;
//                 const userFollowers = followersMap[u._id] || [];
//                 const totalFollowers = followersCountMap[u._id] ?? 0;
//                 const displayFollowers = userFollowers.slice(0, 3);

//                 return (
//                   <div
//                     key={u._id}
//                     className="bg-[#F6F6F6] rounded-tl-[127.5px] rounded-tr-[127px] rounded-b-[20px] pt-1 pb-2 w-[163px] shrink-0"
//                   >
//                     <div
//                       role="button"
//                       tabIndex={0}
//                       onClick={() => goToProfile(u._id)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" || e.key === " ") goToProfile(u._id);
//                       }}
//                       className="relative w-[153px] h-[153px] rounded-full mx-auto flex items-center justify-center cursor-pointer"
//                     >
//                       <img
//                         className="w-[153px] h-[153px] rounded-full object-cover"
//                         alt={u.name ?? "User"}
//                         src={u?.img || "/icons/user.svg"}
//                         onError={(e) => {
//                           e.currentTarget.src = "/icons/user.svg";
//                         }}
//                       />
//                       <div className="absolute bottom-0 left-3 w-8 h-8 rounded-full bg-white border border-[#FBFBFB] flex items-center justify-center gap-0.5">
//                         <img
//                           src="/icons/star.svg"
//                           width={7}
//                           height={13}
//                           className="w-[7px] h-[13px]"
//                           alt=""
//                         />
//                         <p className="font-cairo font-bold text-[12px] leading-[165%] text-right text-black">
//                           {Number.isInteger(parseFloat(u.rate))
//                             ? parseFloat(u.rate).toString()
//                             : parseFloat(u.rate).toFixed(1)}
//                         </p>
//                       </div>
//                     </div>
//                     <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">
//                       {truncate(u.name, 10)}
//                     </h3>
//                     <p className="text-gray-500 me-2 text-right text-[9px]">
//                       @{truncate(u.username, 10)}
//                     </p>
//                     <div className="mt-3 flex justify-center">
//                       <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center">
//                         {displayFollowers.length > 0 ? (
//                           displayFollowers.map((follower, i) => (
//                             <img
//                               key={i}
//                               src={follower?.img || "/icons/user.svg"}
//                               className="w-[18px] h-[18px] rounded-full object-cover border border-[#F6F6F6] -ml-1 first:ml-0"
//                               style={{ zIndex: 3 - i }}
//                               alt={follower?.name || "user"}
//                             />
//                           ))
//                         ) : (
//                           <img
//                             src="/icons/user.svg"
//                             className="w-[18px] h-[18px] rounded-full object-cover"
//                             alt="no followers"
//                           />
//                         )}
//                         <span className="mr-1">+{totalFollowers}</span>
//                       </span>

//                       <button
//                         onClick={() => toggleFollow(u._id, isFollowing)}
//                         disabled={isLoading}
//                         className={`w-[70px] h-[30px] flex items-center justify-center gap-1 rounded-full border text-[12px] font-semibold leading-[100%] transition-all ${
//                           isFollowing
//                             ? "border-[#D72229] text-[#D72229] bg-white"
//                             : "border-[#ffffff] text-[#000000] bg-white"
//                         } ${
//                           isLoading
//                             ? "opacity-50 cursor-not-allowed"
//                             : "hover:bg-[#D72229] hover:text-white"
//                         }`}
//                         style={{
//                           fontFamily: "Cairo, sans-serif",
//                           verticalAlign: "middle",
//                         }}
//                       >
//                         <img
//                           src={isFollowing ? "/icons/follow.svg" : "/icons/Vector (13).svg"}
//                           className="w-[14px] h-[14px] object-contain"
//                           alt=""
//                         />
//                         <span>
//                           {isLoading ? (
//                             <TranslateText text="جاري..." />
//                           ) : isFollowing ? (
//                             <TranslateText text="إلغاء" />
//                           ) : (
//                             <TranslateText text="متابعه" />
//                           )}
//                         </span>
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>

//       {/* ===== Lightbox ===== */}
//       {isLightboxOpen && (
//         <div
//           className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4"
//           onClick={closeLightbox}
//         >
//           <div className="relative flex flex-col items-center justify-center w-full max-w-[600px]">
//             {/* أزرار التنقل (فوق الصورة) */}
//             <div className="absolute top-[-65px] left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
//               <button
//                 onMouseDown={() => setIsNextActive(true)}
//                 onMouseUp={() => setIsNextActive(false)}
//                 onMouseLeave={() => setIsNextActive(false)}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToNext();
//                 }}
//                 className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
//                 style={{
//                   background: isNextActive ? '#FFFFFF80' : '#FFFFFF26',
//                   backdropFilter: 'blur(20px)',
//                   WebkitBackdropFilter: 'blur(20px)',
//                 }}
//                 aria-label={nextLabel}
//               >
//                 <img src="/imgs/Vector (19).svg" className="w-5 h-5" alt={nextLabel} />
//               </button>

//               <button
//                 onMouseDown={() => setIsPrevActive(true)}
//                 onMouseUp={() => setIsPrevActive(false)}
//                 onMouseLeave={() => setIsPrevActive(false)}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   goToPrev();
//                 }}
//                 className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
//                 style={{
//                   background: isPrevActive ? '#FFFFFF80' : '#FFFFFF26',
//                   backdropFilter: 'blur(20px)',
//                   WebkitBackdropFilter: 'blur(20px)',
//                 }}
//                 aria-label={prevLabel}
//               >
//                 <img
//                   src="/imgs/Vector (19).svg"
//                   className="w-5 h-5"
//                   alt={prevLabel}
//                   style={{ transform: 'rotate(180deg)' }}
//                 />
//               </button>

//               <button
//                 onClick={closeLightbox}
//                 className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
//                 style={{
//                   background: '#FFFFFF26',
//                   backdropFilter: 'blur(20px)',
//                   WebkitBackdropFilter: 'blur(20px)',
//                 }}
//                 aria-label={closeLabel}
//               >
//                 <img src="/icons/close.svg" className="w-5 h-5" alt={closeLabel} />
//               </button>
//             </div>

//             {/* الصورة الكبيرة */}
//             <img
//               src={profileImages[currentImageIndex]}
//               alt={`صورة ${currentImageIndex + 1}`}
//               className="w-full max-w-[450px] h-[450px] object-cover rounded-[65px] max-w-full max-h-[80vh]"
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>

//           {/* المعاينات المصغرة */}
//           <div
//             className="flex gap-4 mt-8 overflow-x-auto max-w-full px-4 pb-2"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {profileImages.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={`صورة ${idx + 1}`}
//                 className={`w-[100px] h-[90px] object-cover rounded-[20px] cursor-pointer border-2 transition ${
//                   idx === currentImageIndex
//                     ? 'border-white scale-105'
//                     : 'border-transparent hover:border-gray-400 hover:scale-105'
//                 }`}
//                 onClick={() => setCurrentImageIndex(idx)}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/contexts/TranslationContext";

// ---------- القاموس الثابت للترجمة ----------
// (يمكنك نقله إلى ملف منفصل constants/staticTranslations.ts)
const staticTranslations: Record<string, Record<string, string>> = {
  ar: {
    "صور": "صور",
    "أشخاص على مزاجك": "أشخاص على مزاجك",
    "مفيش صور هنا دلوقتي": "مفيش صور هنا دلوقتي",
    "لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا": "لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا",
    "لا يوجد مستخدمين آخرين.": "لا يوجد مستخدمين آخرين.",
    "جاري...": "جاري...",
    "إلغاء": "إلغاء",
    "متابعه": "متابعه",
    "إخفاء كل الصور": "إخفاء كل الصور",
    "عرض كل الصور": "عرض كل الصور",
    "تمرير لليسار": "تمرير لليسار",
    "تمرير لليمين": "تمرير لليمين",
    "التالي": "التالي",
    "السابق": "السابق",
    "إغلاق": "إغلاق",
  },
  en: {
    "صور": "Photos",
    "أشخاص على مزاجك": "People You May Like",
    "مفيش صور هنا دلوقتي": "No photos here yet",
    "لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا": "No photos to show yet, they'll appear here once you add some",
    "لا يوجد مستخدمين آخرين.": "No other users.",
    "جاري...": "Loading...",
    "إلغاء": "Unfollow",
    "متابعه": "Follow",
    "إخفاء كل الصور": "Hide all photos",
    "عرض كل الصور": "Show all photos",
    "تمرير لليسار": "Scroll left",
    "تمرير لليمين": "Scroll right",
    "التالي": "Next",
    "السابق": "Previous",
    "إغلاق": "Close",
  },
};

// ---------- التخزين المؤقت لترجمات API ----------
const translationCache = new Map<string, string>();

// ---------- مكون TranslateText (ثابت + API) ----------
const TranslateText = ({ text }: { text: string }) => {
  const { translate, language } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text) {
      setTranslated("");
      return;
    }
    if (language === "ar") {
      setTranslated(text);
      return;
    }

    // 1- البحث في الترجمة الثابتة
    const staticTranslation = staticTranslations[language]?.[text];
    if (staticTranslation) {
      setTranslated(staticTranslation);
      return;
    }

    // 2- البحث في الـ Cache
    const cacheKey = `${text}-${language}`;
    if (translationCache.has(cacheKey)) {
      setTranslated(translationCache.get(cacheKey)!);
      return;
    }

    // 3- الترجمة عبر API (للنصوص الديناميكية)
    translate(text)
      .then((result) => {
        translationCache.set(cacheKey, result);
        setTranslated(result);
      })
      .catch(() => setTranslated(text));
  }, [text, language, translate]);

  return <>{translated}</>;
};

// ---------- Hook لترجمة aria-label (نفس المنطق) ----------
const useTranslatedLabel = (text: string) => {
  const { translate, language } = useTranslation();
  const [label, setLabel] = useState(text);

  useEffect(() => {
    if (language === "ar") {
      setLabel(text);
      return;
    }
    const staticTranslation = staticTranslations[language]?.[text];
    if (staticTranslation) {
      setLabel(staticTranslation);
      return;
    }
    translate(text).then(setLabel).catch(() => setLabel(text));
  }, [text, language, translate]);

  return label;
};

// ---------- الأنواع والدوال المساعدة ----------
type UserRaw = {
  rate: string;
  _id: string;
  name?: string;
  username?: string;
  img?: string;
  visit?: number;
  followers?: any[];
  requestedFollow?: boolean;
};

type MyPost = {
  _id: string;
  type?: string;
  image?: { image: string; width?: string; height?: string }[];
};

function shuffleArray<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- المكون الرئيسي ----------
export default function AllUsersSlider({
  endpoint = "https://bo-chat.space/allUsers",
  viewedUserId,
}: {
  endpoint?: string;
  viewedUserId?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const profileOwnerId = (viewedUserId || params.id) as string;

  const { translate, language } = useTranslation();

  // ---------- حالات الأشخاص ----------
  const [users, setUsers] = useState<UserRaw[] | null>(null);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [followLoadingMap, setFollowLoadingMap] = useState<Record<string, boolean>>({});
  type FollowerPreview = { _id: string; name: string; img: string };
  const [followersMap, setFollowersMap] = useState<Record<string, FollowerPreview[]>>({});
  const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>({});

  const [isNextActive, setIsNextActive] = useState(false);
  const [isPrevActive, setIsPrevActive] = useState(false);

  // ---------- حالات الصور ----------
  const [profileImages, setProfileImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const [imageGroups, setImageGroups] = useState<string[][]>([]);
  useEffect(() => {
    const groupSize = 6;
    const groups: string[][] = [];
    for (let i = 0; i < profileImages.length; i += groupSize) {
      groups.push(profileImages.slice(i, i + groupSize));
    }
    setImageGroups(groups);
  }, [profileImages]);

  const [rightVisibleIndex, setRightVisibleIndex] = useState(0);
  const imagesScrollerRef = useRef<HTMLDivElement>(null);
  const peopleScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = imagesScrollerRef.current;
    if (!slider) return;
    const handleScroll = () => {
      const cardWidth = 183 + 12;
      const index = Math.floor((slider.scrollLeft + slider.clientWidth - 1) / cardWidth);
      setRightVisibleIndex(Math.min(index, profileImages.length - 1));
    };
    handleScroll();
    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [profileImages]);

  // ---------- Lightbox ----------
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ---------- Toast ----------
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = async (message: string, type: "success" | "error" = "success") => {
    let translatedMessage = message;
    if (language !== "ar") {
      try {
        translatedMessage = await translate(message);
      } catch {
        translatedMessage = message;
      }
    }
    setToastMessage(translatedMessage);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ---------- جلب معرف المستخدم الحالي ----------
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setLoggedInUserId(userData._id || null);
      } catch (e) {
        console.error("Failed to parse userData", e);
      }
    }
  }, []);

  // ---------- جلب المستخدمين والمتابعين ----------
  useEffect(() => {
    if (!loggedInUserId) return;
    const token = localStorage.getItem("accessToken") || "";
    (async () => {
      try {
        const res = await fetch(endpoint, {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const rows = Array.isArray(data) ? data : data?.data ?? [];
        const filtered = rows.filter((u: UserRaw) => u._id !== loggedInUserId);
        const shuffled = shuffleArray(filtered);
        setUsers(shuffled);

        const usersToFetch = shuffled.slice(0, 10);
        const promises = usersToFetch.map(async (user) => {
          try {
            const url = `https://bo-chat.space/users/${user._id}?guestid=${loggedInUserId}`;
            const fRes = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const fData = await fRes.json();
            const followers = fData?.followers ?? [];
            const totalCount = followers.length;
            const requestedFollow = fData?.requestedFollow || false;

            const previewFollowers: FollowerPreview[] = followers.slice(0, 3).map((f: any) => ({
              _id: f.followerid,
              name: f.followerdata?.name ?? "User",
              img: f.followerdata?.img ?? "/icons/user.svg",
            }));

            return { userId: user._id, followers: previewFollowers, count: totalCount, requestedFollow };
          } catch (error) {
            console.error(`Error fetching data for ${user._id}:`, error);
            return { userId: user._id, followers: [], count: 0, requestedFollow: false };
          }
        });

        const results = await Promise.all(promises);
        const followersMapTemp: Record<string, FollowerPreview[]> = {};
        const followersCountMapTemp: Record<string, number> = {};
        const followingMapTemp: Record<string, boolean> = {};

        results.forEach(({ userId, followers, count, requestedFollow }) => {
          followersMapTemp[userId] = followers;
          followersCountMapTemp[userId] = count;
          followingMapTemp[userId] = requestedFollow;
        });

        setFollowersMap(followersMapTemp);
        setFollowersCountMap(followersCountMapTemp);
        setFollowingMap(followingMapTemp);
      } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء تحميل البيانات", "error");
      } finally {
        setLoadingPeople(false);
      }
    })();
  }, [endpoint, loggedInUserId]);

  // ---------- متابعة / إلغاء متابعة ----------
  const toggleFollow = async (userId: string, currentStatus: boolean) => {
    const token = localStorage.getItem("accessToken") || "";
    if (!token) {
      showToast("يجب تسجيل الدخول أولاً", "error");
      return;
    }
    if (followLoadingMap[userId]) return;
    setFollowLoadingMap((prev) => ({ ...prev, [userId]: true }));

    const newStatus = !currentStatus;
    setFollowingMap((prev) => ({ ...prev, [userId]: newStatus }));

    try {
      const res = await fetch("https://bo-chat.space/follow", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerid: loggedInUserId,
          followingid: userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحديث المتابعة");
      showToast(newStatus ? "تم المتابعة بنجاح" : "تم إلغاء المتابعة", "success");
    } catch (error: any) {
      console.error("Toggle follow error:", error);
      setFollowingMap((prev) => ({ ...prev, [userId]: currentStatus }));
      showToast(error.message || "حدث خطأ أثناء محاولة المتابعة", "error");
    } finally {
      setFollowLoadingMap((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // ---------- جلب صور الملف الشخصي ----------
  useEffect(() => {
    if (!profileOwnerId || !loggedInUserId) return;
    const fetchProfileImages = async () => {
      setLoadingImages(true);
      setImagesError(null);
      const token = localStorage.getItem("accessToken") || "";
      const url = `https://bo-chat.space/myposts/${profileOwnerId}?guestid=${loggedInUserId}&page=1&limit=50`;
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let posts: MyPost[] = [];
        if (Array.isArray(data)) posts = data;
        else if (data.posts && Array.isArray(data.posts)) posts = data.posts;
        else if (data.data && Array.isArray(data.data)) posts = data.data;

        const images: string[] = [];
        posts.forEach((post) => {
          if (post.type === "image" && Array.isArray(post.image)) {
            post.image.forEach((img) => {
              if (img?.image) images.push(img.image);
            });
          }
        });
        setProfileImages(images);
      } catch (err: any) {
        console.error("Error fetching profile images:", err);
        setImagesError(err.message || "حدث خطأ أثناء تحميل الصور");
      } finally {
        setLoadingImages(false);
      }
    };
    fetchProfileImages();
  }, [profileOwnerId, loggedInUserId]);

  // ---------- دوال Lightbox ----------
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);
  const goToPrev = () => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : profileImages.length - 1));
  const goToNext = () => setCurrentImageIndex((prev) => (prev < profileImages.length - 1 ? prev + 1 : 0));

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isLightboxOpen, profileImages.length]);

  // ---------- دوال التمرير ----------
  const scrollByAmount = 320;
  const scrollImagesLeft = () => imagesScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  const scrollImagesRight = () => imagesScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  const scrollPeopleLeft = () => peopleScrollerRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  const scrollPeopleRight = () => peopleScrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });

  const goToProfile = (id: string) => router.push(`/profile/${id}`);
  const truncate = (str: string | undefined, max: number) => (!str ? "" : str.length > max ? str.slice(0, max) + "..." : str);
  const toggleAllImages = () => setShowAllImages(!showAllImages);
  const [showNoImages, setShowNoImages] = useState(false);


  const hasImages = !loadingImages && !imagesError && profileImages.length > 0;
  const noImages = !loadingImages && (imagesError || profileImages.length === 0);

  // ---------- ترجمة الـ aria-labels ----------
  const toggleLabel = useTranslatedLabel(showAllImages ? "إخفاء كل الصور" : "عرض كل الصور");
  const leftLabel = useTranslatedLabel("تمرير لليسار");
  const rightLabel = useTranslatedLabel("تمرير لليمين");
  const nextLabel = useTranslatedLabel("التالي");
  const prevLabel = useTranslatedLabel("السابق");
  const closeLabel = useTranslatedLabel("إغلاق");

  // ---------- التصيير ----------
  return (
    <section className="relative w-full space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] p-3 rounded-lg shadow-lg text-sm font-medium ${
            toastType === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {toastMessage}
        </div>
      )}

      {/* ===== سلايدر الصور ===== */}
      <div className="relative">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl mb-3">
            <TranslateText text="صور" />
          </h2>
          <button
            onClick={toggleAllImages}
            className="mb-3 p-1 rounded-full hover:bg-gray-200 transition"
            aria-label={toggleLabel}
          >
            <img src="/imgs/Vector (5).svg" className="w-[17px] h-[15px] opacity-100" alt={toggleLabel} />
          </button>
        </div>

        {loadingImages && (
          <div className="flex gap-4 overflow-hidden px-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[183px] h-[242px] bg-gray-200 rounded-[30px] animate-pulse shrink-0" />
            ))}
          </div>
        )}

        {noImages && (
          <div className="flex flex-col items-center justify-center text-center py-55 px-2">
            <img src="/imgs/Group 9156.svg" alt="No images" />
            <p className="font-cairo font-medium text-[30px] leading-[100%] text-center text-black mt-4">
              <TranslateText text="مفيش صور هنا دلوقتي" />
            </p>
            <p className="font-cairo font-normal text-[20px] leading-[30px] text-center text-black mt-2">
              <TranslateText text="لسه مفيش صور للعرض، لما تضيف صور هتظهر هنا" />
            </p>
          </div>
        )}

        {hasImages && (
          <>
            {!showAllImages ? (
              // الوضع العادي (سلايدر)
              <>
                <button
                  onClick={scrollImagesLeft}
                  className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
                  aria-label={leftLabel}
                >
                  <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt={leftLabel} />
                </button>
                <button
                  onClick={scrollImagesRight}
                  className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
                  aria-label={rightLabel}
                >
                  <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt={rightLabel} />
                </button>
                <div
                  ref={imagesScrollerRef}
                  className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
                  dir="ltr"
                >
                  {profileImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="shrink-0 cursor-pointer relative"
                      style={{ width: "183px", height: "242px" }}
                      onClick={() => openLightbox(idx)}
                    >
                      <div
                        className="relative w-full h-full overflow-hidden rounded-[30px] bg-white"
                        style={{ boxShadow: "0px 1px 10px 0px #0000001A" }}
                      >
                        <img
                          className="w-full h-full object-cover"
                          alt={`صورة ${idx + 1}`}
                          src={imgUrl}
                          style={{
                            maskImage:
                              idx === rightVisibleIndex
                                ? "linear-gradient(to right, black 25%, transparent 100%)"
                                : "none",
                            WebkitMaskImage:
                              idx === rightVisibleIndex
                                ? "linear-gradient(to right, black 25%, transparent 100%)"
                                : "none",
                          }}
                          onError={(e) => (e.currentTarget.src = "/icons/user.svg")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // وضع عرض الكل
              <div className="px-2">
                {imageGroups.map((group, groupIdx) => {
                  const isEven = groupIdx % 2 === 0;
                  return (
                    <div key={groupIdx} className="mb-8 flex flex-col items-center">
                      <div className={`flex gap-3 justify-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                        {group.length > 0 && (
                          <div
                            className="cursor-pointer rounded-[15px] overflow-hidden shadow-lg"
                            style={{ width: "300px", height: "350px" }}
                            onClick={() => {
                              const globalIndex = profileImages.indexOf(group[0]);
                              openLightbox(globalIndex);
                            }}
                          >
                            <img src={group[0]} alt="الصورة الرئيسية" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {group.length > 1 && (
                          <div className="flex flex-col gap-3">
                            {group.slice(1, 3).map((imgUrl, idx) => (
                              <div
                                key={idx}
                                className="cursor-pointer rounded-[15px] overflow-hidden shadow-md hover:scale-105 transition"
                                style={{ width: "130px", height: "170px" }}
                                onClick={() => {
                                  const globalIndex = profileImages.indexOf(imgUrl);
                                  openLightbox(globalIndex);
                                }}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`صورة مصغرة ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.currentTarget.src = "/icons/user.svg")}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {group.length > 3 && (
                        <div className="flex gap-3 justify-center mt-3">
                          {group.slice(3, 6).map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className="cursor-pointer rounded-[15px] overflow-hidden shadow-md hover:scale-105 transition"
                              style={{ width: "140px", height: "170px" }}
                              onClick={() => {
                                const globalIndex = profileImages.indexOf(imgUrl);
                                openLightbox(globalIndex);
                              }}
                            >
                              <img
                                src={imgUrl}
                                alt={`صورة مصغرة ${idx + 3}`}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = "/icons/user.svg")}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== سلايدر أشخاص على مزاجك ===== */}
      <div className="relative">
        <h2 className="text-2xl mb-3 px-2">
          <TranslateText text="أشخاص على مزاجك" />
        </h2>

        {loadingPeople && (
          <div className="flex gap-3 overflow-hidden px-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[163px] h-[280px] bg-gray-200 rounded-2xl animate-pulse shrink-0" />
            ))}
          </div>
        )}

        {!loadingPeople && (!users || users.length === 0) && (
          <p className="text-gray-500 px-2">
            <TranslateText text="لا يوجد مستخدمين آخرين." />
          </p>
        )}

        {!loadingPeople && users && users.length > 0 && (
          <>
            <button
              onClick={scrollPeopleLeft}
              className="absolute z-10 left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
              aria-label={leftLabel}
            >
              <img src="/imgs/arrowleft.svg" className="w-[18px] h-[15px] opacity-100" alt={leftLabel} />
            </button>
            <button
              onClick={scrollPeopleRight}
              className="absolute z-10 right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
              aria-label={rightLabel}
            >
              <img src="/imgs/arrowright.svg" className="w-[18px] h-[15px] opacity-100" alt={rightLabel} />
            </button>

            <div
              ref={peopleScrollerRef}
              className="flex gap-3 overflow-x-auto no-scrollbar px-2 py-3 scroll-smooth"
              dir="ltr"
            >
              {users.map((u) => {
                const isFollowing = followingMap[u._id] ?? false;
                const isLoading = followLoadingMap[u._id] ?? false;
                const userFollowers = followersMap[u._id] || [];
                const totalFollowers = followersCountMap[u._id] ?? 0;
                const displayFollowers = userFollowers.slice(0, 3);

                return (
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
                        onError={(e) => (e.currentTarget.src = "/icons/user.svg")}
                      />
                      <div className="absolute bottom-0 left-3 w-8 h-8 rounded-full bg-white border border-[#FBFBFB] flex items-center justify-center gap-0.5">
                        <img src="/icons/star.svg" width={7} height={13} className="w-[7px] h-[13px]" alt="" />
                        <p className="font-cairo font-bold text-[12px] leading-[165%] text-right text-black">
                          {Number.isInteger(parseFloat(u.rate))
                            ? parseFloat(u.rate).toString()
                            : parseFloat(u.rate).toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <h3 className="mt-4 me-2 text-[14px] text-right font-semibold">{truncate(u.name, 10)}</h3>
                    <p className="text-gray-500 me-2 text-right text-[9px]">@{truncate(u.username, 10)}</p>
                    <div className="mt-3 flex justify-center">
                      <span className="px-4 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                        {displayFollowers.length > 0 ? (
                          displayFollowers.map((follower, i) => (
                            <img
                              key={i}
                              src={follower?.img || "/icons/user.svg"}
                              className="w-[18px] h-[18px] rounded-full object-cover border border-[#F6F6F6] -ml-1 first:ml-0"
                              style={{ zIndex: 3 - i }}
                              alt={follower?.name || "user"}
                            />
                          ))
                        ) : (
                          <img src="/icons/user.svg" className="w-[18px] h-[18px] rounded-full object-cover" alt="no followers" />
                        )}
                        <span className="mr-1">+{totalFollowers}</span>
                      </span>

                      <button
                        onClick={() => toggleFollow(u._id, isFollowing)}
                        disabled={isLoading}
                        className={`w-[70px] h-[30px] flex items-center justify-center gap-1 rounded-full border text-[12px] font-semibold leading-[100%] transition-all ${
                          isFollowing
                            ? "border-[#D72229] text-[#D72229] bg-white"
                            : "border-[#ffffff] text-[#000000] bg-white"
                        } ${
                          isLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#D72229] hover:text-white"
                        }`}
                        style={{ fontFamily: "Cairo, sans-serif", verticalAlign: "middle" }}
                      >
                        <img
                          src={isFollowing ? "/icons/follow.svg" : "/icons/Vector (13).svg"}
                          className="w-[14px] h-[14px] object-contain"
                          alt=""
                        />
                        <span>
                          {isLoading ? (
                            <TranslateText text="جاري..." />
                          ) : isFollowing ? (
                            <TranslateText text="إلغاء" />
                          ) : (
                            <TranslateText text="متابعه" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ===== Lightbox ===== */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative flex flex-col items-center justify-center w-full max-w-[600px]">
            <div className="absolute top-[-65px] left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                <button
                onClick={closeLightbox}
                className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: '#FFFFFF26',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
                aria-label={closeLabel}
              >
                <img src="/icons/close.svg" className="w-5 h-5" alt={closeLabel} />
              </button>
             
              <button
                onMouseDown={() => setIsPrevActive(true)}
                onMouseUp={() => setIsPrevActive(false)}
                onMouseLeave={() => setIsPrevActive(false)}
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: isPrevActive ? '#FFFFFF80' : '#FFFFFF26',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
                aria-label={prevLabel}
              >
                <img src="/imgs/Vector (19).svg" className="w-5 h-5" alt={prevLabel} style={{ transform: 'rotate(180deg)' }} />
              </button>
               <button
                onMouseDown={() => setIsNextActive(true)}
                onMouseUp={() => setIsNextActive(false)}
                onMouseLeave={() => setIsNextActive(false)}
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: isNextActive ? '#FFFFFF80' : '#FFFFFF26',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
                aria-label={nextLabel}
              >
                <img src="/imgs/Vector (19).svg" className="w-5 h-5" alt={nextLabel} />
              </button>
          
            </div>

            <img
              src={profileImages[currentImageIndex]}
              alt={`صورة ${currentImageIndex + 1}`}
              className="w-full max-w-[450px] h-[450px] object-cover rounded-[65px] max-w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div
            className="flex gap-4 mt-8 overflow-x-auto max-w-full px-4 pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            {profileImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`صورة ${idx + 1}`}
                className={`w-[100px] h-[90px] object-cover rounded-[20px] cursor-pointer border-2 transition ${
                  idx === currentImageIndex
                    ? 'border-white scale-105'
                    : 'border-transparent hover:border-gray-400 hover:scale-105'
                }`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}