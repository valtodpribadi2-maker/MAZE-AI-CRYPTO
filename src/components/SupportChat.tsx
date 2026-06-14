import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle,
  TrendingUp,
  Zap,
  ArrowRight,
  RefreshCw,
  Clock
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  modelUsed?: string;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "welcome-msg",
        role: "assistant",
        content: "Halo! Saya adalah **Asisten Dukungan AI Mazaal**. Bagaimana saya bisa membantu Anda hari ini? Silakan tanyakan tentang pemicu alur kerja kustom kami, **sistem Cognitive Cascading**, atau cara menggunakan **Terminal Kripto Multi-Agen Groq** di atas!",
        timestamp: new Date(),
        modelUsed: "Mazaal Engine"
      }
    ];
  });
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelIndicator, setModelIndicator] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the chat log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Suggested questions chips
  const suggestionQueries = [
    { text: "Apa itu Cognitive Cascading?", icon: <Zap className="w-3 h-3 text-amber-500" /> },
    { text: "Bagaimana cara mengatur Kunci Groq?", icon: <HelpCircle className="w-3 h-3 text-orange-500" /> },
    { text: "Bantu saya jalankan Triage Kripto", icon: <TrendingUp className="w-3 h-3 text-emerald-500" /> }
  ];

  // Submit hand-off
  const handleSendMessage = async (textToSend: string) => {
    const textMsg = textToSend.trim();
    if (!textMsg || isLoading) return;

    setUserInput("");
    setIsLoading(true);

    // Push User Message
    const userMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      role: "user",
      content: textMsg,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Gather Groq key from device local storage if configured by sandbox
      const groqKey = localStorage.getItem("mazaal_groq_key") || "";

      // Compile history payload to maintain brief conversation context (limit to last 6 messages)
      const formattedHistory = messages.slice(-6).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }));

      const response = await fetch("/api/support-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textMsg,
          history: formattedHistory,
          userApiKey: groqKey
        })
      });

      if (!response.ok) {
        throw new Error("Server responded with a failure status.");
      }

      const result = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `assistant-msg-${Date.now()}`,
        role: "assistant",
        content: result.reply || "Maaf, terjadi kesalahan saat membaca respon server.",
        timestamp: new Date(),
        modelUsed: result.modelUsed || "Asisten AI"
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: "assistant",
        content: "⚠️ **Peringatan Jaringan**: Tidak dapat terhubung ke server backend Mazaal. Silakan periksa koneksi internet Anda atau coba jalankan terminal Multi-Agen untuk membangunkan server.",
        timestamp: new Date(),
        modelUsed: "Sistem Cadangan"
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-55">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-orange-500/30"
          id="floating-support-chat-trigger"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-5.5 h-5.5" />
              </motion.div>
            ) : (
              <motion.div
                key="chat-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <MessageSquare className="w-5.5 h-5.5" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alert tooltip suggestion */}
          {!isOpen && (
            <span className="absolute right-15 bg-neutral-900 border border-neutral-800 text-white text-[11px] font-medium font-sans px-3 py-1 rounded-lg shadow-xl opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
              Chat Mazaal AI Support 💬
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Container Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-22 right-6 w-[360px] sm:w-[400px] h-[540px] bg-white rounded-2xl border border-[#ECE5D9] shadow-2xl z-55 flex flex-col justify-between overflow-hidden"
            id="support-chat-window"
          >
            {/* Header */}
            <div className="p-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold tracking-tight">Mazaal AI Teammate</h4>
                  <p className="text-[9px] font-mono text-neutral-400">CUSTOMER SUCCESS HELPER</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-orange-950 border border-orange-850 text-[9px] text-orange-400 font-bold uppercase tracking-wider">
                  Live Support
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification alert / tip banner */}
            <div className="bg-[#FFFCEB] border-b border-[#F5E6CD] px-4 py-2 text-[10px] text-amber-850 font-normal leading-relaxed flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Saran: Ubah aset di <strong>Terminal Gecko</strong> untuk menganalisis token tertentu.</span>
            </div>

            {/* Chat Messages Stream Log */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF9F6] select-text"
            >
              {messages.map((msg) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                  >
                    {/* Avatar Bubble */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      isAI ? "bg-orange-600/10 text-orange-600 border border-orange-100" : "bg-neutral-900 text-white"
                    }`}>
                      {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Chat Bubble Body */}
                    <div className="space-y-1">
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                        isAI 
                          ? "bg-white text-neutral-800 border border-[#EDEBE4] rounded-tl-none" 
                          : "bg-neutral-900 text-white rounded-tr-none"
                      }`}>
                        {/* Process simple bold markdown tags dynamically */}
                        {msg.content.split("\n\n").map((para, pIdx) => (
                          <p key={pIdx} className={pIdx > 0 ? "mt-1.5" : ""}>
                            {para.split("**").map((text, tIdx) => {
                              if (tIdx % 2 === 1) {
                                return <strong key={tIdx} className="font-bold text-black dark:text-neutral-950">{text}</strong>;
                              }
                              return text;
                            })}
                          </p>
                        ))}
                      </div>

                      {/* Message Meta */}
                      {isAI && msg.modelUsed && (
                        <div className="flex items-center gap-1.5 pl-1 text-[9px] font-mono text-neutral-400">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Rute: {msg.modelUsed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loader indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5 max-w-[85%] mr-auto">
                  <div className="w-7 h-7 rounded-full bg-orange-600/10 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white text-neutral-500 border border-[#EDEBE4] p-3.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin text-orange-600" />
                    <span>Mazaal AI sedang merumuskan jawaban...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions Shelf */}
            <div className="px-4 py-2 bg-[#FAF9F6] border-t border-[#F0ECE1] flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              {suggestionQueries.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.text)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-neutral-50 active:bg-neutral-100 border border-[#ECE5D9] rounded-full text-[10px] text-neutral-700 font-semibold transition-all cursor-pointer shadow-sm shrink-0"
                >
                  {chip.icon}
                  {chip.text}
                </button>
              ))}
            </div>

            {/* Action Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(userInput);
              }}
              className="p-3.5 bg-white border-t border-[#EAE3D5] flex gap-2"
            >
              <input
                type="text"
                placeholder="Tanyakan apa saja kepada Mazaal AI..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-[#F5F3ED] border border-[#DDD5C5] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-orange-500"
                id="support-chat-input"
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:bg-neutral-500 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
                id="support-chat-submit-btn"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
