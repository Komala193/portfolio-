import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Copy, Check, MessageSquare, AlertCircle } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

interface LocalMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  aiResponse?: string;
}

export default function Contact() {
  const { email, phone, location } = PORTFOLIO_DATA.personal;

  // Form Fields
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");

  // Status
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [copiedType, setCopiedType] = useState<"email" | "phone" | null>(null);
  const [sentMessages, setSentMessages] = useState<LocalMessage[]>([]);

  // Load any previously sent mock messages from localStorage for this session
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_messages");
    if (saved) {
      try {
        setSentMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved portfolio messages", e);
      }
    }
  }, []);

  const handleCopy = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !userEmail || !message) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    // Simulate submission delay
    setTimeout(() => {
      const generatedReply = `Hi ${name.trim()}! Thank you so much for reaching out to me. I have received your message regarding: "${
        message.length > 50 ? message.substring(0, 50) + "..." : message
      }". Being a final-year B.Tech CSE candidate, I actively check my inbox and will get back to you at ${userEmail.trim()} within 24 hours. Let's connect on LinkedIn!`;

      const newMessage: LocalMessage = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        email: userEmail.trim(),
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aiResponse: generatedReply,
      };

      const updated = [newMessage, ...sentMessages];
      setSentMessages(updated);
      localStorage.setItem("portfolio_messages", JSON.stringify(updated));

      // Reset form
      setName("");
      setUserEmail("");
      setMessage("");
      setStatus("success");

      // Reset status after a few seconds
      setTimeout(() => setStatus("idle"), 6000);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Visual glowing grid in contact */}
      <div className="absolute bottom-[-10%] left-[40%] w-[40%] aspect-square rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
            06. Communication Hub
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get In Touch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-sans font-bold text-slate-900 dark:text-white leading-snug">
                Let's discuss junior developer openings, programming projects, or technology!
              </h3>
              <p className="font-sans text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Whether you have a junior developer position open, want to invite me to an environmental campaign, or want to discuss Speed Control loops, feel free to drop me a line!
              </p>
            </div>

            {/* Direct Details widgets */}
            <div className="space-y-4 py-6">
              {/* Email item */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 group transition-colors duration-300">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-sans font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</span>
                    <a href={`mailto:${email}`} className="block font-sans font-bold text-slate-800 dark:text-slate-205 text-xs sm:text-sm truncate hover:underline">{email}</a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(email, "email")}
                  className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedType === "email" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Phone item */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 group transition-colors duration-300">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-lg">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-sans font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mobile Phone</span>
                    <span className="block font-sans font-bold text-slate-800 dark:text-slate-205 text-xs sm:text-sm">{phone}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(phone, "phone")}
                  className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Copy phone number"
                  aria-label="Copy phone number"
                >
                  {copiedType === "phone" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Location item */}
              <div className="flex items-center p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 group transition-colors duration-300">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-sans font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Primary Location</span>
                    <span className="block font-sans font-bold text-slate-800 dark:text-slate-205 text-xs sm:text-sm leading-tight truncate">{location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated location/building status */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl flex items-center gap-3.5 no-print">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span className="font-sans text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Student status active at <strong>Vignan Campus</strong>, Duvvada, Visakhapatnam, AP, India.
              </span>
            </div>
          </div>

          {/* Right Column: Submission Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                <MessageSquare size={18} className="text-slate-650" /> Send a direct message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="form_name" className="block font-sans font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="form_name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Dr. Satyam Gupte"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-sans text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="form_email" className="block font-sans font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="form_email"
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="E.g. recruiter@techfirm.org"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg font-sans text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="form_msg" className="block font-sans font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Your message
                  </label>
                  <textarea
                    id="form_msg"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your tech stack needs, interview plans, or feedback..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg font-sans text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all resize-none"
                  />
                </div>

                {/* Submit Feedback Notification */}
                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-555 rounded-lg flex items-start gap-3"
                    >
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-sans font-bold text-emerald-800 dark:text-emerald-300 text-xs">Submission received successfully!</span>
                        <span className="block font-sans text-emerald-650 dark:text-emerald-400 text-[11px] mt-0.5">
                          A local simulated confirmation has been posted below with Harini's auto-replies.
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-500/30 rounded-lg flex items-start gap-3"
                    >
                      <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-sans font-bold text-red-800 dark:text-red-305 text-xs">Submit validation failed</span>
                        <span className="block font-sans text-red-650 dark:text-red-400 text-[11px] mt-0.5">
                          Please complete all three inputs correctly.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Action button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none text-white font-sans text-sm font-semibold rounded-full shadow-xs transition-all cursor-pointer"
                >
                  <Send size={15} />
                  {status === "submitting" ? "Sending Details..." : "Deliver Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Local Sent Messages Terminal (Visual inbox log proof that her form is functional!) */}
        {sentMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 p-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"
          >
            <h4 className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare size={14} /> Active Messages Logs (Stored Session-wise)
            </h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {sentMessages.map((msg) => (
                <div key={msg.id} className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="font-bold text-slate-850 dark:text-white">{msg.name} ({msg.email})</span>
                    <span className="font-mono text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="font-sans text-slate-600 dark:text-slate-300 text-xs py-1 italic border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                    "{msg.message}"
                  </p>
                  
                  {msg.aiResponse && (
                    <div className="p-3 bg-blue-50/50 dark:bg-blue-900/15 border border-blue-500/10 rounded-xl flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center font-sans font-bold text-xs shrink-0 mt-0.5">
                        H
                      </div>
                      <div className="space-y-0.5">
                        <span className="block font-sans font-bold text-blue-800 dark:text-blue-300 text-xs">Harini's Automated Assistant:</span>
                        <p className="font-sans text-slate-605 dark:text-slate-355 text-xs leading-relaxed">
                          {msg.aiResponse}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
