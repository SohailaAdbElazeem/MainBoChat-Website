// src/providers/generalPostsProvider.ts
import { SearchResult } from '@/types/search-result';
import { SearchProvider } from '@/types/search-provider';

export const generalPostsProvider: SearchProvider = {
  key: 'posts',
  label: 'المنشورات العامة',
  search: async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) {
      console.log('🔍 البحث عن المنشورات: النص فارغ، نعيد []');
      return [];
    }

    const GENERAL_USER_ID = '686695a04211804ef3875339';
    const url = `https://bo-chat.space/homepage/posts/GetPosts/${GENERAL_USER_ID}?page=1&limit=1000&value=${encodeURIComponent(query)}`;
    console.log(`🔍 [generalPosts] إرسال طلب إلى: ${url}`);

    try {
      const res = await fetch(url);

      if (!res.ok) {
        let errorText = '';
        try {
          errorText = await res.text();
        } catch (_) {
          errorText = 'تعذر قراءة نص الخطأ';
        }
        console.error(`❌ [generalPosts] استجابة غير ناجحة: ${res.status} ${res.statusText}`, errorText);
        return [];
      }

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('❌ [generalPosts] فشل تحليل JSON:', jsonError);
        const rawText = await res.text();
        console.error('📄 [generalPosts] النص الخام المستلم:', rawText);
        return [];
      }

      console.log('✅ [generalPosts] البيانات المستلمة:', data);

      // استخراج المصفوفة من عدة مفاتيح محتملة
      let items: any[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data.response && Array.isArray(data.response)) {
        items = data.response;
      } else if (data.posts && Array.isArray(data.posts)) {
        items = data.posts;
      } else if (data.results && Array.isArray(data.results)) {
        items = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
      } else {
        console.warn('⚠️ [generalPosts] لم نجد مصفوفة في الاستجابة، الهيكل:', Object.keys(data));
        return [];
      }

      if (items.length === 0) {
        console.log('📭 [generalPosts] المصفوفة فارغة، لا نتائج');
      }

      return items.slice(0, 5).map((item: any) => ({
        id: item._id || item.id || `post-${Math.random()}`,
        title: item.content?.slice(0, 50) || item.title || 'منشور',
        subtitle: item.content || item.description || '',
        href: `/post/${item._id || item.id}`,
        meta: item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : '',
      }));
    } catch (fetchError) {
      console.error('❌ [generalPosts] خطأ في طلب الشبكة:', fetchError);
      return [];
    }
  },
};

 