/**
 * PixelNav - Stardew Valley style navigation bar
 * Design: Warm wood panel with pixel font, cozy and inviting
 */
import { useState, useEffect } from "react";
import { Gamepad2, Menu, X, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PixelNav() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t("nav.home"), href: "#hero" },
    { label: t("nav.vr"), href: "#vr" },
    { label: t("nav.gamejam"), href: "#gamejam" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-cream/95 backdrop-blur-sm border-b-4 border-wood"
        : "bg-transparent"
        }`}
      style={scrolled ? { boxShadow: "0 4px 0 0 oklch(0.35 0.08 55 / 0.2)" } : {}}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => handleClick("#hero")}
          className="flex items-center gap-3 group"
        >
          <Gamepad2 className="w-7 h-7 text-leaf group-hover:text-coral transition-colors" />
          <span className="font-pixel text-sm text-wood tracking-wider hidden sm:inline">
            PIXEL PORTFOLIO
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="font-pixel text-xs px-5 py-2.5 text-wood-dark hover:text-leaf hover:bg-leaf/10 rounded transition-colors"
            >
              {item.label}
            </button>
          ))}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="ml-4 font-pixel text-xs px-4 py-2 border-2 border-wood text-wood-dark hover:bg-wood/10 rounded flex items-center gap-2 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {i18n.language === "en" ? "中文" : "EN"}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center md:hidden gap-3">
          <button
            onClick={toggleLanguage}
            className="p-2 text-wood hover:text-wood-dark transition-colors"
          >
            <Globe className="w-6 h-6" />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-12 h-12 flex items-center justify-center text-wood"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream/98 backdrop-blur-sm border-t-2 border-wood/20 pb-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleClick(item.href)}
              className="block w-full text-left font-pixel text-sm px-8 py-4 text-wood-dark hover:text-leaf hover:bg-leaf/10 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
