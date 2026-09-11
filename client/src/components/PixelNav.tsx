import { useEffect, useState } from "react";
import { BookOpen, Gamepad2, Globe, Home, Mail, Menu, Sprout, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

export default function PixelNav() {
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { label: t("nav.home"), href: "#hero", icon: Home },
    { label: t("nav.notes"), href: "/notes", icon: BookOpen },
    { label: t("nav.vr"), href: "#vr", icon: Gamepad2 },
    { label: t("nav.gamejam"), href: "#gamejam", icon: Gamepad2 },
    { label: t("nav.contact"), href: "#contact", icon: Mail },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      setLocation(href);
      return;
    }
    if (location !== "/") {
      window.location.assign(`/${href}`);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === "en" ? "zh" : "en");

  return (
    <nav className={`farm-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container farm-nav-inner">
        <button type="button" onClick={() => handleClick("#hero")} className="farm-brand">
          <span><Sprout aria-hidden="true" /></span><strong>{t("site.brand")}</strong>
        </button>
        <div className="farm-nav-menu">
          {navItems.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              type="button"
              onClick={() => handleClick(href)}
              aria-current={(href === "/notes" && location.startsWith("/notes")) || (href === "#hero" && location === "/") ? "page" : undefined}
            ><Icon aria-hidden="true" /><span>{label}</span></button>
          ))}
          <button type="button" onClick={toggleLanguage} className="farm-language"><Globe aria-hidden="true" /> {i18n.language === "en" ? "中" : "EN"}</button>
        </div>
        <div className="farm-mobile-actions">
          <button type="button" onClick={toggleLanguage} aria-label="切换语言"><Globe aria-hidden="true" /></button>
          <button type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="打开导航菜单">{mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
      </div>
      {mobileOpen && (
        <div className="farm-mobile-menu">
          {navItems.map(({ label, href, icon: Icon }) => <button key={href} type="button" onClick={() => handleClick(href)}><Icon aria-hidden="true" /> {label}</button>)}
        </div>
      )}
    </nav>
  );
}
