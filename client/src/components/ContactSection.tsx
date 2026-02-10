import { Mail, Github, MessageSquare, X, Smartphone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const contactLinks = [
  { id: 'email', icon: Mail, label: "Email", value: "2996477751@qq.com", href: "mailto:2996477751@qq.com", color: "coral" },
  { id: 'github', icon: Github, label: "GitHub", value: "github.com/xyxfa", href: "https://github.com/xyxfa", color: "leaf" },
  { id: 'wechat', icon: MessageSquare, label: "WeChat", value: "点击扫码 (Click to Scan)", href: "#wechat", color: "sky" },
  { id: 'qq', icon: Smartphone, label: "QQ", value: "点击扫码 (Click to Scan)", href: "#qq", color: "lavender" },
];

type ModalType = 'wechat' | 'qq' | null;

export default function ContactSection() {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const getModalContent = () => {
    if (activeModal === 'wechat') {
      return {
        title: "扫码加我微信",
        imgSrc: "/vx-qr.png",
        note: "请在验证消息中备注 “来自作品集” (Please mention \"From Portfolio\")"
      };
    }
    if (activeModal === 'qq') {
      return {
        title: "扫码加我 QQ",
        imgSrc: "/qq-qr.png",
        note: "请在验证消息中备注 “来自作品集” (Please mention \"From Portfolio\")"
      };
    }
    return null;
  };

  const modalData = getModalContent();

  return (
    <section id="contact" className="py-20 bg-parchment relative">
      <div className="container">
        {/* Section Title */}
        <div className="text-center mb-14">
          <h2 className="font-pixel text-base sm:text-lg text-wood inline-block">
            {t("contact.title")}
          </h2>
          <p className="font-body text-sm text-wood-light mt-2">{t("contact.subtitle")}</p>
        </div>

        {/* Contact Cards */}
        <div className="max-w-2xl mx-auto space-y-4">
          {contactLinks.map((link) => {
            const Icon = link.icon;
            const isModal = link.id === 'wechat' || link.id === 'qq';

            const content = (
              <>
                <div className={`w-10 h-10 flex items-center justify-center border-2 border-${link.color} bg-${link.color}/10 text-${link.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className={`font-pixel text-[9px] text-${link.color}`}>
                    {link.label}
                  </div>
                  <div className="font-body text-xs text-foreground/50 mt-0.5">
                    {link.value}
                  </div>
                </div>
                <span className="font-pixel text-[8px] text-wood-light group-hover:text-wood transition-colors">
                  {">>>"}
                </span>
              </>
            );

            if (isModal) {
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveModal(link.id as ModalType)}
                  className="wood-panel flex items-center gap-4 p-4 hover:-translate-y-0.5 transition-transform group w-full text-left outline-none"
                >
                  {content}
                </button>
              );
            }

            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="wood-panel flex items-center gap-4 p-4 hover:-translate-y-0.5 transition-transform group"
              >
                {content}
              </a>
            );
          })}
        </div>

        {/* Message */}
        <div className="text-center mt-12">
          <div className="wood-panel p-6 max-w-lg mx-auto">
            <p className="font-body text-sm text-foreground/70 leading-relaxed">
              {t("contact.message_1")}
            </p>
            <p className="font-body text-sm text-coral mt-2">
              {t("contact.message_2")}
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {activeModal && modalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 pointer-events-auto">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            onClick={() => setActiveModal(null)}
          />

          <div
            className="relative w-full max-w-xs animate-in zoom-in-95 fade-in duration-300 pointer-events-auto"
          >
            <div className="wood-panel p-6 bg-white flex flex-col items-center">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute -top-3 -right-3 w-10 h-10 bg-coral text-white border-2 border-wood-dark shadow-[4px_4px_0_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-90 transition-transform z-10"
              >
                <X size={24} />
              </button>

              <div className="mb-4 text-center">
                <h3 className="font-pixel text-xs text-wood mb-2">{modalData.title}</h3>
                <div className="h-px w-12 bg-wood/20 mx-auto" />
              </div>

              <div className="relative aspect-square w-full bg-cream border-4 border-wood overflow-hidden shadow-inner group">
                <img
                  src={modalData.imgSrc}
                  alt={`${activeModal} QR Code`}
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-wood/30" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-wood/30" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-wood/30" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-wood/30" />
              </div>

              <p className="mt-4 font-body text-[10px] text-wood-light text-center leading-relaxed">
                {modalData.note}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
