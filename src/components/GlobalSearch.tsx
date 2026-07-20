// src/components/GlobalSearch.tsx
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SearchResult } from '@/types/search-result';
import { SearchProvider } from '@/types/search-provider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { useSearchStore } from '@/store/searchStore'; // تأكد من وجود هذا الملف

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
  <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
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
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#555" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
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
  // ===== الحالة من المخزن =====
  const { searchQuery, setSearchQuery } = useSearchStore();

  // ===== حالات المكون =====
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [results, setResults] = useState<Record<string, SearchResult[]>>({});
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const debounced = useDebounced(searchQuery, 200);
  const panelRef = useRef<HTMLDivElement>(null);

  const { language, setLanguage } = useTranslation();
  const currentLang = language || 'ar';
  const layoutDirection = currentLang === 'ar' ? 'ltr' : 'rtl';

  const router = useRouter();

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

    const interval = setInterval(() => {
      const userData = localStorage.getItem('userData');
      const newLoggedIn = !!userData;
      setIsLoggedIn((prev) => (prev !== newLoggedIn ? newLoggedIn : prev));
    }, 1000);

    return () => {
      window.removeEventListener('userDataUpdated', updateStates);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // ===== دوال الترجمة والخروج =====
  const handleToggleLanguage = () => {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    if (typeof setLanguage === 'function') {
      setLanguage(nextLang);
    }
    localStorage.setItem('siteLanguage', nextLang);
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

  // ===== البحث باستخدام providers فقط (بدون مزود الفيديو) =====
  useEffect(() => {
    if (!debounced.trim()) {
      setResults({});
      setOpen(false);
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
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
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
    if (e.key === 'Escape') setOpen(false);
  };

  // ===== العرض =====
  return (
    <div className={cn('w-full px-[30px] py-[15px]')} dir={layoutDirection}>
      <div className="flex items-center justify-between w-full gap-3">
        {/* الشعار */}
        <Link href="/">
          <img src="/logo-red.png" width={35} alt="logo" />
        </Link>

        {/* مجموعة الأزرار والبحث */}
        <div className="flex items-center gap-3">
          {/* زر الترجمة */}
          <button
            onClick={handleToggleLanguage}
            title={currentLang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            className="w-[80px] h-[60px] rounded-[27px] bg-[#F2F2F2] flex flex-col items-center justify-center cursor-pointer border-0 gap-0.5 hover:bg-neutral-200/80 transition"
          >
            <TranslateIcon />
            <span className="text-[10px] font-bold text-neutral-600 uppercase">
              {currentLang === 'ar' ? 'EN' : 'AR'}
            </span>
          </button>

          {/* زر تسجيل الخروج (إذا كان مسجلاً) */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              title={currentLang === 'en' ? 'Logout' : 'تسجيل الخروج'}
              className="w-[80px] h-[60px] rounded-[27px] bg-[#F2F2F2] flex items-center justify-center cursor-pointer border-0 hover:bg-neutral-200/80 transition"
            >
              <LogoutIcon />
            </button>
          )}

          {/* شريط البحث */}
          <div className="relative z-[9998]" ref={panelRef}>
            <div className="flex items-center gap-2 bg-[#F2F2F2] rounded-[20px] px-4 h-[50px] w-[23vw] max-w-[500px]">
              <Magnifier />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder || (currentLang === 'en' ? 'Search here...' : 'اكتب ما تبحث عنه هنا')}
                className="bg-transparent outline-none w-full text-[15px] placeholder:text-[#C5C6C6]"
                autoComplete="off"
                dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                style={{ textAlign: currentLang === 'ar' ? 'right' : 'left' }}
              />
            </div>

            {/* قائمة النتائج (للمزودات الأخرى فقط) */}
            {open && (
              <div className="absolute mt-2 end-0 z-50 w-[62vw] max-w-[760px] rounded-2xl border border-neutral-200/60 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
                {loading && (
                  <div className="px-4 py-3 text-sm text-neutral-500">
                    {currentLang === 'en' ? 'Searching...' : 'جاري البحث…'}
                  </div>
                )}
                {!loading && Object.keys(results).length === 0 && (
                  <div className="px-4 py-3 text-sm text-neutral-500">
                    {currentLang === 'en' ? 'No results found' : 'لا توجد نتائج'}
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
                            .flatMap(([k, arr]) => arr.map((_, i) => ({ k, i })))
                            .slice(
                              0,
                              Object.entries(results)
                                .flatMap(([, arr]) => arr)
                                .indexOf(r) + 1
                            ).length - 1;
                          const isActive = activeIndex === flatIndex;
                          const ItemContent = (
                            <div
                              className={cn(
                                'px-4 py-3 flex items-center gap-3',
                                isActive && 'bg-red-50/80 dark:bg-red-900/20'
                              )}
                            >
                              <div className="text-red-600">
                                {r.icon ?? <Magnifier />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {r.title}
                                </div>
                                {r.subtitle && (
                                  <div className="text-xs text-neutral-500 truncate">
                                    {r.subtitle}
                                  </div>
                                )}
                              </div>
                              {r.meta && (
                                <div className="ms-auto text-[11px] text-neutral-500">
                                  {r.meta}
                                </div>
                              )}
                            </div>
                          );
                          return (
                            <li key={r.id} onMouseEnter={() => setActiveIndex(flatIndex)}>
                              {r.href ? (
                                <button
                                  className="block w-full text-start border-0 bg-transparent p-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (r.href) {
                                      router.push(r.href);
                                      setOpen(false);
                                    }
                                  }}
                                >
                                  {ItemContent}
                                </button>
                              ) : (
                                <button className="w-full text-start border-0 bg-transparent p-0">
                                  {ItemContent}
                                </button>
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

          {/* حوار تأكيد الخروج */}
          {showLogoutDialog && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div
                dir={layoutDirection}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200/60 text-center"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'en' ? 'Confirm Logout' : 'تأكيد تسجيل الخروج'}
                </h3>
                <p className="text-neutral-600 text-sm mb-6">
                  {currentLang === 'en'
                    ? 'Are you sure you want to log out?'
                    : 'هل أنت متأكد من رغبتك في تسجيل الخروج؟'}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={cancelLogout}
                    className="px-4 py-2 rounded-xl bg-[#F2F2F2] text-neutral-700 hover:bg-neutral-200 transition"
                  >
                    {currentLang === 'en' ? 'Cancel' : 'إلغاء'}
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    {currentLang === 'en' ? 'Logout' : 'تسجيل الخروج'}
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