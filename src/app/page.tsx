import LoginBanner from "./_components/LoginBanner";
import PostsFeed from "./_components/PostsFeed";

export default function Home() {
  return (
    <div>
        <div className="min-w-[650px] max-w-full" >
          
          <h1 dir="rtl" className="mb-2 mr-2 text-2xl">الفضفضات</h1>
          <PostsFeed />
        </div>
      {/* <LoginBanner/> */}
    </div>
  );
}
