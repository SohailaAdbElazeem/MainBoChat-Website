/* eslint-disable @next/next/no-img-element */
// 'use client';

// import Loader from '@/components/Loader';
// import { useEffect, useRef, useState } from 'react';



// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSuccessfulSignup?: (credentials: { emailOrPhone: string; password: string; token: string }) => void;
// };

// // يمكنك ضبطه من env: NEXT_PUBLIC_API_BASE
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://bo-chat.space';

// export default function SignupModal({ open, onClose, onSuccessfulSignup }: Props) {
//   const panelRef = useRef<HTMLDivElement>(null);

//   // حالة النموذج (Controlled)
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     emailOrPhone: '',
//     password: '',
//     confirmPassword: '',
//     terms: false,
//   });
//   const [gender, setGender] = useState<'male' | 'female'>('male');

//   // حالات عامة
//   const [isChecking, setIsChecking] = useState(false); // نستخدمه للّودر
//   const [error, setError] = useState<string | null>(null);

//   // إغلاق بـ Esc
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
//     if (open) document.addEventListener('keydown', onKey);
//     return () => document.removeEventListener('keydown', onKey);
//   }, [open, onClose]);

//   // إعادة ضبط الأخطاء عند الفتح
//   useEffect(() => {
//     if (open) setError(null);
//   }, [open]);

//   if (!open) return null;

//   // أدوات مساعدة
//   const trim = (v: string) => v.replace(/\s+/g, ' ').trim();

//   // صلاحية النموذج: كل المطلوب + تطابق الباسوورد + الموافقة على الشروط
//   const requiredFilled =
//     trim(form.firstName).length > 0 &&
//     trim(form.lastName).length > 0 &&
//     trim(form.username).length > 0 &&
//     trim(form.emailOrPhone).length > 0 &&
//     form.password.length > 0 &&
//     form.confirmPassword.length > 0;

//   const passwordsOk = form.password.length > 0 && form.password === form.confirmPassword;
//   const canSubmit = requiredFilled && passwordsOk && form.terms && !isChecking;

//   // إغلاق عند الضغط على الخلفية
//   const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   // onChange موحد
//   const onChange =
//     (key: keyof typeof form) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
//       setForm((f) => ({ ...f, [key]: typeof val === 'string' ? val : (val as boolean) }));
//     };

//   // إرسال البيانات + التحقق من "data" القادمة من الـ API
//   const submit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!canSubmit) return; // أمان إضافي
//     setIsChecking(true);
//     setError(null);

//     const emailOrPhone = trim(form.emailOrPhone);
//     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     const genderCode = gender === 'male' ? 0 : 1;

//     const userData = {
//       firstName: trim(form.firstName),
//       lastName: trim(form.lastName),
//       username: trim(form.username),
//       emailOrPhone,
//       password: form.password,
//       confirmPassword: form.confirmPassword,
//       gender: genderCode,
//       timeZone,
//       terms: form.terms,
//     };

//     console.log('📤 إرسال بيانات التسجيل:', userData);

//     try {
//       const res = await fetch(`${API_BASE}/newuser`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
//         body: JSON.stringify(userData),
//       });

//       // نقرأ الـ body كنص ثم نحاول JSON (لتغطية كل الحالات)
//       const raw = await res.text().catch(() => '');
//       let payload: any = {};
//       try {
//         payload = raw ? JSON.parse(raw) : {};
//       } catch {
//         // ليس JSON — نترك payload فارغ
//       }

//       // أولاً نطبع الـ Response الخام عشان نشوف إيه اللي راجع
//       console.log('📥 Response من السيرفر:', {
//         status: res.status,
//         statusText: res.statusText,
//         payload,
//         rawResponse: raw
//       });

//       // ✅ فحص صريح لحقل data لو السيرفر بيرجع:
//       // { token: "...", data: "you have an account already" } للحساب الموجود
//       // { token: "...", data: {...} } للحساب الجديد
//       const alreadyByData =
//         typeof payload?.data === 'string' &&
//         /you have an account already/i.test(payload.data);

//       if (alreadyByData) {
//         console.log('❌ الحساب موجود بالفعل!');
//         console.log('📄 Response للحساب الموجود:', payload);
//         setError('هذا الحساب مسجّل بالفعل. جرّب تسجيل الدخول.');
//         setIsChecking(false);
//         return;
//       }

//       // دعم 409 لو السيرفر بيرجعه
//       if (res.status === 409) {
//         console.log('❌ الحساب موجود بالفعل - من HTTP 409');
//         setError('هذا الحساب مسجّل بالفعل. جرّب تسجيل الدخول.');
//         setIsChecking(false);
//         return;
//       }

//       // أخطاء عامة
//       if (!res.ok) {
//         const msg =
//           payload?.message ||
//           payload?.error ||
//           raw ||
//           `HTTP error! status: ${res.status}`;

//         console.log('❌ خطأ من السيرفر:', msg);

//         if (/exist|registered|already|مسجل|موجود/i.test(String(msg))) {
//           setError('هذا الحساب مسجّل بالفعل. جرّب تسجيل الدخول.');
//         } else {
//           setError(String(msg));
//         }
//         setIsChecking(false);
//         return;
//       }

//       // نجاح فعلي: المستخدم جديد (data هيكون object مش string)
//       console.log('✅ تم إنشاء حساب جديد بنجاح!');
//       console.log('📄 Response للحساب الجديد:', payload);
//       console.log('👤 بيانات المستخدم الجديد:', {
//         userId: payload?.data?._id,
//         name: payload?.data?.name,
//         username: payload?.data?.username,
//         email: payload?.data?.useremail,
//         token: payload?.token
//       });

//       if (onSuccessfulSignup && payload?.token) {
//         onSuccessfulSignup({
//           emailOrPhone,
//           password: form.password,
//           token: payload.token,
//         });
//       }
//       onClose();
//       if (!payload?.token) {
//         alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول بالبيانات الجديدة.');
//       }
//     } catch (err) {
//       console.error('💥 خطأ أثناء الاتصال بالسيرفر:', err);
//       const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الحساب';
//       setError(message);
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="signup-title"
//       onMouseDown={handleBackdrop}
//       className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
//     >
//       <div
//         ref={panelRef}
//         className="relative w-full max-w-2xl rounded-3xl bg-white/90 shadow-2xl p-6 sm:p-8 !pt-[100px]"
//         dir="rtl"
//       >
//         {/* Loader Overlay أثناء الـ check */}
//         {isChecking && <Loader/>}

//         {/* لوجو صغير اختياري */}
//         <div className="absolute top-4 left-1/2 -translate-x-1/2">
//           <img src="/logo-red.png" width={50} alt="logo" />
//         </div>

//         {/* رسالة خطأ لطيفة باللون الأحمر */}
//         {error && (
//           <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
//             <svg width="18" height="18" viewBox="0 0 24 24" className="mt-0.5">
//               <path fill="currentColor" d="M11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/><path fill="currentColor" d="M1 21h22L12 2 1 21z"/>
//             </svg>
//             <div>{error}</div>
//           </div>
//         )}

//         {/* تنبيه بسيط لو الباسوورد غير متطابق */}
//         {!error && !passwordsOk && (form.password || form.confirmPassword) ? (
//           <div className="mb-3 rounded-xl border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-700">
//             كلمتا المرور غير متطابقتين
//           </div>
//         ) : null}

//         <form onSubmit={submit} className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1 block text-sm text-neutral-500">الاسم الأول</label>
//               <input
//                 name="firstName"
//                 value={form.firstName}
//                 onChange={onChange('firstName')}
//                 required
//                 disabled={isChecking}
//                 className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm text-neutral-500">الاسم الثاني</label>
//               <input
//                 name="lastName"
//                 value={form.lastName}
//                 onChange={onChange('lastName')}
//                 required
//                 disabled={isChecking}
//                 className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
//               />
//             </div>
//           </div>

//           {/* اسم المستخدم */}
//           <div>
//             <label className="mb-1 block text-sm text-neutral-500">اسم المستخدم</label>
//             <input
//               name="username"
//               value={form.username}
//               onChange={onChange('username')}
//               required
//               disabled={isChecking}
//               className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
//             />
//           </div>

//           {/* الإيميل/الموبايل */}
//           <div>
//             <label className="mb-1 block text-sm text-neutral-500">البريد الإلكتروني أو رقم الهاتف</label>
//             <input
//               name="emailOrPhone"
//               value={form.emailOrPhone}
//               onChange={onChange('emailOrPhone')}
//               required
//               disabled={isChecking}
//               className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
//               type="text"
//               inputMode="email"
//             />
//           </div>

//           {/* كلمة المرور + التأكيد */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1 block text-sm text-neutral-500">كلمة المرور</label>
//               <input
//                 name="password"
//                 value={form.password}
//                 onChange={onChange('password')}
//                 type="password"
//                 required
//                 disabled={isChecking}
//                 className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm text-neutral-500">تأكيد كلمة المرور</label>
//               <input
//                 name="confirmPassword"
//                 value={form.confirmPassword}
//                 onChange={onChange('confirmPassword')}
//                 type="password"
//                 required
//                 disabled={isChecking}
//                 className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
//               />
//             </div>
//           </div>

//           <label className="mb-2 block text-sm text-neutral-500">الجنس</label>
//           <div className="flex items-center justify-between px-[50px]">
//             <div>
//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   disabled={isChecking}
//                   onClick={() => setGender('male')}
//                   className={`rounded-2xl px-7 py-2 transition-colors font-medium disabled:opacity-50 ${
//                     gender === 'male'
//                       ? 'bg-[#B4B4B9] text-white'
//                       : 'bg-neutral-100 text-neutral-800 hover:bg-white-300'
//                   }`}
//                 >
//                   ذكر
//                 </button>
//                 <button
//                   type="button"
//                   disabled={isChecking}
//                   onClick={() => setGender('female')}
//                   className={`rounded-2xl px-7 py-2 transition-colors font-medium disabled:opacity-50 ${
//                     gender === 'female'
//                       ? 'bg-[#B4B4B9] text-white'
//                       : 'bg-neutral-100 text-neutral-800 hover:bg-white-300'
//                   }`}
//                 >
//                   أنثى
//                 </button>
//               </div>
//               <input type="hidden" name="gender" value={gender} />
//             </div>

//             <label className="flex items-center gap-2 text-sm text-neutral-700">
//               <input
//                 type="checkbox"
//                 name="terms"
//                 checked={form.terms}
//                 onChange={onChange('terms')}
//                 required
//                 disabled={isChecking}
//                 className="accent-red-600 disabled:opacity-50"
//               />
//               أوافق على{' '}
//               <a href="#" className="text-red-600 hover:underline">
//                 شروط الاستخدام
//               </a>
//             </label>
//           </div>

//           {/* زر الإنشاء — مُعطّل لو أي خانة ناقصة / الباسورد غير متطابق / الشروط غير مفعلة */}
//           <button
//             type="submit"
//             disabled={!canSubmit}
//             aria-disabled={!canSubmit}
//             className={`mt-2 w-full rounded-2xl py-3 text-base font-medium flex items-center justify-center gap-2
//               ${canSubmit ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-400 text-white/90 cursor-not-allowed opacity-70'}`}
//           >
//             {isChecking ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 جاري التحقق...
//               </>
//             ) : (
//               'إنشاء حساب'
//             )}
//           </button>

//           <p className="text-center text-xs text-neutral-500">
//             بالتسجيل فإنك توافق على{' '}
//             <a href="#" className="text-red-600 hover:underline">معايير المجتمع</a> و{' '}
//             <a href="#" className="text-red-600 hover:underline">شروط وأحكام معايير المجتمع</a>
//           </p>
//         </form>

//         {/* زر إغلاق */}

//       </div>
//     </div>
//   );
// }

/* eslint-disable @next/next/no-img-element */
'use client';

import Loader from '@/components/Loader';
import { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccessfulSignup?: (credentials: { emailOrPhone: string; password: string; token: string }) => void;
};

// يمكنك ضبطه من env: NEXT_PUBLIC_API_BASE
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://bo-chat.space';

// ✅ تعريف نوع payload لتجنب any
type ApiPayload = {
  token?: string;
  data?: unknown;      // قد يكون كائن بيانات أو نص خطأ
  message?: string;
  error?: string;
};

export default function SignupModal({ open, onClose, onSuccessfulSignup }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  if (!open) return null;

  const trim = (v: string) => v.replace(/\s+/g, ' ').trim();

  const requiredFilled =
    trim(form.firstName).length > 0 &&
    trim(form.lastName).length > 0 &&
    trim(form.username).length > 0 &&
    trim(form.emailOrPhone).length > 0 &&
    form.password.length > 0 &&
    form.confirmPassword.length > 0;

  const passwordsOk = form.password.length > 0 && form.password === form.confirmPassword;
  const canSubmit = requiredFilled && passwordsOk && form.terms && !isChecking;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((f) => ({ ...f, [key]: typeof val === 'string' ? val : (val as boolean) }));
    };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsChecking(true);
    setError(null);

    const emailOrPhone = trim(form.emailOrPhone);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const genderCode = gender === 'male' ? 0 : 1;

    const userData = {
      firstName: trim(form.firstName),
      lastName: trim(form.lastName),
      username: trim(form.username),
      emailOrPhone,
      password: form.password,
      confirmPassword: form.confirmPassword,
      gender: genderCode,
      timeZone,
      terms: form.terms,
    };

    console.log('📤 إرسال بيانات التسجيل:', userData);

    try {
      const res = await fetch(`${API_BASE}/newuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(userData),
      });

      const raw = await res.text().catch(() => '');
      let payload: ApiPayload = {}; // ✅ تم إزالة any
      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        // ليس JSON — نترك payload فارغ
      }

      console.log('📥 Response من السيرفر:', {
        status: res.status,
        statusText: res.statusText,
        payload,
        rawResponse: raw
      });

      const alreadyByData =
        typeof payload?.data === 'string' &&
        /you have an account already/i.test(payload.data as string);

      if (alreadyByData) {
        console.log('❌ الحساب موجود بالفعل!');
        console.log('📄 Response للحساب الموجود:', payload);
        setError('هذا الحساب مسجّل بالفعل. جرّب تسجيل الدخول.');
        setIsChecking(false);
        return;
      }

      if (res.status === 409) {
        console.log('❌ الحساب موجود بالفعل - من HTTP 409');
        setError('هذا الحساب مسجّل بالفعل. جرّب تسجيل الدخول.');
        setIsChecking(false);
        return;
      }

      if (!res.ok) {
        const msg =
          payload?.message ||
          payload?.error ||
          raw ||
          `HTTP error! status: ${res.status}`;

        console.log('❌ خطأ من السيرفر:', msg);

        if (/exist|registered|already|مسجل|موجود/i.test(String(msg))) {
          setError('هذا الحساب مسجّل بالفعل. جرّب تسجيل الدخول.');
        } else {
          setError(String(msg));
        }
        setIsChecking(false);
        return;
      }

      console.log('✅ تم إنشاء حساب جديد بنجاح!');
      console.log('📄 Response للحساب الجديد:', payload);
      console.log('👤 بيانات المستخدم الجديد:', {
        userId: (payload?.data as any)?._id,
        name: (payload?.data as any)?.name,
        username: (payload?.data as any)?.username,
        email: (payload?.data as any)?.useremail,
        token: payload?.token
      });

      if (onSuccessfulSignup && payload?.token) {
        onSuccessfulSignup({
          emailOrPhone,
          password: form.password,
          token: payload.token,
        });
      }
      onClose();
      if (!payload?.token) {
        alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول بالبيانات الجديدة.');
      }
    } catch (err) {
      console.error('💥 خطأ أثناء الاتصال بالسيرفر:', err);
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الحساب';
      setError(message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
      onMouseDown={handleBackdrop}
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl rounded-3xl bg-white/90 shadow-2xl p-6 sm:p-8 !pt-[100px]"
        dir="rtl"
      >
        {isChecking && <Loader/>}

        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <img src="/logo-red.png" width={50} alt="logo" />
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" className="mt-0.5">
              <path fill="currentColor" d="M11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/><path fill="currentColor" d="M1 21h22L12 2 1 21z"/>
            </svg>
            <div>{error}</div>
          </div>
        )}

        {!error && !passwordsOk && (form.password || form.confirmPassword) ? (
          <div className="mb-3 rounded-xl border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-700">
            كلمتا المرور غير متطابقتين
          </div>
        ) : null}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-neutral-500">الاسم الأول</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange('firstName')}
                required
                disabled={isChecking}
                className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-neutral-500">الاسم الثاني</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange('lastName')}
                required
                disabled={isChecking}
                className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-500">اسم المستخدم</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange('username')}
              required
              disabled={isChecking}
              className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-500">البريد الإلكتروني أو رقم الهاتف</label>
            <input
              name="emailOrPhone"
              value={form.emailOrPhone}
              onChange={onChange('emailOrPhone')}
              required
              disabled={isChecking}
              className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
              type="text"
              inputMode="email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-neutral-500">كلمة المرور</label>
              <input
                name="password"
                value={form.password}
                onChange={onChange('password')}
                type="password"
                required
                disabled={isChecking}
                className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-neutral-500">تأكيد كلمة المرور</label>
              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange('confirmPassword')}
                type="password"
                required
                disabled={isChecking}
                className="w-full rounded-2xl bg-neutral-100 px-4 py-3 outline-none ring-1 ring-neutral-200 focus:ring-neutral-300 disabled:opacity-50"
              />
            </div>
          </div>

          <label className="mb-2 block text-sm text-neutral-500">الجنس</label>
          <div className="flex items-center justify-between px-[50px]">
            <div>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isChecking}
                  onClick={() => setGender('male')}
                  className={`rounded-2xl px-7 py-2 transition-colors font-medium disabled:opacity-50 ${
                    gender === 'male'
                      ? 'bg-[#B4B4B9] text-white'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-white-300'
                  }`}
                >
                  ذكر
                </button>
                <button
                  type="button"
                  disabled={isChecking}
                  onClick={() => setGender('female')}
                  className={`rounded-2xl px-7 py-2 transition-colors font-medium disabled:opacity-50 ${
                    gender === 'female'
                      ? 'bg-[#B4B4B9] text-white'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-white-300'
                  }`}
                >
                  أنثى
                </button>
              </div>
              <input type="hidden" name="gender" value={gender} />
            </div>

            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={onChange('terms')}
                required
                disabled={isChecking}
                className="accent-red-600 disabled:opacity-50"
              />
              أوافق على{' '}
              <a href="#" className="text-red-600 hover:underline">
                شروط الاستخدام
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            className={`mt-2 w-full rounded-2xl py-3 text-base font-medium flex items-center justify-center gap-2
              ${canSubmit ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-400 text-white/90 cursor-not-allowed opacity-70'}`}
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري التحقق...
              </>
            ) : (
              'إنشاء حساب'
            )}
          </button>

          <p className="text-center text-xs text-neutral-500">
            بالتسجيل فإنك توافق على{' '}
            <a href="#" className="text-red-600 hover:underline">معايير المجتمع</a> و{' '}
            <a href="#" className="text-red-600 hover:underline">شروط وأحكام معايير المجتمع</a>
          </p>
        </form>
      </div>
    </div>
  );
}