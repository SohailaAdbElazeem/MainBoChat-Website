'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import SignupModal from './SignupModal';

type Lang = 'ar' | 'en';

// تعريف جزئي لكائن google accounts (لتجنب any)
interface GoogleAccounts {
  id: {
    initialize: (options: {
      client_id: string;
      callback: (response: { credential?: string }) => void;
      ux_mode: string;
      locale: string;
    }) => void;
    renderButton: (
      element: HTMLElement,
      options: {
        theme: string;
        size: string;
        shape: string;
        text: string;
        width: number;
      }
    ) => void;
    prompt: () => void;
  };
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

const API_BASE = 'https://bo-chat.space';

export default function LoginForm() {
  const [lang, setLang] = useState<Lang>('ar');
  const [showPass, setShowPass] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleCredential = async (response: { credential?: string }) => {
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
        setToken(data.token);
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
    if (!window.google?.accounts) return;

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
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        } else {
          setError('لم يتم استلام رمز المصادقة من الخادم');
        }
      } else {
        setError(data.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.error(error);
      setError('حدث خطأ في الاتصال بالخادم');
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

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(55rem 30rem at 99% -20%, #8b0000, transparent), radial-gradient(50rem 25rem at 65% -20%, #32397fff, transparent)',
        }}
      />

      <div className="relative z-10 rounded-2xl p-6 sm:p-8 backdrop-blur">
        <form onSubmit={onSubmit} className="space-y-3">
          {error && (
            <div className="p-3 rounded bg-red-500/10 text-red-400">{error}</div>
          )}

          <input
            name="identifier"
            placeholder="الايميل أو رقم الهاتف"
            className="w-[500px] rounded-xl px-4 py-4 bg-[#111] text-white"
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              placeholder="كلمة المرور"
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

          <button
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-4 rounded-xl"
          >
            {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>

          <div className="flex justify-center mt-4">
            <div id="google-btn"></div>
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <img src="/imgs/google.png" width={40} alt="Google" />
            <img src="/imgs/apple.png" width={40} alt="Apple" />
            <img src="/imgs/facebook.png" width={40} alt="Facebook" />
          </div>
        </form>
      </div>

      <SignupModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}