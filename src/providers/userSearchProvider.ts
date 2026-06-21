// src/providers/userSearchProvider.ts
import { SearchResult } from '@/types/search-result';
import { SearchProvider } from '@/types/search-provider';

export const userSearchProvider: SearchProvider = {
  key: 'users',
  label: 'المستخدمون',
  search: async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) {
      // console.log('🔍 [userSearch] النص فارغ، نعيد []');
      return [];
    }

    if (typeof window === 'undefined') {
      // console.warn('⚠️ [userSearch] ليس في بيئة متصفح');
      return [];
    }

    console.log('📋 [userSearch] محتويات localStorage بالكامل:');
    const allKeys = Object.keys(localStorage);
    if (allKeys.length === 0) {
      // console.log('  (localStorage فارغ تماماً!)');
    } else {
      allKeys.forEach(key => {
        const value = localStorage.getItem(key);
        const displayValue = value ? value.substring(0, 60) + (value.length > 60 ? '...' : '') : '(فارغ)';
        // console.log(`  🔑 "${key}": ${displayValue}`);
      });
    }

    // استخراج userData و accessToken
    let userDataRaw = null;
    let accessToken = null;

    const userDataKeys = ['userData', 'user', 'userInfo', 'authUser', 'currentUser'];
    for (const key of userDataKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        userDataRaw = value;
        // console.log(`✅ [userSearch] تم العثور على userData في المفتاح: "${key}"`);
        break;
      }
    }

    const tokenKeys = ['accesstoken', 'accessToken', 'token', 'authToken', 'Authorization'];
    for (const key of tokenKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        accessToken = value;
        // console.log(`✅ [userSearch] تم العثور على التوكن في المفتاح: "${key}"`);
        break;
      }
    }

    if (!userDataRaw || !accessToken) {
      // console.warn('⚠️ [userSearch] بيانات المصادقة غير موجودة');
      return [{
        id: 'login-required',
        title: 'سجل دخولك للبحث عن المستخدمين',
        subtitle: 'تسجيل الدخول يمنحك نتائج أكثر',
        href: '/login',
      }];
    }

    let user;
    try {
      user = JSON.parse(userDataRaw);
    } catch (parseError) {
      // console.error('❌ [userSearch] فشل تحليل userData:', parseError);
      return [];
    }

    const userId = user._id || user.id || user.userId;
    if (!userId) {
      // console.warn('⚠️ [userSearch] معرف المستخدم غير موجود');
      return [];
    }

    // // console.log('✅ [userSearch] تم العثور على بيانات المستخدم:', {
    //   userId,
    //   name: user.name || user.username || user.displayName,
    // });

    const url = `https://bo-chat.space/search?userid=${userId}&value=${encodeURIComponent(query)}`;
    // console.log(`🔍 [userSearch] إرسال طلب إلى: ${url}`);
    // console.log("🔑 accessToken =", accessToken);

    try {
      // 🔥 التغيير الجوهري: إضافة "Bearer " قبل التوكن
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("📡 Status =", res.status);
      console.log("📡 StatusText =", res.statusText);

      if (!res.ok) {
        let errorText = '';
        try {
          errorText = await res.text();
        } catch (_) {
          errorText = 'تعذر قراءة نص الخطأ';
        }
        // console.error(`❌ [userSearch] استجابة غير ناجحة: ${res.status}`, errorText);

        // ✅ معالجة 401: تسجيل الخروج التلقائي
        if (res.status === 401) {
          // console.warn('⛔ [userSearch] انتهت صلاحية الجلسة (401)');
          localStorage.clear(); // مسح جميع البيانات
          alert('انتهت صلاحية الجلسة، سيتم تسجيل الخروج'); // أو استخدم toast
          // إعادة التوجيه إلى صفحة تسجيل الدخول
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }, 500);
          return []; // لا نعرض أي نتيجة بحث
        }
        return [];
      }

      const data = await res.json();
      console.log('✅ [userSearch] البيانات المستلمة:', data);

      // استخراج المصفوفة (نتأكد من وجود users)
      let items: any[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data.users && Array.isArray(data.users)) {
        items = data.users;
      } else if (data.results && Array.isArray(data.results)) {
        items = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
      } else if (data.response && Array.isArray(data.response)) {
        items = data.response;
      } else {
        // console.warn('⚠️ [userSearch] لم نجد مصفوفة في الاستجابة، الهيكل:', Object.keys(data));
        return [];
      }

      if (items.length === 0) {
        // console.log('📭 [userSearch] المصفوفة فارغة، لا نتائج');
        return [];
      }

      console.log(`📊 [userSearch] عدد النتائج: ${items.length}`);

      // عرض أول 5 نتائج فقط (كما طلبت)
      return items.slice(0, 5).map((item: any) => ({
        id: item._id || item.id || `user-${Math.random()}`,
        title: item.name || item.username || 'مستخدم',
        subtitle: item.email || item.bio || '',
        href: `/profile/${item._id || item.id}`,
        meta: item.followers ? `${item.followers} متابع` : '',
      }));
    } catch (fetchError) {
      // console.error('❌ [userSearch] خطأ في طلب الشبكة:', fetchError);
      return [];
    }
  },
};