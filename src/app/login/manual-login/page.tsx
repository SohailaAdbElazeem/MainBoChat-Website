// app/(auth)/login/page.tsx
import Image from "next/image";
import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
    return (
        <main
        className="min-h-screen relative w-full bg-[#0f0f1a] grid place-items-center"
        >
            
            <section className="w-full  grid grid-cols-12 gap-6 items-center ">
                <div className="col-span-12 md:col-span-6 text-white text-center place-items-center gap-6">
                    <h1 className="text-5xl md:text-8xl font-semibold mb-7 text-[#D72229]">مرحباََ بعودتك</h1>
                    <p className="text-white/70 leading-7 text-[30px] !mt-[10px] mb-20">
                        تسجيل الدخول للوصول إلى حسابك
                    </p>
                    <Image src={"/logo.png"} width={230} height={200} alt={""}/>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <LoginForm />
                </div>
            </section>
            <footer className="absolute left-0 bottom-0 w-full flex items-center justify-between px-[40px]">
                <div dir="rtl"
                    className=" py-4 flex flex-wrap items-center justify-center gap-3 text-sm text-red-500"
                >
                    <a href="#" className="hover:text-red-400">تحميل التطبيق جوجل</a>
                    <span className="text-red-500">|</span>
                    <a href="#" className="hover:text-red-400">تحميل التطبيق أبل</a>
                    <span className="text-red-500">|</span>
                    <a href="#" className="hover:text-red-400">سياسة الخصوصية</a>
                    <span className="text-red-500">|</span>
                    <a href="#" className="hover:text-red-400">مركز الخصوصية</a>
                    <span className="text-red-500">|</span>
                    <a href="#" className="hover:text-red-400">إرشادات المجتمع</a>
                    <span className="text-red-500">|</span>
                    <a href="#" className="hover:text-red-400">اتصل بنا</a>
                    <span className="text-red-500">|</span>
                    <a href="#" className="hover:text-red-400">موقع تو شات</a>
                </div>
                <div>
                    <p className="text-white">Powered by <span className="text-[#D72229]">Panda Oracle</span></p>
                </div>
            </footer>
        </main>
    );
}