/* eslint-disable @next/next/no-img-element */
// app/components/GlobalSearch.tsx
'use client';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Link from 'next/link';
import { SearchResult } from '@/types/search-result';
import { SearchProvider } from '@/types/search-provider';
import { useRouter } from "next/navigation";

export type GlobalSearchProps = {
  providers: SearchProvider[];
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
  className?: string;
};

// ============== Helpers ==================
function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export const Magnifier = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
    <path fill="#C5C6C6" d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-2a8 8 0 0 0 0 16 7.95 7.95 0 0 0 4.9-1.64l4.37 4.38 1.42-1.42-4.38-4.37A7.95 7.95 0 0 0 18 10a8 8 0 0 0-8-8Z"/>
  </svg>
);
// const PlusIcon = () => (
//   <img src="/imgs/add.svg" width={28} alt="" />
// );
// const BotIcon = () => (
//   <img src="/imgs/man-head.svg" width={28} alt="" />
// );
// const UsersLinkIcon = () => (
//   <img src="/imgs/user-pen.svg" width={28} alt="" />
// );
const LogoutIcon=()=>(
  <img src="/imgs/Group (2).svg" alt="Logout Button" width={22} height={22}/>
)

// Debounce hook
function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

// ============= Component =================
export default function Header({ providers, placeholder }: GlobalSearchProps) {

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [results, setResults] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(false);
  const debounced = useDebounced(query, 200);
  const panelRef = useRef<HTMLDivElement>(null);


    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

     const confirmLogout = () => {
    localStorage.clear();
    router.push("/login");
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const flatResults = useMemo(() => Object.entries(results).flatMap(([key, arr]) => arr.map((r) => ({ section: key, ...r }))), [results]);
  const router = useRouter();
 const goToProfile = () => {
  const userData = localStorage.getItem("userData");

  if (!userData) return;

  const user = JSON.parse(userData);

  router.push(`/profile/${user._id}`);
};
// const handleLogout = () => {
//   localStorage.clear();
//   router.push("/login");
// };
 const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  useEffect(() => {
      // console.log("Debounced:", debounced);
    if (!debounced.trim()) { setResults({}); setOpen(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const sections: Record<string, SearchResult[]> = {};
      await Promise.all(providers.map(async (p) => {
        try {
              // console.log("Searching in:", p.label);
          const out = await p.search(debounced);
              // console.log("Results:", out);

          if (!cancelled) sections[p.label] = out.slice(0, 5);
        } catch (e) {
          if (!cancelled) sections[p.label] = [{ id: `${p.key}-err`, title: 'Error loading', subtitle: String(e) }];
        }
      }));
      if (!cancelled) { setResults(sections); setOpen(true); setActiveIndex(-1); }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [debounced, providers]);

  // click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
   if (e.key === 'Enter') {
  const r = flatResults[activeIndex];
  if (r?.href) {
    e.preventDefault();
    router.push(r.href);
    setOpen(false);
  }
}
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className={cn('w-full px-[30px] py-[15px]')}>
      <div className="flex items-center justify-between gap-3">
        {/* Left: Logo */}
         <Link href="/" className="">
          <img src="/logo-red.png" width={35} alt="logo" />
        </Link>
        {/* Right: actions + search */}
        <div className="ml-auto flex items-center gap-3">
          {/* <div className="hidden sm:flex items-center gap-3">
            {[{Icon: PlusIcon, title: 'New'}, {Icon: BotIcon, title: 'Assistant'}, {Icon: UsersLinkIcon, title: 'Share'}].map(({Icon, title}, i) => (
              <button key={i} title={title} className="w-[80px] h-[50px] rounded-[20px] bg-[#F2F2F2] text-red-600 flex items-center justify-center shadow-sm hover:shadow transition shadow-neutral-200/40">
                <Icon />
              </button>
            ))}
             
          </div> */}
              <button
    onClick={handleLogout}
    title="تسجيل الخروج"
    className="
    w-[80px]
    h-[60px]
    rounded-[27px]
    bg-[#F2F2F2]
    flex
    items-center
    justify-center
    cursor-pointer
    border-0
  "
  >
    <LogoutIcon />

  </button>

          {/* Search */}
          <div className="relative z-[9998]" ref={panelRef} dir='rtl'>
               <div className="flex items-center gap-2 bg-[#F2F2F2] rounded-[20px] px-4 h-[50px] w-[23vw] max-w-[500px]">
              <Magnifier />
              <input
                value={query}
                // onChange={(e) => setQuery(e.target.value)}
                onChange={(e) => {
                // console.log("Typing:", e.target.value);
                setQuery(e.target.value);
              }}
                onKeyDown={onKeyDown}
                placeholder={placeholder || 'اكتب ما تبحث عنه هنا'}
                className="bg-transparent outline-none w-full  text-[15px] placeholder:text-[#C5C6C6]"
                autoComplete="off"
              />
            </div>

            {/* Results panel */}
            {open && (
              <div className="absolute mt-2 right-0 z-50 w-[62vw] max-w-[760px] rounded-2xl border border-neutral-200/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
                {loading && (
                  <div className="px-4 py-3 text-sm text-neutral-500">جاري البحث…</div>
                )}
                {!loading && Object.keys(results).length === 0 && (
                  <div className="px-4 py-3 text-sm text-neutral-500">لا توجد نتائج</div>
                )}

                {!loading && Object.entries(results).map(([label, items]) => (
                  <div key={label}>
                    <div className="px-4 pt-4 pb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</div>
                    <ul className="max-h-[52vh] overflow-y-auto">
                      {items.map((r) => {
                        const flatIndex = Object.entries(results)
                          .flatMap(([k, arr]) => k === label ? arr.map((_, i) => ({ k, i })) : arr.map((_, i) => ({ k, i })))
                          .slice(0, Object.entries(results).flatMap(([, arr]) => arr).indexOf(r) + 1).length - 1;
                        const isActive = activeIndex === flatIndex;
                        const ItemContent = (
                          <div className={cn('px-4 py-3 flex items-center gap-3', isActive && 'bg-red-50/80 dark:bg-red-900/20')}> 
                            <div className="text-red-600">
                              {r.icon ?? <Magnifier />}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{r.title}</div>
                              {r.subtitle && <div className="text-xs text-neutral-500 truncate">{r.subtitle}</div>}
                            </div>
                            {r.meta && <div className="ms-auto text-[11px] text-neutral-500">{r.meta}</div>}
                          </div>
                        );
                        return (
                          <li key={r.id} onMouseEnter={() => setActiveIndex(flatIndex)}>
                            {r.href ? (
                              // <Link href={r.href} className="block">{ItemContent}</Link>
                              <Link
  href={r.href}
  className="block"
  onClick={(e) => {
    e.preventDefault();          // منع السلوك الافتراضي للرابط
    if (r.href) {
      router.push(r.href);       // التنقل إلى البروفايل
      setOpen(false);            // إغلاق القائمة بعد النقر
    }
  }}
>
  {ItemContent}
</Link>
                            ) : (
                              <button className="w-full text-start">{ItemContent}</button>
                            )}
                          </li>

                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showLogoutDialog && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div 
      dir="rtl" 
      className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200/60 text-center"  // <--- أضفنا text-center هنا
    >
      <h3 className="text-lg font-semibold mb-2">تأكيد تسجيل الخروج</h3>
      <p className="text-neutral-600 text-sm mb-6">هل أنت متأكد من رغبتك في تسجيل الخروج؟</p>
      
      {/* الأزرار تبقى في المنتصف بفضل justify-center */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={cancelLogout}
          className="px-4 py-2 rounded-xl bg-[#F2F2F2] text-neutral-700 hover:bg-neutral-200 transition"
        >
          إلغاء
        </button>
        <button
          onClick={confirmLogout}
          className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
        >
          تسجيل الخروج
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