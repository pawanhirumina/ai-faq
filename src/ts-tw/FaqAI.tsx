import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

const AI_ENDPOINT = import.meta.env.VITE_AI_API_URL || "/api/ask";

export interface FaqItem {
  id: number | string;
  q: string;
  a: string;
}

export interface FaqAIProps {
  /** Array of FAQ items to display */
  faqs?: FaqItem[];
  /** Custom AI API endpoint override */
  aiEndpoint?: string;
  /** Custom placeholder for the AI query input */
  aiPlaceholder?: string;
  /** Loading indicator variant ("text-shimmer" | "skeleton") */
  loadingVariant?: "text-shimmer" | "skeleton";
  /** Custom text for thinking loader */
  loadingText?: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 1,
    q: "How can I contact you?",
    a: "You can contact me via email at pawan@example.com or DM me on Instagram @pawan.hirumina - I usually reply within 24h.",
  },
  {
    id: 2,
    q: "What is your tech stack?",
    a: "I build with Next.js / React, Vite, Tailwind CSS, and TypeScript. Currently learning Rust for backend stuff.",
  },
  {
    id: 3,
    q: "Are you available for freelance work?",
    a: "Yes! I'm open for small freelance projects, landing pages, and portfolio sites. Hit me up with your idea.",
  },
  {
    id: 4,
    q: "Do you share your source code?",
    a: "Yep, most of my learning projects are on GitHub. For client work, I can share private repos on request.",
  },
];

function ShimmerText({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      className="text-sm font-medium bg-gradient-to-r from-zinc-500 via-white to-zinc-500 bg-clip-text text-transparent"
      style={{ backgroundSize: "200% 100%" }}
      animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.p>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-2.5 py-1">
      {["w-[85%]", "w-[70%]", "w-[55%]"].map((w, i) => (
        <div
          key={i}
          className={`h-3 rounded-full bg-zinc-700/60 relative overflow-hidden ${w}`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function FaqAI({
  faqs = DEFAULT_FAQS,
  aiEndpoint = AI_ENDPOINT,
  aiPlaceholder = "Ask AI",
  loadingVariant = "text-shimmer",
  loadingText = "Thinking...",
}: FaqAIProps) {
  const [openId, setOpenId] = useState<number | string | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiError, setAiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<{ query: string; id: number } | null>(null);

  const handleAsk = () => {
    const query = aiQuery.trim();
    if (!query) return;
    setOpenId("ai");
    setRequest({ query, id: Date.now() });
  };

  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    async function fetchAnswer() {
      setLoading(true);
      setAiAnswer(null);
      setAiError("");
      try {
        const res = await fetch(aiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: request.query }),
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Failed to get answer");
        setAiAnswer(data.answer || "No answer returned");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setAiError(err.message || "Failed to get answer");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchAnswer();
    return () => controller.abort();
  }, [request, aiEndpoint]);

  return (
    <main className="bg-zinc-900 text-white w-full min-h-screen justify-center flex flex-row items-center">
      <div className="flex w-[500px] flex-col">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <motion.div
              layout
              key={faq.id}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="bg-zinc-800 rounded-sm my-2 p-4 cursor-pointer flex flex-col gap-2"
            >
              <h2 className="flex justify-between items-center">
                {faq.q}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                  <ChevronDown size={18} className="text-zinc-400" />
                </motion.div>
              </h2>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-300 pt-1 text-sm">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <motion.div
          layout
          className="bg-zinc-800 rounded-sm my-2 p-4 flex flex-col gap-2 border border-zinc-700"
        >
          <div className="flex justify-between items-center gap-3 w-full">
            <div className="flex items-center gap-2 flex-1">
              <Sparkles size={16} className="text-zinc-400 shrink-0" />
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAsk();
                  if (e.key === "Escape") setOpenId(null);
                }}
                placeholder={aiPlaceholder}
                className="bg-transparent outline-none w-full text-white placeholder:text-zinc-500 text-sm"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (openId === "ai") setOpenId(null);
                else if (aiQuery.trim()) handleAsk();
                else setOpenId("ai");
              }}
              className="p-1 cursor-pointer"
            >
              <motion.div animate={{ rotate: openId === "ai" ? 180 : 0 }}>
                <ChevronDown size={18} className="text-zinc-400" />
              </motion.div>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {openId === "ai" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-zinc-700/50 mt-1">
                  {loading ? (
                    loadingVariant === "skeleton" ? (
                      <SkeletonLoader />
                    ) : (
                      <ShimmerText>{loadingText}</ShimmerText>
                    )
                  ) : aiError ? (
                    <p className="text-red-400 text-sm leading-relaxed">
                      {aiError}
                    </p>
                  ) : aiAnswer ? (
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {aiAnswer}
                    </p>
                  ) : (
                    <p className="text-zinc-500 text-sm">Press Enter to ask</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
