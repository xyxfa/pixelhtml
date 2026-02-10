/**
 * ScrollToTop - Stardew Valley style back-to-top button
 * Design: Warm wood panel button with leaf green accent
 */
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-cream border-3 border-wood text-leaf hover:bg-leaf/10 flex items-center justify-center transition-all hover:scale-110"
      style={{ boxShadow: "3px 3px 0 0 oklch(0.35 0.08 55 / 0.4)" }}
      aria-label="回到頂部"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
