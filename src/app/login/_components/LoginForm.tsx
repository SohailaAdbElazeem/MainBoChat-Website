// /* eslint-disable @next/next/no-img-element */
// 'use client';

// import { useEffect, useState } from 'react';
// import Script from 'next/script';
// import SignupModal from './SignupModal';

// type Lang = 'ar' | 'en';

// declare global {
//   interface Window {
//     google?: any;
//   }
// }

// const API_BASE = 'http://bo-chat.space'; // عدّلها لو هتستخدم دومين تاني

// export default function LoginForm() {
//   const [lang, setLang] = useState<Lang>('ar');
//   const [showPass, setShowPass] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string>('');

//   // ============ Google Sign-In ============
// // دالة جوجل — استبدل القديمة
// const handleGoogleCredential = async (response: any) => {
//   const tokenId = response?.credential as string; // ده ال-ID Token من جوجل
//   if (!tokenId) {
//     setError('تعذّر استلام رمز جوجل.');
//     return;
//   }
//   try {
//     setIsLoading(true);
//     setError('');

//     // استخدم مسار نسبي /viaGoogle لو عامل rewrite في next.config.ts
//     const res = await fetch('/viaGoogle', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       // السيرفر مستني idToken بالضبط (case-sensitive)
//       body: JSON.stringify({ idToken: tokenId }),
//       // لو السيرفر بيرجع كوكي جلسة وعايز تستخدمه من المتصفح:
//       // credentials: 'include',
//     });

//     if (!res.ok) {
//       const text = await res.text().catch(() => '');
//       console.error('viaGoogle error:', res.status, text);
//       setError(`Google login failed (${res.status})`);
//       return;
//     }

//     const data = await res.json().catch(() => ({}));
//     console.log('Google login success:', data);
//     // مثال: localStorage.setItem('token', data.token);
//     // window.location.href = '/dashboard';
//   } catch (e) {
//     console.error('Google login error:', e);
//     setError('حدث خطأ أثناء تسجيل الدخول بجوجل');
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const initGoogle = () => {
//     if (!window.google) return;
//     window.google.accounts.id.initialize({
//       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//       callback: handleGoogleCredential,
//       ux_mode: 'popup', // popup أو redirect
//       locale: lang === 'ar' ? 'ar' : 'en',
//     });

//     // يرسم زر جوجل الرسمي داخل العنصر #google-btn
//     window.google.accounts.id.renderButton(
//       document.getElementById('google-btn'),
//       {
//         theme: 'filled_black', // outline / filled_black
//         size: 'large',         // small | medium | large
//         shape: 'pill',         // pill | rectangular | circle
//         text: lang === 'ar' ? 'signin_with' : 'signin_with',
//         width: 220,
//       }
//     );

//     // اختياري: تفعيل One Tap
//     window.google.accounts.id.prompt();
//   };
//   // ============ End Google ===============

//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     const formData = new FormData(e.currentTarget);
//     const email = formData.get('identifier') as string;
//     const password = formData.get('password') as string;

//     try {
//       const response = await fetch(`${API_BASE}/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Login successful:', data);
//         // مثال: localStorage.setItem('token', data.token);
//         // مثال: window.location.href = '/dashboard';
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         setError(errorData.message || 'فشل تسجيل الدخول');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('حدث خطأ في الاتصال');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full grid place-items-center overflow-hidden" dir="rtl">
//       {/* GIS Script */}
//       <Script src="https://accounts.google.com/gsi/client" async defer onLoad={initGoogle} />

//       <div
//         className="pointer-events-none absolute inset-0 opacity-40"
//         style={{
//           background:
//             'radial-gradient(55rem 30rem at 99% -20%, #8b0000, transparent), radial-gradient(50rem 25rem at 65% -20%, #32397fff, transparent),radial-gradient(20rem 20rem at 90% 110%, #8b0000, transparent), radial-gradient(30rem 60rem at 30% 180%, #32397fff, transparent)',
//         }}
//       />

//       <div className="w-[250px] absolute top-10">
//         <div className="">
//           <label htmlFor="lang" className="sr-only">اختر لغة</label>
//           <select
//             id="lang"
//             value={lang}
//             onChange={(e) => setLang(e.target.value as Lang)}
//             className="w-full appearance-none rounded-[50px] border border-white/50 bg-[#0f0f1a] text-[#D72229] py-2 pr-10 outline-none focus:border-white/20"
//           >
//             <option value="ar">اختر لغة</option>
//             <option value="ar">العربية</option>
//             <option value="en">English</option>
//           </select>
//           <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#D72229]">v</span>
//         </div>
//       </div>

//       <div className="relative z-10 rounded-2xl p-6 sm:p-8 backdrop-blur">
//         <form onSubmit={onSubmit} className="space-y-3">
//           {error && (
//             <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="mb-2 block text-sm text-white/80">
//               اكتب هنا الايميل أو رقم الموبايل
//             </label>
//             <input
//               required
//               name="identifier"
//               type="text"
//               placeholder=""
//               disabled={isLoading}
//               className="w-[500px] rounded-[20px] bg-[#5977FC]/5 px-4 py-5 text-white outline-none border border-white/10 focus:border-white/20 placeholder:text-white/40 disabled:opacity-50"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm text-white/80">كلمة المرور</label>
//             <div className="relative">
//               <input
//                 required
//                 name="password"
//                 type={showPass ? 'text' : 'password'}
//                 disabled={isLoading}
//                 className="w-full rounded-[20px] bg-[#5977FC]/5 px-4 py-5 text-white outline-none border border-white/10 focus:border-white/20 placeholder:text-white/40 disabled:opacity-50"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPass((s) => !s)}
//                 aria-label="toggle password visibility"
//                 disabled={isLoading}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 disabled:opacity-50"
//               >
//                 {showPass ? '🙈' : '👁️'}
//               </button>
//             </div>

//             <div className="mt-2 text-right text-sm">
//               <a href="#" className="text-red-400 hover:text-red-300">
//                 هل نسيت كلمة السر؟
//               </a>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="mt-2 w-full rounded-[20px] bg-red-600 hover:bg-red-500 transition-colors py-5 text-white text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
//           </button>

//           <p className="text-center text-xs text-white/60 leading-6">
//             بالتسجيل فإنك توافق على{' '}
//             <a href="#" className="text-red-400 hover:text-red-300 text-[16px]">معايير المجتمع</a>{' '}
//             و{' '}
//             <a href="#" className="text-red-400 hover:text-red-300 text-[16px]">شروط وأحكام معايير المجتمع</a>
//           </p>

//           <div className="flex items-center gap-3 my-2">
//             <span className="h-px flex-1 bg-white/10" />
//             <span className="text-white/60 text-sm">أو تسجيل الدخول بـ</span>
//             <span className="h-px flex-1 bg-white/10" />
//           </div>

//           <div className="flex items-center justify-between gap-4">
//           <div className="bg-white px-[55px] py-[13px] rounded-[20px] overflow-hidden h-[65px] flex items-center justify-center">
//               <img src="/imgs/google.png" width={"40px"} alt="" />
//           </div>
//             {/* placeholders للباقي (تقدر تبدّلهم لاحقًا بواقعى) */}
//             <div className="bg-white px-[55px] py-[13px] rounded-[20px] h-[65px] flex items-center justify-center">
//               <img src="/imgs/apple.png" width={"45px"} alt="" />
//             </div>
//             <div className="bg-white px-[55px] py-[13px] rounded-[20px] h-[65px] flex items-center justify-center">
//               <img src="/imgs/facebook.png" width={"45px"} alt="" />
//             </div>
//           </div>

//           <p className="text-center text-sm text-white/70 mt-4">
//             ليس لدي حساب؟{' '}
//             <button onClick={() => setOpen(true)} className="text-red-400 hover:text-red-300">
//               إنشاء حساب
//             </button>
//           </p>
//         </form>
//       </div>

//       <SignupModal open={open} onClose={() => setOpen(false)} />
//     </div>
//   );
// }

// function SocialButton({
//   children,
//   label,
// }: {
//   children: React.ReactNode;
//   label: string;
// }) {
//   return (
//     <button
//       type="button"
//       aria-label={label}
//       className="w-20 h-14 rounded-2xl bg-[#0f0f1a] border border-white/10 hover:border-white/20 grid place-items-center text-white transition-colors"
//     >
//       {children}
//     </button>
//   );
// }


/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import SignupModal from './SignupModal';

type Lang = 'ar' | 'en';

declare global {
  interface Window {
    google?: any;
  }
}

const API_BASE = 'http://bo-chat.space';

export default function LoginForm() {
  const [lang, setLang] = useState<Lang>('ar');
  const [showPass, setShowPass] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // ================= TOKEN HELPER =================
  const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleCredential = async (response: any) => {
    const tokenId = response?.credential;

    if (!tokenId) {
      setError('تعذّر استلام رمز جوجل.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const res = await fetch('/viaGoogle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: tokenId }),
      });

      if (!res.ok) {
        setError(`Google login failed (${res.status})`);
        return;
      }

      const data = await res.json();

      if (data?.token) {
        setToken(data.token); // ✅ أهم خطوة
        window.location.href = '/';
      }
    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء تسجيل الدخول بجوجل');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= INIT GOOGLE =================
  const initGoogle = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleGoogleCredential,
      ux_mode: 'popup',
      locale: lang === 'ar' ? 'ar' : 'en',
    });

    const btn = document.getElementById('google-btn');

    if (btn) {
      window.google.accounts.id.renderButton(btn, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        width: 220,
      });
    }

    window.google.accounts.id.prompt();
  };

  // ================= LOGIN =================
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
         const data = await response.json();

  console.log('Login successful:', data);

  localStorage.setItem('token', data.token); // ✅ مهم جدًا

  window.location.href = '/';
      } else {
        setError(data.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen w-full grid place-items-center overflow-hidden" dir="rtl">

      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={initGoogle}
      />

      {/* background */}
      <div className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(55rem 30rem at 99% -20%, #8b0000, transparent), radial-gradient(50rem 25rem at 65% -20%, #32397fff, transparent)'
        }}
      />

      {/* FORM */}
      <div className="relative z-10 rounded-2xl p-6 sm:p-8 backdrop-blur">

        <form onSubmit={onSubmit} className="space-y-3">

          {error && (
            <div className="p-3 rounded bg-red-500/10 text-red-400">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <input
            name="identifier"
            placeholder="الايميل أو رقم الهاتف"
            className="w-[500px] rounded-xl px-4 py-4 bg-[#111] text-white"
            required
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              className="w-full rounded-xl px-4 py-4 bg-[#111] text-white"
              required
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-3 text-white"
            >
              👁️
            </button>
          </div>

          {/* BUTTON */}
          <button
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-4 rounded-xl"
          >
            {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>

          {/* GOOGLE BUTTON */}
          <div className="flex justify-center mt-4">
            <div id="google-btn"></div>
          </div>

          {/* SOCIAL ICONS (optional UI only) */}
          <div className="flex gap-4 justify-center mt-4">
            <img src="/imgs/google.png" width={40} />
            <img src="/imgs/apple.png" width={40} />
            <img src="/imgs/facebook.png" width={40} />
          </div>

        </form>
      </div>

      <SignupModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}