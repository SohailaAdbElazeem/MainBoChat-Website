// app/post/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader';

// تعريف نوع المنشور (يمكنك استيراده من types/types إذا كان موجوداً)
interface Post {
  _id: string;
  content: string;
  name: string;
  username: string;
  userimg: string;
  userid: string;
  createdAt: string;
  image?: any[];
  likes?: any[];
  comments?: any[];
}

export default function SinglePostPage() {
  const params = useParams();
  const postId = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
       
        const res = await fetch(`https://bo-chat.space/homepage/posts/GetPost/${postId}`);
        
        if (!res.ok) {
          throw new Error('المنشور غير موجود');
        }
        
        const data = await res.json();
        // نفترض أن البيانات تأتي كمصفوفة أو كائن مباشر
        const postData = Array.isArray(data) ? data[0] : data;
        setPost(postData);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل المنشور');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // حالات التحميل والخطأ
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-2">عذراً!</h2>
        <p className="text-gray-600">{error || 'المنشور غير موجود'}</p>
        <Link href="/" className="mt-4 text-red-500 hover:underline">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    );
  }

  // عرض المنشور
  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
      {/* معلومات المستخدم */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={post.userimg || '/imgs/user.png'}
          alt={post.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <Link href={`/profile/${post.userid}`} className="font-bold hover:underline">
            {post.name}
          </Link>
          <p className="text-sm text-gray-500">@{post.username}</p>
        </div>
        <span className="mr-auto text-sm text-gray-400">
          {new Date(post.createdAt).toLocaleDateString('ar-EG')}
        </span>
      </div>

      {/* محتوى المنشور */}
      <div className="mb-4">
        <p className="text-lg whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* الصور إن وجدت */}
      {post.image && post.image.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.image.map((img, idx) => (
            <img
              key={idx}
              src={img.image}
              alt={`صورة ${idx + 1}`}
              className="rounded-lg object-cover w-full max-h-64"
            />
          ))}
        </div>
      )}

      {/* التفاعلات */}
      <div className="flex items-center gap-6 text-gray-500 border-t pt-4">
        <span>❤️ {post.likes?.length || }</span>
        <span>💬 {post.comments?.length || 0}</span>
      </div>

      {/* زر العودة */}
      <Link href="/" className="block mt-6 text-center text-red-500 hover:underline">
        ← العودة إلى الرئيسية
      </Link>
    </div>
  );
}