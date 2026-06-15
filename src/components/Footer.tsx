import { ArrowUp, Github, Linkedin, Mail, Heart } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

export default function Footer() {
  const { fullName, linkedin, github, email } = PORTFOLIO_DATA.personal;

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
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          {/* Logo Name */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
            <span className="font-sans font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              {fullName}
            </span>
            <span className="font-sans text-xs text-slate-500 dark:text-slate-405 font-medium">
              Software Developer | Web Developer | AI Enthusiast
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            {["home", "about", "skills", "projects", "certifications", "resume", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => handleScrollToSection(section)}
                className="font-sans text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 uppercase tracking-widest transition-colors cursor-pointer"
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Copyright & Top Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 font-sans text-xs text-slate-400 dark:text-slate-500">
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
                className="p-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-850 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 rounded-lg text-slate-450 dark:text-slate-450 transition-colors"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-850 dark:hover:bg-slate-800 dark:hover:text-white rounded-lg text-slate-450 dark:text-slate-450 transition-colors"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
              <a
                href={`mailto:${email}`}
                className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-500 dark:bg-slate-850 dark:hover:bg-red-950/40 dark:hover:text-red-400 rounded-lg text-slate-450 dark:text-slate-450 transition-colors"
                title="Email"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>

            {/* Scroll back up */}
            <button
              onClick={handleScrollToTop}
              className="p-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-850 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 rounded-lg text-slate-450 dark:text-slate-450 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs"
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
