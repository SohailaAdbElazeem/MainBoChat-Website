import Header from "@/components/GlobalSearch";
import ActiveUsersCarousel from "./_components/ActiveUsers";

export default function Home() {
  return (
    <div >
      <Header providers={[]}/>
      <div className="flex col-12" dir="rtl">
        <div className="col-5">
          <ActiveUsersCarousel/>
        </div>
      </div>
    </div>
  );
}
