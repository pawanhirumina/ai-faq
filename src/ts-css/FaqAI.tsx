import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Loader2 } from "lucide-react";
import "./FaqAI.css";

const AI_ENDPOINT = import.meta.env.VITE_AI_API_URL || "/api/ask";

export default function Faq() {
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
        const res = await fetch(AI_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: request.query }),
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || "Failed to get answer");
        }

        setAiAnswer(data.answer || "No answer returned");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setAiError(err.message || "Failed to get answer");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchAnswer();

    return () => controller.abort();
  }, [request]);

  const faqs = [
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

  return (
    <main className="faq-container">
      <div className="faq-wrapper">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <motion.div
              layout
              key={faq.id}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="faq-item"
            >
              <h2 className="faq-question">
                {faq.q}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                  <ChevronDown size={18} style={{ color: "#a1a1aa" }} />
                </motion.div>
              </h2>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="faq-answer">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <motion.div layout className="faq-ai-box">
          <div className="faq-ai-input-row">
            <div className="faq-ai-input-container">
              <Sparkles size={16} style={{ color: "#a1a1aa", flexShrink: 0 }} />
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAsk();
                  if (e.key === "Escape") setOpenId(null);
                }}
                placeholder="Ask AI"
                className="faq-ai-input"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (openId === "ai") setOpenId(null);
                else if (aiQuery.trim()) handleAsk();
                else setOpenId("ai");
              }}
              className="faq-ai-btn"
            >
              <motion.div animate={{ rotate: openId === "ai" ? 180 : 0 }}>
                <ChevronDown size={18} style={{ color: "#a1a1aa" }} />
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
                style={{ overflow: "hidden" }}
              >
                <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(113, 113, 122, 0.5)", marginTop: "4px" }}>
                  {loading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", color: "#a1a1aa" }}>
                      <Loader2 size={14} className="animate-spin" /> Thinking...
                    </div>
                  ) : aiError ? (
                    <p style={{ color: "#f87171", fontSize: "0.875rem", lineHeight: "1.5" }}>{aiError}</p>
                  ) : aiAnswer ? (
                    <p style={{ color: "#cbd5e1", fontSize: "0.875rem", lineHeight: "1.5" }}>
                      {aiAnswer}
                    </p>
                  ) : (
                    <p style={{ color: "#71717a", fontSize: "0.875rem" }}>Press Enter to ask</p>
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
