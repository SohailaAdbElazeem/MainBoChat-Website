import Header from "@/components/GlobalSearch";
import ActiveUsersCarousel from "./_components/ActiveUsers";
import StoriesCarousel from "./_components/Stories";
import SidebarArabic from "./_components/SidebarArabic";
import LoginBanner from "./_components/LoginBanner";
import PostsFeed from "./_components/PostsFeed";
import ReelsFeed from "./_components/ReelsFeed";

export default function Home() {
  return (
    <div >
      <Header providers={[]}/>
      <div className="flex overflow-hidden"style={{ height: "calc(100vh - 83px)" }} dir="rtl">
        <div className="max-w-[380px] ">
          <div className="mb-2">
            <ActiveUsersCarousel/>
          </div>
          <StoriesCarousel/>
          <div className="overflow-hidden">
            <SidebarArabic/>
          </div>
        </div>
        <div className="min-w-[650px]">
          <h1 dir="rtl" className="mb-2 text-2xl ">الفضفضات</h1>
          <PostsFeed />
        </div>
        <div className="min-w-[400px] max-w-[450px] rounded-[21px] px-2">
          <h1 dir="rtl" className="mb-2 text-2xl ">الريلز</h1>
          <ReelsFeed/>
        </div>
      </div>
      {/* <LoginBanner/> */}
    </div>
  );
}
