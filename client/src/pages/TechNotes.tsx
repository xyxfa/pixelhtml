import { useEffect } from "react";
import PixelNav from "@/components/PixelNav";

export default function TechNotes() {
  useEffect(() => {
    document.title = "开发者日志 | XYXYA";
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-svh bg-[#f5f2da] text-[#24382e]">
      <PixelNav />
      <main className="grid min-h-svh place-items-center px-6 pt-24 pb-12" aria-label="开发者日志">
        <h1 className="text-center text-2xl sm:text-3xl font-medium leading-relaxed tracking-wider">
          忙完后会统一上传
        </h1>
      </main>
    </div>
  );
}
