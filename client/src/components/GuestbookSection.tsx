import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Users, Eye } from "lucide-react";
import FadeInView from "./FadeInView";

interface Message {
    id: string;
    name: string;
    content: string;
    date: string;
}

export default function GuestbookSection() {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Load busuanzi script for real passenger counting
        const script = document.createElement("script");
        script.async = true;
        script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
        document.body.appendChild(script);

        // Load messages from backend API
        const fetchMessages = async () => {
            try {
                const response = await fetch("/api/guestbook");
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error("Failed to load messages from DB");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();

        return () => {
            if (document.body.contains(script)) {
                // script tag cleanup not strictly necessary, but good practice
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/guestbook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    content: content.trim()
                })
            });

            if (response.ok) {
                const newMsg = await response.json();
                setMessages([newMsg, ...messages]);
                setName("");
                setContent("");
            }
        } catch (error) {
            console.error("Error posting message:", error);
            alert("留言失败，请检查网络或联系网站管理员");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="guestbook" className="py-24 md:py-32 bg-cream relative border-t-4 border-wood-dark overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <FadeInView>
                    <div className="flex flex-col items-center mb-16 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-wood-dark text-cream border-2 border-wood-dark shadow-[4px_4px_0_rgba(0,0,0,0.2)] mb-6 rounded-sm">
                            <Users size={16} />
                            <span className="font-pixel text-[10px] tracking-widest uppercase">留言板</span>
                        </div>
                        <h2 className="typo-game-title text-wood-dark mb-6">留言板</h2>

                        {/* Busuanzi Visitor Count */}
                        <div className="flex gap-4 items-center justify-center font-pixel text-xs text-wood-dark bg-yellow-400/20 border-2 border-wood border-dashed px-6 py-3 shadow-sm rounded-sm">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-wood-dark/70" />
                                <span>本站总阅读量:</span>
                                {/* This ID is populated automatically by Busuanzi script */}
                                <span id="busuanzi_value_site_pv" className="font-bold text-coral ml-1">...</span>
                            </div>
                            <div className="w-px h-4 bg-wood-dark/30" />
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-wood-dark/70" />
                                <span>访客数:</span>
                                <span id="busuanzi_value_site_uv" className="font-bold text-coral ml-1">...</span>
                            </div>
                        </div>
                    </div>
                </FadeInView>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Left: Input Form */}
                    <FadeInView delay={100} className="w-full">
                        <div className="wood-panel p-6 bg-wood relative">
                            {/* Tape decoration */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-6 bg-cream/30 rotate-2 border border-cream/50" />

                            <h3 className="font-pixel text-cream mb-6 text-sm tracking-widest">写下你的留言</h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block font-pixel text-[10px] text-cream/80 mb-2 uppercase">您的昵称</label>
                                    <input
                                        type="text"
                                        maxLength={20}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="神秘人"
                                        disabled={isSubmitting}
                                        className="w-full bg-cream border-4 border-wood-dark text-wood-dark px-4 py-3 font-body text-sm focus:outline-none focus:border-coral transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-pixel text-[10px] text-cream/80 mb-2 uppercase">留言内容</label>
                                    <textarea
                                        rows={4}
                                        maxLength={200}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="说点什么吧..."
                                        disabled={isSubmitting}
                                        className="w-full bg-cream border-4 border-wood-dark text-wood-dark px-4 py-3 font-body text-sm focus:outline-none focus:border-coral transition-colors resize-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`pixel-btn bg-coral border-wood-dark mt-2 self-start flex items-center gap-2 text-xs ${isSubmitting ? 'opacity-50 cursor-not-allowed transform-none shadow-none text-cream/70' : ''}`}
                                >
                                    <Send size={14} />
                                    <span>{isSubmitting ? "发送中..." : "发送留言"}</span>
                                </button>
                            </form>
                        </div>
                    </FadeInView>

                    {/* Right: Messages List */}
                    <FadeInView delay={200} className="w-full flex-1 flex flex-col h-[400px]">
                        <div className="h-full overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={msg.id} className="parchment-panel p-5 relative animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    {/* Push pin */}
                                    <div className="absolute top-2 left-1/2 -ml-1.5 w-3 h-3 bg-red-500 rounded-full shadow-sm border border-red-800" />
                                    <div className="absolute top-3 left-1/2 -ml-0.5 w-1 h-1 bg-white/50 rounded-full" />

                                    <div className="mt-2 text-wood-dark font-body text-sm leading-relaxed mb-4">
                                        "{msg.content}"
                                    </div>
                                    <div className="flex justify-between items-end border-t border-wood/20 pt-2">
                                        <div className="font-pixel text-[10px] text-coral font-bold tracking-wider">
                                            {msg.name}
                                        </div>
                                        <div className="font-pixel text-[8px] text-wood-dark/50">
                                            {msg.date}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="text-center py-10 font-pixel text-xs text-wood-dark/50 animate-pulse">
                                    读取信件中...
                                </div>
                            )}

                            {!isLoading && messages.length === 0 && (
                                <div className="text-center py-10 font-pixel text-xs text-wood-dark/50">
                                    暂无留言...
                                </div>
                            )}
                        </div>
                    </FadeInView>
                </div>
            </div>
        </section>
    );
}
