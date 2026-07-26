 
// 'use client';
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { SearchResult } from '@/types/search-result';
// import { SearchProvider } from '@/types/search-provider';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useTranslation } from '@/contexts/TranslationContext';
// import { useSearchStore } from '@/store/searchStore';

// // ============== الأنواع ==================
// export type GlobalSearchProps = {
//   providers: SearchProvider[];
//   placeholder?: string;
//   dir?: 'rtl' | 'ltr';
//   className?: string;
// };

// // ============== المساعدات ==================
// function cn(...classes: Array<string | undefined | false>) {
//   return classes.filter(Boolean).join(' ');
// }

// export const Magnifier = () => (
//   <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" aria-hidden>
//     <path
//       fill="#C5C6C6"
//       d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-2a8 8 0 0 0 0 16 7.95 7.95 0 0 0 4.9-1.64l4.37 4.38 1.42-1.42-4.38-4.37A7.95 7.95 0 0 0 18 10a8 8 0 0 0-8-8Z"
//     />
//   </svg>
// );

// const LogoutIcon = () => (
//   <img src="/imgs/Group (2).svg" alt="Logout Button" width={22} height={22} />
// );

// const TranslateIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#555" className="w-6 h-6 shrink-0">
//     <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
//   </svg>
// );

// // ===== أيقونة الحذف (X داخل دائرة) =====
// const DeleteIcon = () => (
//   <svg 
//     width="20" 
//     height="20" 
//     viewBox="0 0 20 20" 
//     fill="none" 
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     {/* الدائرة */}
//     <circle 
//       cx="10" 
//       cy="10" 
//       r="9" 
//       stroke="#878787" 
//       strokeWidth="1.5"
//       fill="none"
//     />
//     {/* علامة X */}
//     <path 
//       d="M6.5 13.5L13.5 6.5M6.5 6.5L13.5 13.5" 
//       stroke="#878787" 
//       strokeWidth="1.5" 
//       strokeLinecap="round" 
//       strokeLinejoin="round"
//     />
//   </svg>
// );

// function useDebounced<T>(value: T, delay = 250) {
//   const [v, setV] = useState(value);
//   useEffect(() => {
//     const id = setTimeout(() => setV(value), delay);
//     return () => clearTimeout(id);
//   }, [value, delay]);
//   return v;
// }

// // ============== المكون الرئيسي ==================
// export default function GlobalSearch({ providers, placeholder }: GlobalSearchProps) {
//   const { searchQuery, setSearchQuery } = useSearchStore();

//   const [open, setOpen] = useState(false);
//   const [activeIndex, setActiveIndex] = useState<number>(-1);
//   const [results, setResults] = useState<Record<string, SearchResult[]>>({});
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
//   // ===== حالة الاقتراحات والترندات =====
//   const [suggestions, setSuggestions] = useState<Array<{id: string, name: string, username?: string, avatar?: string}>>([]);
//   const [suggestionsLoading, setSuggestionsLoading] = useState(false);
//   const [trendingData, setTrendingData] = useState<Array<{keyword: string}>>([]);
//   const [trendingLoading, setTrendingLoading] = useState(false);
//   const [showAllTrending, setShowAllTrending] = useState(false);
//   const [isExpanding, setIsExpanding] = useState(false);

//   const debounced = useDebounced(searchQuery, 200);
//   const panelRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   const { language, setLanguage } = useTranslation();
//   const currentLang = language || 'ar';
//   const layoutDirection = currentLang === 'ar' ? 'ltr' : 'rtl';

//   const router = useRouter();

//   // ===== الحصول على userId من localStorage =====
//   const getUserId = () => {
//     try {
//       const userData = localStorage.getItem('userData');
//       if (userData) {
//         const parsed = JSON.parse(userData);
//         return parsed._id || parsed.id || parsed.userId || '6a146c641fd49d5aecdec751';
//       }
//     } catch (e) {
//       console.warn('Could not parse userData from localStorage', e);
//     }
//     return '6a146c641fd49d5aecdec751';
//   };

//   // ===== جلب الترندات من الـ API =====
//   useEffect(() => {
//     const fetchTrending = async () => {
//       setTrendingLoading(true);
//       try {
//         const userId = getUserId();
//         const apiUrl = `https://bo-chat.space/api/smart_search/trend?userid=${userId}&perid=day`;
        
//         const response = await fetch(apiUrl);
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch trending: ${response.status}`);
//         }

//         const data = await response.json();
        
//         if (Array.isArray(data)) {
//           const filteredData = data
//             .filter((item: any) => item.keyword && item.keyword.trim() !== '' && item.keyword !== 'null')
//             .map((item: any) => ({ keyword: item.keyword }));
//           setTrendingData(filteredData);
//         } else {
//           setTrendingData([]);
//         }
//       } catch (error) {
//         console.error('Error fetching trending:', error);
//         setTrendingData([]);
//       } finally {
//         setTrendingLoading(false);
//       }
//     };

//     fetchTrending();
//   }, []);

//   // ===== جلب الاقتراحات من الـ API =====
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (!searchQuery.trim()) {
//         setSuggestions([]);
//         return;
//       }

//       setSuggestionsLoading(true);
//       try {
//         const userId = getUserId();
//         const apiUrl = `https://bo-chat.space/api/smart_search/suggestions?userid=${userId}&q=${encodeURIComponent(searchQuery)}`;
        
//         const response = await fetch(apiUrl);
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch suggestions: ${response.status}`);
//         }

//         const data = await response.json();
        
//         if (data.status === 'success' && Array.isArray(data.data)) {
//            const filteredSuggestions = data.data
//             .filter((item: any) => item && item.trim() !== '' && item !== 'null' && item !== 'undefined')
//             .map((item: any) => {
//                if (typeof item === 'object' && item !== null) {
                
//                 return {
//                   id: item._id || item.id || item.userId || '',
//                   name: item.name || item.username || item.displayName || '',
//                   username: item.username || item.name || '',
//                   avatar: item.avatar || item.profileImage || item.image || ''
//                 };
//               }
//                return {
//                 id: '',
//                 name: item,
//                 username: item,
//                 avatar: ''
//               };
//             })
//             .slice(0, 5);
//           setSuggestions(filteredSuggestions);
//         } else {
//           setSuggestions([]);
//         }
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//         setSuggestions([]);
//       } finally {
//         setSuggestionsLoading(false);
//       }
//     };

//     const timer = setTimeout(() => {
//       fetchSuggestions();
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // ===== متابعة حالة تسجيل الدخول =====
//   useEffect(() => {
//     const updateStates = () => {
//       const userData = localStorage.getItem('userData');
//       setIsLoggedIn(!!userData);
//     };
//     updateStates();
//     window.addEventListener('userDataUpdated', updateStates);

//     const handleStorage = (e: StorageEvent) => {
//       if (e.key === 'userData') updateStates();
//     };
//     window.addEventListener('storage', handleStorage);

//     return () => {
//       window.removeEventListener('userDataUpdated', updateStates);
//       window.removeEventListener('storage', handleStorage);
//     };
//   }, []);

//   // ===== دوال الترجمة والخروج =====
//   const handleToggleLanguage = () => {
//     const nextLang = currentLang === 'ar' ? 'en' : 'ar';
//     if (typeof setLanguage === 'function') {
//       setLanguage(nextLang);
//     }
//     localStorage.setItem('siteLanguage', nextLang);
//   };

//   const confirmLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     window.dispatchEvent(new Event('userDataUpdated'));
//     router.push('/login');
//     setShowLogoutDialog(false);
//   };

//   const cancelLogout = () => {
//     setShowLogoutDialog(false);
//   };

//   const handleLogout = () => {
//     setShowLogoutDialog(true);
//   };

//   // ===== تسوية النتائج =====
//   const flatResults = useMemo(
//     () =>
//       Object.entries(results).flatMap(([key, arr]) =>
//         arr.map((r) => ({ section: key, ...r }))
//       ),
//     [results]
//   );

//   // ===== البحث =====
//   useEffect(() => {
//     if (!debounced.trim()) {
//       setResults({});
//       return;
//     }
//     let cancelled = false;
//     (async () => {
//       setLoading(true);
//       const sections: Record<string, SearchResult[]> = {};
//       await Promise.all(
//         providers.map(async (p) => {
//           try {
//             const out = await p.search(debounced);
//             if (!cancelled) sections[p.label] = out.slice(0, 5);
//           } catch (e) {
//             if (!cancelled)
//               sections[p.label] = [
//                 { id: `${p.key}-err`, title: 'Error loading', subtitle: String(e) },
//               ];
//           }
//         })
//       );
//       if (!cancelled) {
//         setResults(sections);
//         setOpen(true);
//         setActiveIndex(-1);
//       }
//       setLoading(false);
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [debounced, providers]);

//   // ===== إغلاق القائمة عند النقر خارجها =====
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!panelRef.current) return;
//       if (!panelRef.current.contains(e.target as Node)) {
//         setOpen(false);
//         setShowAllTrending(false);
//         setIsExpanding(false);
//       }
//     };
//     document.addEventListener('click', handler);
//     return () => document.removeEventListener('click', handler);
//   }, []);

//   // ===== التنقل بالكيبورد =====
//   const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
//     if (!open) return;
//     if (e.key === 'ArrowDown') {
//       e.preventDefault();
//       setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
//     }
//     if (e.key === 'ArrowUp') {
//       e.preventDefault();
//       setActiveIndex((i) => Math.max(i - 1, 0));
//     }
//     if (e.key === 'Enter') {
//       const r = flatResults[activeIndex];
//       if (r?.href) {
//         e.preventDefault();
//         router.push(r.href);
//         setOpen(false);
//       }
//     }
//     if (e.key === 'Escape') {
//       setOpen(false);
//       setShowAllTrending(false);
//       setIsExpanding(false);
//     }
//   };

//   // ===== دوال إدارة سجل البحث =====
//   const deleteSearchHistoryItem = async (keyword: string) => {
//     try {
//       const userId = getUserId();
//       const apiUrl = 'https://bo-chat.space/api/delete_search_history';
      
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userid: userId,
//           keyword: keyword
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete search history: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.status === 'success') {
//         setTrendingData(prevData => 
//           prevData.filter(item => item.keyword !== keyword)
//         );
//       } else {
//         throw new Error(data.message || 'Failed to delete search history');
//       }
      
//     } catch (error) {
//       console.error('Error deleting search history:', error);
//       setTrendingData(prevData => 
//         prevData.filter(item => item.keyword !== keyword)
//       );
//     }
//   };

//   const deleteAllSearchHistory = async () => {
//     try {
//       const userId = getUserId();
//       const apiUrl = 'https://bo-chat.space/api/delete_search_history';
      
//       const deletePromises = trendingData.map(item => 
//         fetch(apiUrl, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             userid: userId,
//             keyword: item.keyword
//           }),
//         })
//       );

//       await Promise.all(deletePromises);
//       setTrendingData([]);
//     } catch (error) {
//       console.error('Error deleting all search history:', error);
//       setTrendingData([]);
//     }
//   };

//   const navigateToSearch = (term: string) => {
//     setOpen(false);
//     setSearchQuery(term);
//     window.location.href = `/search?q=${encodeURIComponent(term)}`;
//   };

//   // ===== دالة التنقل إلى صفحة المستخدم =====
//   const navigateToProfile = (userId: string) => {
//     setOpen(false);
//     if (userId) {
//       window.location.href = `/profile/${userId}`;
//     }
//   };

//   const handleSearchHistoryClick = (term: string) => {
//     navigateToSearch(term);
//   };

//   const handleSuggestionClick = (suggestion: {id: string, name: string, username?: string, avatar?: string}) => {
//     // استخدام الـ id إذا كان موجود، وإلا استخدام الـ username
//     const userId = suggestion.id || suggestion.username || suggestion.name;
//     navigateToProfile(userId);
//   };

//   const handleFocus = () => {
//     if (!searchQuery.trim()) {
//       setOpen(true);
//     }
//   };

//   const ITEMS_TO_SHOW = 5;
  
//   const getDisplayedTrending = () => {
//     if (showAllTrending) {
//       return trendingData;
//     }
//     return trendingData.slice(0, ITEMS_TO_SHOW);
//   };

//   const removeTrendingItem = (keyword: string) => {
//     deleteSearchHistoryItem(keyword);
//   };

//   const handleClearHistory = () => {
//     deleteAllSearchHistory();
//   };

//   const handleShowMore = () => {
//     setIsExpanding(true);
//     setTimeout(() => {
//       setShowAllTrending(true);
//       setIsExpanding(false);
//     }, 300);
//   };

//   // ===== ألوان عشوائية للدوائر =====
//   const getRandomColor = (name: string) => {
//     const colors = [
//       'bg-red-100 text-red-600',
//       'bg-blue-100 text-blue-600',
//       'bg-green-100 text-green-600',
//       'bg-yellow-100 text-yellow-600',
//       'bg-purple-100 text-purple-600',
//       'bg-pink-100 text-pink-600',
//       'bg-indigo-100 text-indigo-600',
//       'bg-teal-100 text-teal-600',
//       'bg-orange-100 text-orange-600',
//       'bg-cyan-100 text-cyan-600'
//     ];
//     const index = name.length % colors.length;
//     return colors[index];
//   };

//   return (
//     <div className={cn('w-full px-[30px] py-[15px]')} dir={layoutDirection}>
//       <div className="flex items-center justify-between w-full gap-3">
//         {/* الشعار */}
//         <Link href="/">
//           <img src="/logo-red.png" width={35} alt="logo" />
//         </Link>

//         {/* مجموعة الأزرار والبحث */}
//         <div className="flex items-center gap-3">
//           {/* زر الترجمة */}
//           <button
//             onClick={handleToggleLanguage}
//             title={currentLang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
//             className="w-[80px] h-[60px] rounded-[27px] bg-[#F2F2F2] flex flex-col items-center justify-center cursor-pointer border-0 gap-0.5 hover:bg-neutral-200/80 transition shrink-0"
//           >
//             <TranslateIcon />
//             <span className="text-[10px] font-bold text-neutral-600 uppercase">
//               {currentLang === 'ar' ? 'EN' : 'AR'}
//             </span>
//           </button>

//           {/* زر تسجيل الخروج */}
//           {isLoggedIn && (
//             <button
//               onClick={handleLogout}
//               title={currentLang === 'en' ? 'Logout' : 'تسجيل الخروج'}
//               className="w-[80px] h-[60px] rounded-[27px] bg-[#F2F2F2] flex items-center justify-center cursor-pointer border-0 hover:bg-neutral-200/80 transition shrink-0"
//             >
//               <LogoutIcon />
//             </button>
//           )}

//           {/* ===== شريط البحث ===== */}
//           <div className="relative z-[9998]" ref={panelRef}>
//             <div className="flex items-center gap-2 bg-[#F2F2F2] rounded-t-[27px] rounded-b-none px-4 h-[60px] w-[446px]">
//               <input
//                 ref={searchInputRef}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={onKeyDown}
//                 onFocus={handleFocus}
//                 placeholder={
//                   placeholder ||
//                   (currentLang === 'en' ? 'Search here...' : 'اكتب ما تبحث عنه هنا')
//                 }
//                 className="bg-transparent outline-none w-full text-[15px] placeholder:text-[#C5C6C6]"
//                 autoComplete="off"
//                 dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
//                 style={{ textAlign: currentLang === 'ar' ? 'right' : 'left' }}
//               />
//               <Magnifier />
//             </div>

//             {/* ===== قائمة النتائج المنسدلة ===== */}
//             {open && (
//               <div className="absolute top-full left-0 z-50 w-[446px] rounded-b-[27px] bg-[#F2F2F2] shadow-2xl overflow-hidden">
//                 {!searchQuery.trim() && (
//                   <div>
//                     <div className="flex items-center justify-between px-4 py-3">
//                       {trendingData.length > 0 && (
//                         <button
//                           onClick={handleClearHistory}
//                           className="text-xs text-red-500 hover:text-red-600 transition bg-transparent border-0 cursor-pointer"
//                           style={{
//                             fontFamily: 'Cairo',
//                             fontWeight: 600,
//                             fontSize: '12px',
//                             lineHeight: '100%',
//                             color: '#D72229',
//                             textAlign: 'right',
//                             verticalAlign: 'middle'
//                           }}
//                         >
//                           {currentLang === 'en' ? 'Clear All' : 'حذف الكل'}
//                         </button>
//                       )}
//                       <span 
//                         className="text-sm font-medium text-neutral-700"
//                         style={{
//                           fontFamily: 'Cairo',
//                           fontWeight: 600,
//                           fontSize: '16px',
//                           lineHeight: '100%',
//                           color: '#000000',
//                           textAlign: 'right',
//                           verticalAlign: 'middle'
//                         }}
//                       >
//                         {currentLang === 'en' ? 'Recent Searches' : 'سجل البحث'}
//                       </span>
//                     </div>

//                     {trendingLoading ? (
//                       <div className="px-4 py-3 text-sm text-neutral-500 text-center">
//                         {currentLang === 'en' ? 'Loading...' : 'جاري التحميل...'}
//                       </div>
//                     ) : trendingData.length === 0 ? (
//                       <div className="px-4 py-3 text-sm text-neutral-500 text-center">
//                         {currentLang === 'en' ? 'No recent searches' : 'لا توجد عمليات بحث حديثة'}
//                       </div>
//                     ) : (
//                       <>
//                         <div 
//                           className={cn(
//                             "relative overflow-y-auto transition-all duration-300 ease-in-out",
//                             isExpanding && "scale-95 opacity-50",
//                             !showAllTrending ? "max-h-[200px]" : "max-h-[600px]"
//                           )}
//                         >
//                           <ul>
//                             {getDisplayedTrending().map((item, index) => (
//                               <li
//                                 key={index}
//                                 className="group flex items-center justify-between px-4 py-1 hover:bg-neutral-100 transition relative"
//                               >
//                                 <button
//                                   onClick={() => handleSearchHistoryClick(item.keyword)}
//                                   className="flex-1 text-start flex items-center gap-3 bg-transparent border-0 cursor-pointer"
//                                 >
//                                   <Magnifier />
//                                   <span className="text-sm text-neutral-700">{item.keyword}</span>
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     removeTrendingItem(item.keyword);
//                                   }}
//                                   className="bg-transparent border-0 cursor-pointer flex items-center justify-center hover:opacity-70 transition-opacity"
//                                   aria-label="Delete search"
//                                   style={{
//                                     width: '12px',
//                                     height: '12px',
//                                     padding: 0,
//                                     margin: 0
//                                   }}
//                                 >
//                                   <DeleteIcon />
//                                 </button>
//                                 {index < getDisplayedTrending().length - 1 && (
//                                   <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[398px] h-px border-t border-[#DADADA]"></span>
//                                 )}
//                               </li>
//                             ))}
//                           </ul>
                          
//                           {trendingData.length > ITEMS_TO_SHOW && !showAllTrending && (
//                             <div 
//                               className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
//                               style={{
//                                 background: 'linear-gradient(to top, #F2F2F2 0%, transparent 100%)'
//                               }}
//                             />
//                           )}
//                         </div>
                        
//                         {trendingData.length > ITEMS_TO_SHOW && !showAllTrending && (
//                           <div className="px-4 py-3">
//                             <button
//                               onClick={handleShowMore}
//                               disabled={isExpanding}
//                               className={cn(
//                                 "w-full text-center text-sm text-red-500 hover:text-red-600 transition font-medium border-0 bg-transparent cursor-pointer",
//                                 isExpanding && "opacity-50 cursor-not-allowed"
//                               )}
//                             >
//                               {isExpanding ? (
//                                 <span className="inline-flex items-center gap-2">
//                                   <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                   </svg>
//                                   {currentLang === 'en' ? 'Loading...' : 'جاري التحميل...'}
//                                 </span>
//                               ) : (
//                                 currentLang === 'en' 
//                                   ? `View More  ` 
//                                   : `مشاهدة المزيد `
//                               )}
//                             </button>
//                           </div>
//                         )}
//                       </>
//                     )}

//                     {/* ===== قسم قد يعجبك - اقتراحات من API (عرض عمودي مع خط فاصل) ===== */}
//                     <div className="px-4 py-3 border-t border-[#DADADA]">
//                       <div className="flex items-center justify-end gap-2 mb-2">
//                         <span className="font-[Cairo] font-semibold text-[16px] leading-none tracking-[0] text-right text-[#D72229]">
//                           {currentLang === 'en' ? 'You might like' : 'قد يعجبك'}
//                         </span>
//                         <img
//                           src="/imgs/arrow.svg"
//                           alt="icon"
//                           className="w-[15px] h-[7px]"
//                         />
//                       </div>
//                       {suggestionsLoading ? (
//                         <div className="text-sm text-neutral-500 text-center py-2">
//                           {currentLang === 'en' ? 'Loading suggestions...' : 'جاري تحميل الاقتراحات...'}
//                         </div>
//                       ) : suggestions.length === 0 ? (
//                         <div className="text-sm text-neutral-500 text-center py-2">
//                           {currentLang === 'en' ? 'No suggestions' : 'لا توجد اقتراحات'}
//                         </div>
//                       ) : (
//                         <div className="flex flex-col gap-2">
//                           {suggestions.map((suggestion, idx) => (
//                             <div key={idx}>
//                               <button
//                                 onClick={() => handleSuggestionClick(suggestion)}
//                                 className="flex items-center gap-3 px-3 py-2 text-sm bg-transparent hover:bg-neutral-100 text-neutral-700 transition w-full text-start border-0 cursor-pointer rounded-full"
//                               >
//                                 {suggestion.avatar ? (
//                                   <img 
//                                     src={suggestion.avatar} 
//                                     alt={suggestion.name}
//                                     className="w-10 h-10 rounded-full object-cover shrink-0"
//                                   />
//                                 ) : (
//                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${getRandomColor(suggestion.name)}`}>
//                                     {suggestion.name.charAt(0).toUpperCase()}
//                                   </div>
//                                 )}
//                                 <span className="font-medium">{suggestion.name}</span>
//                                 {suggestion.username && suggestion.username !== suggestion.name && (
//                                   <span className="text-xs text-neutral-400">@{suggestion.username}</span>
//                                 )}
//                               </button>
//                               {idx < suggestions.length - 1 && (
//                                 <div className="w-full px-3">
//                                   <span className="block w-full h-px border-t border-[#DADADA]"></span>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {searchQuery.trim() && (
//                   <>
//                     {loading && (
//                       <div className="px-4 py-3 text-sm text-neutral-500 text-center">
//                         {currentLang === 'en' ? 'Searching...' : 'جاري البحث…'}
//                       </div>
//                     )}
//                     {!loading && Object.keys(results).length === 0 && suggestions.length === 0 && (
//                       <div className="px-4 py-3 text-sm text-neutral-500 text-center">
//                         {currentLang === 'en' ? 'No results found' : 'لا توجد نتائج'}
//                       </div>
//                     )}
                    
//                     {/* عرض الاقتراحات في نتائج البحث (عرض عمودي مع خط فاصل) */}
//                     {suggestions.length > 0 && (
//                       <div className="px-4 py-3">
//                         <div className="flex items-center justify-end gap-2 mb-2">
//                           <span className="font-[Cairo] font-semibold text-[16px] leading-none tracking-[0] text-right text-[#D72229]">
//                             {currentLang === 'en' ? 'You might like' : 'قد يعجبك'}
//                           </span>
//                           <img
//                             src="/imgs/arrow.svg"
//                             alt="icon"
//                             className="w-[15px] h-[7px]"
//                           />
//                         </div>
//                         <div className="flex flex-col gap-2">
//                       {suggestions.map((suggestion, idx) => (
//   <div key={idx}>
//     <button
//       onClick={() => handleSuggestionClick(suggestion)}
//       className="flex items-center gap-3 px-3 py-2 text-sm bg-transparent hover:bg-neutral-100 text-neutral-700 transition w-full text-start border-0 cursor-pointer"
//     >
//       {/* الدائرة */}
//       <div className="w-2 h-2 rounded border border-[#878787] shrink-0"></div>

//       {/* الاسم واسم المستخدم */}
//       <div className="flex flex-col items-start">
//         <span className="font-medium">
//           {suggestion.name}
//         </span>

//         {suggestion.username &&
//           suggestion.username !== suggestion.name && (
//             <span className="text-xs text-neutral-400">
//               @{suggestion.username}
//             </span>
//         )}
//       </div>
//     </button>

//     {idx < suggestions.length - 1 && (
//       <div className="w-full px-3">
//         <span className="block w-full h-px border-t border-[#DADADA]"></span>
//       </div>
//     )}
//   </div>
// ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* عرض نتائج البحث */}
//                     {!loading &&
//                       Object.entries(results).map(([label, items]) => (
//                         <div key={label}>
//                           <div className="px-4 pt-4 pb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
//                             {label}
//                           </div>
//                           <ul className="max-h-[52vh] overflow-y-auto">
//                             {items.map((r) => {
//                               const flatIndex = Object.entries(results)
//                                 .flatMap(([, arr]) => arr)
//                                 .indexOf(r);
//                               const isActive = activeIndex === flatIndex;
//                               return (
//                                 <li 
//                                   key={r.id} 
//                                   onMouseEnter={() => setActiveIndex(flatIndex)}
//                                   className="border-b border-[#DADADA] last:border-b-0"
//                                 >
//                                   <button
//                                     className={cn(
//                                       'w-full text-start border-0 bg-transparent py-3 px-4 transition flex items-center gap-3 cursor-pointer',
//                                       isActive && 'bg-neutral-100'
//                                     )}
//                                     onClick={(e) => {
//                                       e.preventDefault();
//                                       if (r.href) {
//                                         window.location.href = r.href;
//                                         setOpen(false);
//                                       }
//                                     }}
//                                   >
//                                     <div className="text-red-600 shrink-0">
//                                       {r.icon ?? <Magnifier />}
//                                     </div>
//                                     <div className="min-w-0">
//                                       <div className="text-sm font-medium truncate text-neutral-800">
//                                         {r.title}
//                                       </div>
//                                       {r.subtitle && (
//                                         <div className="text-xs text-neutral-500 truncate">
//                                           {r.subtitle}
//                                         </div>
//                                       )}
//                                     </div>
//                                     {r.meta && (
//                                       <div className="ms-auto text-[11px] text-neutral-500 shrink-0">
//                                         {r.meta}
//                                       </div>
//                                     )}
//                                   </button>
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         </div>
//                       ))}
//                   </>
//                 )}

//                 {searchQuery.trim() && Object.keys(results).length > 0 && (
//                   <div className="px-4 py-3 border-t border-[#DADADA]">
//                     <button
//                       onClick={() => {
//                         console.log('Show more results');
//                       }}
//                       className="w-full text-center text-sm text-red-500 hover:text-red-600 transition font-medium border-0 bg-transparent cursor-pointer"
//                     >
//                       {currentLang === 'en' ? 'View More Results' : 'مشاهدة المزيد من النتائج'}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ===== حوار تأكيد الخروج (Modal) ===== */}
//           {showLogoutDialog && (
//             <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
//               <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl text-center">
//                 <h3 className="text-lg font-bold text-neutral-800 mb-2">
//                   {currentLang === 'en' ? 'Confirm Logout' : 'تأكيد تسجيل الخروج'}
//                 </h3>
//                 <p className="text-sm text-neutral-600 mb-6">
//                   {currentLang === 'en' ? 'Are you sure you want to log out?' : 'هل أنت متأكد أنك تريد تسجيل الخروج؟'}
//                 </p>
//                 <div className="flex gap-3 justify-center">
//                   <button
//                     onClick={cancelLogout}
//                     className="flex-1 py-2 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition border-0 cursor-pointer"
//                   >
//                     {currentLang === 'en' ? 'Cancel' : 'إلغاء'}
//                   </button>
//                   <button
//                     onClick={confirmLogout}
//                     className="flex-1 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition border-0 cursor-pointer"
//                   >
//                     {currentLang === 'en' ? 'Logout' : 'خروج'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// src/components/GlobalSearch.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SearchResult } from '@/types/search-result';
import { SearchProvider } from '@/types/search-provider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { useTranslations } from 'next-intl';
import { useSearchStore } from '@/store/searchStore';
import { useLocale } from 'next-intl';

// ============== الأنواع ==================
export type GlobalSearchProps = {
  providers: SearchProvider[];
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
  className?: string;
};

// ============== المساعدات ==================
function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Magnifier = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" aria-hidden>
    <path
      fill="#C5C6C6"
      d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-2a8 8 0 0 0 0 16 7.95 7.95 0 0 0 4.9-1.64l4.37 4.38 1.42-1.42-4.38-4.37A7.95 7.95 0 0 0 18 10a8 8 0 0 0-8-8Z"
    />
  </svg>
);

const LogoutIcon = () => (
  <img src="/imgs/Group (2).svg" alt="Logout Button" width={22} height={22} />
);

const TranslateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#555" className="w-6 h-6 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
  </svg>
);

const DeleteIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="10" 
      cy="10" 
      r="9" 
      stroke="#878787" 
      strokeWidth="1.5"
      fill="none"
    />
    <path 
      d="M6.5 13.5L13.5 6.5M6.5 6.5L13.5 13.5" 
      stroke="#878787" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

// ============== المكون الرئيسي ==================
export default function GlobalSearch({ providers, placeholder }: GlobalSearchProps) {
  const { searchQuery, setSearchQuery } = useSearchStore();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [results, setResults] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const [suggestions, setSuggestions] = useState<Array<{id: string, name: string, username?: string, avatar?: string}>>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [trendingData, setTrendingData] = useState<Array<{keyword: string}>>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [showAllTrending, setShowAllTrending] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const debounced = useDebounced(searchQuery, 200);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ✅ استخدام useTranslations للترجمة الثابتة
  const t = useTranslations('GlobalSearch');
  
  // ✅ استخدام useLocale للحصول على اللغة الحالية من next-intl
  const locale = useLocale();
  
  // ✅ استخدام useTranslation للترجمة الديناميكية عبر API
  const { language, setLanguage, translate } = useTranslation();
  
  // ✅ اللغة الحالية من next-intl
  const currentLang = locale || 'ar';
  const layoutDirection = currentLang === 'ar' ? 'ltr' : 'rtl';

  const router = useRouter();

  const getUserId = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed._id || parsed.id || parsed.userId || '6a146c641fd49d5aecdec751';
      }
    } catch (e) {
      console.warn('Could not parse userData from localStorage', e);
    }
    return '6a146c641fd49d5aecdec751';
  };

  // ===== جلب الترندات من الـ API =====
  useEffect(() => {
    const fetchTrending = async () => {
      setTrendingLoading(true);
      try {
        const userId = getUserId();
        const apiUrl = `https://bo-chat.space/api/smart_search/trend?userid=${userId}&perid=day`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch trending: ${response.status}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          const filteredData = data
            .filter((item: any) => item.keyword && item.keyword.trim() !== '' && item.keyword !== 'null')
            .map((item: any) => ({ keyword: item.keyword }));
          setTrendingData(filteredData);
        } else {
          setTrendingData([]);
        }
      } catch (error) {
        console.error('Error fetching trending:', error);
        setTrendingData([]);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // ===== جلب الاقتراحات من الـ API =====
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setSuggestionsLoading(true);
      try {
        const userId = getUserId();
        const apiUrl = `https://bo-chat.space/api/smart_search/suggestions?userid=${userId}&q=${encodeURIComponent(searchQuery)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch suggestions: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
           const filteredSuggestions = data.data
            .filter((item: any) => item && item.trim() !== '' && item !== 'null' && item !== 'undefined')
            .map((item: any) => {
               if (typeof item === 'object' && item !== null) {
                
                return {
                  id: item._id || item.id || item.userId || '',
                  name: item.name || item.username || item.displayName || '',
                  username: item.username || item.name || '',
                  avatar: item.avatar || item.profileImage || item.image || ''
                };
              }
               return {
                id: '',
                name: item,
                username: item,
                avatar: ''
              };
            })
            .slice(0, 5);
          setSuggestions(filteredSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ===== متابعة حالة تسجيل الدخول =====
  useEffect(() => {
    const updateStates = () => {
      const userData = localStorage.getItem('userData');
      setIsLoggedIn(!!userData);
    };
    updateStates();
    window.addEventListener('userDataUpdated', updateStates);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'userData') updateStates();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('userDataUpdated', updateStates);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // ===== دوال الترجمة والخروج =====
  // const handleToggleLanguage = () => {
  //   const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    
  //   if (typeof setLanguage === 'function') {
  //     setLanguage(nextLang);
  //   }
    
  //   localStorage.setItem('siteLanguage', nextLang);
    
  //   // إعادة تحميل الصفحة لتحديث next-intl
  //   window.location.reload();
  // };
  // ===== دوال الترجمة والخروج =====
const handleToggleLanguage = () => {
  const nextLang = currentLang === 'ar' ? 'en' : 'ar';
  
  // تغيير اللغة في TranslationContext
  if (typeof setLanguage === 'function') {
    setLanguage(nextLang);
  }
  
  // ✅ حفظ اللغة في localStorage
  localStorage.setItem('siteLanguage', nextLang);
  
  // ✅ حفظ اللغة في Cookie (لكي يقرأها next-intl)
  document.cookie = `NEXT_LOCALE=${nextLang}; path=/; max-age=31536000`;
  
  // إعادة تحميل الصفحة لتحديث next-intl
  window.location.reload();
};

  const confirmLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('userDataUpdated'));
    router.push('/login');
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  // ===== تسوية النتائج =====
  const flatResults = useMemo(
    () =>
      Object.entries(results).flatMap(([key, arr]) =>
        arr.map((r) => ({ section: key, ...r }))
      ),
    [results]
  );

  // ===== البحث =====
  useEffect(() => {
    if (!debounced.trim()) {
      setResults({});
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const sections: Record<string, SearchResult[]> = {};
      await Promise.all(
        providers.map(async (p) => {
          try {
            const out = await p.search(debounced);
            if (!cancelled) sections[p.label] = out.slice(0, 5);
          } catch (e) {
            if (!cancelled)
              sections[p.label] = [
                { id: `${p.key}-err`, title: 'Error loading', subtitle: String(e) },
              ];
          }
        })
      );
      if (!cancelled) {
        setResults(sections);
        setOpen(true);
        setActiveIndex(-1);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, providers]);

  // ===== إغلاق القائمة عند النقر خارجها =====
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowAllTrending(false);
        setIsExpanding(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // ===== التنقل بالكيبورد =====
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter') {
      const r = flatResults[activeIndex];
      if (r?.href) {
        e.preventDefault();
        router.push(r.href);
        setOpen(false);
      }
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setShowAllTrending(false);
      setIsExpanding(false);
    }
  };

  // ===== دوال إدارة سجل البحث =====
  const deleteSearchHistoryItem = async (keyword: string) => {
    try {
      const userId = getUserId();
      const apiUrl = 'https://bo-chat.space/api/delete_search_history';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userId,
          keyword: keyword
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete search history: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setTrendingData(prevData => 
          prevData.filter(item => item.keyword !== keyword)
        );
      } else {
        throw new Error(data.message || 'Failed to delete search history');
      }
      
    } catch (error) {
      console.error('Error deleting search history:', error);
      setTrendingData(prevData => 
        prevData.filter(item => item.keyword !== keyword)
      );
    }
  };

  const deleteAllSearchHistory = async () => {
    try {
      const userId = getUserId();
      const apiUrl = 'https://bo-chat.space/api/delete_search_history';
      
      const deletePromises = trendingData.map(item => 
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: userId,
            keyword: item.keyword
          }),
        })
      );

      await Promise.all(deletePromises);
      setTrendingData([]);
    } catch (error) {
      console.error('Error deleting all search history:', error);
      setTrendingData([]);
    }
  };

  const navigateToSearch = (term: string) => {
    setOpen(false);
    setSearchQuery(term);
    window.location.href = `/search?q=${encodeURIComponent(term)}`;
  };

  const navigateToProfile = (userId: string) => {
    setOpen(false);
    if (userId) {
      window.location.href = `/profile/${userId}`;
    }
  };

  const handleSearchHistoryClick = (term: string) => {
    navigateToSearch(term);
  };

  const handleSuggestionClick = (suggestion: {id: string, name: string, username?: string, avatar?: string}) => {
    const userId = suggestion.id || suggestion.username || suggestion.name;
    navigateToProfile(userId);
  };

  const handleFocus = () => {
    if (!searchQuery.trim()) {
      setOpen(true);
    }
  };

  const ITEMS_TO_SHOW = 5;
  
  const getDisplayedTrending = () => {
    if (showAllTrending) {
      return trendingData;
    }
    return trendingData.slice(0, ITEMS_TO_SHOW);
  };

  const removeTrendingItem = (keyword: string) => {
    deleteSearchHistoryItem(keyword);
  };

  const handleClearHistory = () => {
    deleteAllSearchHistory();
  };

  const handleShowMore = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setShowAllTrending(true);
      setIsExpanding(false);
    }, 300);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-yellow-100 text-yellow-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-teal-100 text-teal-600',
      'bg-orange-100 text-orange-600',
      'bg-cyan-100 text-cyan-600'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className={cn('w-full px-[30px] py-[15px]')} dir={layoutDirection}>
      <div className="flex items-center justify-between w-full gap-3">
        <Link href="/">
          <img src="/logo-red.png" width={35} alt="logo" />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleLanguage}
            title={currentLang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            className="w-[80px] h-[60px] rounded-[27px] bg-[#F2F2F2] flex flex-col items-center justify-center cursor-pointer border-0 gap-0.5 hover:bg-neutral-200/80 transition shrink-0"
          >
            <TranslateIcon />
            <span className="text-[10px] font-bold text-neutral-600 uppercase">
              {currentLang === 'ar' ? 'EN' : 'AR'}
            </span>
          </button>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              title={currentLang === 'en' ? 'Logout' : 'تسجيل الخروج'}
              className="w-[80px] h-[60px] rounded-[27px] bg-[#F2F2F2] flex items-center justify-center cursor-pointer border-0 hover:bg-neutral-200/80 transition shrink-0"
            >
              <LogoutIcon />
            </button>
          )}

          <div className="relative z-[9998]" ref={panelRef}>
            <div className="flex items-center gap-2 bg-[#F2F2F2] rounded-t-[27px] rounded-b-none px-4 h-[60px] w-[446px]">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={handleFocus}
                placeholder={placeholder || t('search_placeholder')}
                className="bg-transparent outline-none w-full text-[15px] placeholder:text-[#C5C6C6]"
                autoComplete="off"
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                style={{ textAlign: currentLang === 'ar' ? 'right' : 'left' }}
              />
              <Magnifier />
            </div>

            {open && (
              <div className="absolute top-full left-0 z-50 w-[446px] rounded-b-[27px] bg-[#F2F2F2] shadow-2xl overflow-hidden">
                {!searchQuery.trim() && (
                  <div>
                    <div className="flex items-center justify-between px-4 py-3">
                      {trendingData.length > 0 && (
                        <button
                          onClick={handleClearHistory}
                          className="text-xs text-red-500 hover:text-red-600 transition bg-transparent border-0 cursor-pointer"
                          style={{
                            fontFamily: 'Cairo',
                            fontWeight: 600,
                            fontSize: '12px',
                            lineHeight: '100%',
                            color: '#D72229',
                            textAlign: 'right',
                            verticalAlign: 'middle'
                          }}
                        >
                          {t('clear_all')}
                        </button>
                      )}
                      <span 
                        className="text-sm font-medium text-neutral-700"
                        style={{
                          fontFamily: 'Cairo',
                          fontWeight: 600,
                          fontSize: '16px',
                          lineHeight: '100%',
                          color: '#000000',
                          textAlign: 'right',
                          verticalAlign: 'middle'
                        }}
                      >
                        {t('recent_searches')}
                      </span>
                    </div>

                    {trendingLoading ? (
                      <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                        {t('loading')}
                      </div>
                    ) : trendingData.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                        {t('no_recent_searches')}
                      </div>
                    ) : (
                      <>
                        <div 
                          className={cn(
                            "relative overflow-y-auto transition-all duration-300 ease-in-out",
                            isExpanding && "scale-95 opacity-50",
                            !showAllTrending ? "max-h-[200px]" : "max-h-[600px]"
                          )}
                        >
                          <ul>
                            {getDisplayedTrending().map((item, index) => (
                              <li
                                key={index}
                                className="group flex items-center justify-between px-4 py-1 hover:bg-neutral-100 transition relative"
                              >
                                <button
                                  onClick={() => handleSearchHistoryClick(item.keyword)}
                                  className="flex-1 text-start flex items-center gap-3 bg-transparent border-0 cursor-pointer"
                                >
                                  <Magnifier />
                                  <span className="text-sm text-neutral-700">{item.keyword}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeTrendingItem(item.keyword);
                                  }}
                                  className="bg-transparent border-0 cursor-pointer flex items-center justify-center hover:opacity-70 transition-opacity"
                                  aria-label="Delete search"
                                  style={{
                                    width: '12px',
                                    height: '12px',
                                    padding: 0,
                                    margin: 0
                                  }}
                                >
                                  <DeleteIcon />
                                </button>
                                {index < getDisplayedTrending().length - 1 && (
                                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[398px] h-px border-t border-[#DADADA]"></span>
                                )}
                              </li>
                            ))}
                          </ul>
                          
                          {trendingData.length > ITEMS_TO_SHOW && !showAllTrending && (
                            <div 
                              className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                              style={{
                                background: 'linear-gradient(to top, #F2F2F2 0%, transparent 100%)'
                              }}
                            />
                          )}
                        </div>
                        
                        {trendingData.length > ITEMS_TO_SHOW && !showAllTrending && (
                          <div className="px-4 py-3">
                            <button
                              onClick={handleShowMore}
                              disabled={isExpanding}
                              className={cn(
                                "w-full text-center text-sm text-red-500 hover:text-red-600 transition font-medium border-0 bg-transparent cursor-pointer",
                                isExpanding && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {isExpanding ? (
                                <span className="inline-flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  {t('loading')}
                                </span>
                              ) : (
                                t('view_more')
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    <div className="px-4 py-3 border-t border-[#DADADA]">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <span className="font-[Cairo] font-semibold text-[16px] leading-none tracking-[0] text-right text-[#D72229]">
                          {t('you_might_like')}
                        </span>
                        <img
                          src="/imgs/arrow.svg"
                          alt="icon"
                          className="w-[15px] h-[7px]"
                        />
                      </div>
                      {suggestionsLoading ? (
                        <div className="text-sm text-neutral-500 text-center py-2">
                          {t('loading_suggestions')}
                        </div>
                      ) : suggestions.length === 0 ? (
                        <div className="text-sm text-neutral-500 text-center py-2">
                          {t('no_suggestions')}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {suggestions.map((suggestion, idx) => (
                            <div key={idx}>
                              <button
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="flex items-center gap-3 px-3 py-2 text-sm bg-transparent hover:bg-neutral-100 text-neutral-700 transition w-full text-start border-0 cursor-pointer rounded-full"
                              >
                                {suggestion.avatar ? (
                                  <img 
                                    src={suggestion.avatar} 
                                    alt={suggestion.name}
                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                  />
                                ) : (
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${getRandomColor(suggestion.name)}`}>
                                    {suggestion.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="font-medium">{suggestion.name}</span>
                                {suggestion.username && suggestion.username !== suggestion.name && (
                                  <span className="text-xs text-neutral-400">@{suggestion.username}</span>
                                )}
                              </button>
                              {idx < suggestions.length - 1 && (
                                <div className="w-full px-3">
                                  <span className="block w-full h-px border-t border-[#DADADA]"></span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {searchQuery.trim() && (
                  <>
                    {loading && (
                      <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                        {t('searching')}
                      </div>
                    )}
                    {!loading && Object.keys(results).length === 0 && suggestions.length === 0 && (
                      <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                        {t('no_results')}
                      </div>
                    )}
                    
                    {suggestions.length > 0 && (
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <span className="font-[Cairo] font-semibold text-[16px] leading-none tracking-[0] text-right text-[#D72229]">
                            {t('you_might_like')}
                          </span>
                          <img
                            src="/imgs/arrow.svg"
                            alt="icon"
                            className="w-[15px] h-[7px]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          {suggestions.map((suggestion, idx) => (
                            <div key={idx}>
                              <button
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="flex items-center gap-3 px-3 py-2 text-sm bg-transparent hover:bg-neutral-100 text-neutral-700 transition w-full text-start border-0 cursor-pointer"
                              >
                                <div className="w-2 h-2 rounded border border-[#878787] shrink-0"></div>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">
                                    {suggestion.name}
                                  </span>
                                  {suggestion.username && suggestion.username !== suggestion.name && (
                                    <span className="text-xs text-neutral-400">
                                      @{suggestion.username}
                                    </span>
                                  )}
                                </div>
                              </button>
                              {idx < suggestions.length - 1 && (
                                <div className="w-full px-3">
                                  <span className="block w-full h-px border-t border-[#DADADA]"></span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!loading &&
                      Object.entries(results).map(([label, items]) => (
                        <div key={label}>
                          <div className="px-4 pt-4 pb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                            {label}
                          </div>
                          <ul className="max-h-[52vh] overflow-y-auto">
                            {items.map((r) => {
                              const flatIndex = Object.entries(results)
                                .flatMap(([, arr]) => arr)
                                .indexOf(r);
                              const isActive = activeIndex === flatIndex;
                              return (
                                <li 
                                  key={r.id} 
                                  onMouseEnter={() => setActiveIndex(flatIndex)}
                                  className="border-b border-[#DADADA] last:border-b-0"
                                >
                                  <button
                                    className={cn(
                                      'w-full text-start border-0 bg-transparent py-3 px-4 transition flex items-center gap-3 cursor-pointer',
                                      isActive && 'bg-neutral-100'
                                    )}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (r.href) {
                                        window.location.href = r.href;
                                        setOpen(false);
                                      }
                                    }}
                                  >
                                    <div className="text-red-600 shrink-0">
                                      {r.icon ?? <Magnifier />}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-sm font-medium truncate text-neutral-800">
                                        {r.title}
                                      </div>
                                      {r.subtitle && (
                                        <div className="text-xs text-neutral-500 truncate">
                                          {r.subtitle}
                                        </div>
                                      )}
                                    </div>
                                    {r.meta && (
                                      <div className="ms-auto text-[11px] text-neutral-500 shrink-0">
                                        {r.meta}
                                      </div>
                                    )}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                  </>
                )}

                {searchQuery.trim() && Object.keys(results).length > 0 && (
                  <div className="px-4 py-3 border-t border-[#DADADA]">
                    <button
                      onClick={() => {
                        console.log('Show more results');
                      }}
                      className="w-full text-center text-sm text-red-500 hover:text-red-600 transition font-medium border-0 bg-transparent cursor-pointer"
                    >
                      {t('view_more_results')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {showLogoutDialog && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl text-center">
                <h3 className="text-lg font-bold text-neutral-800 mb-2">
                  {t('confirm_logout')}
                </h3>
                <p className="text-sm text-neutral-600 mb-6">
                  {t('logout_confirm_message')}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelLogout}
                    className="flex-1 py-2 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition border-0 cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition border-0 cursor-pointer"
                  >
                    {t('logout')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}   