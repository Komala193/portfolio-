import { useState, useEffect } from "react";
import { ArrowUp, Github, Linkedin, Mail, Heart } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

export default function Footer() {
  const [personal, setPersonal] = useState(() => {
    const saved = localStorage.getItem("portfolio_personal");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PORTFOLIO_DATA.personal;
  });

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("portfolio_personal");
      if (saved) {
        try { setPersonal(JSON.parse(saved)); } catch (e) { console.error(e); }
      }
    };
    window.addEventListener("portfolio-personal-updated", handleSync);
    return () => window.removeEventListener("portfolio-personal-updated", handleSync);
  }, []);

  const { fullName, linkedin, github, email, role } = personal;

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="bg-white border-t border-[#D1D5DB] transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          {/* Logo Name */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
            <span className="font-sans font-extrabold text-lg text-[#111827] tracking-tight">
              {fullName}
            </span>
            <span className="font-sans text-xs text-[#374151] font-medium">
              {role}
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            {["home", "about", "skills", "projects", "certifications", "resume", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => handleScrollToSection(section)}
                className="font-sans text-xs font-semibold text-[#374151] hover:text-[#2563EB] uppercase tracking-widest transition-colors cursor-pointer"
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Copyright & Top Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 font-sans text-xs text-[#374151]">
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} Sanaboina Naga Komala Harini.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart size={10} className="text-red-500 fill-current animate-pulse" /> for academic excellence
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick links to profiles */}
            <div className="flex items-center gap-3">
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] rounded-lg text-slate-450 transition-colors"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-slate-450 transition-colors"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
              <a
                href={`mailto:${email}`}
                className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-450 transition-colors"
                title="Email"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>

            {/* Scroll back up */}
            <button
              onClick={handleScrollToTop}
              className="p-2 bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] rounded-lg text-slate-450 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs"
              title="Go back to top"
              aria-label="Scroll back to top"
            >
              <ArrowUp size={14} /> Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
