import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Menu, X, Code2, Edit3, ChevronDown, Sparkles, Sliders, Award } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);
  const editDropdownRef = useRef<HTMLDivElement>(null);

  // Close customize dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editDropdownRef.current && !editDropdownRef.current.contains(event.target as Node)) {
        setEditDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerCustomizePersonal = () => {
    setEditDropdownOpen(false);
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("open-profile-editor"));
  };

  const triggerCustomizeSkills = () => {
    setEditDropdownOpen(false);
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("open-skills-editor"));
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Certifications", id: "certifications" },
    { label: "Resume", id: "resume" },
    { label: "Contact", id: "contact" },
  ];

  // Track scrolling to add elevation/shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      // Simple intersection observer behavior manually
      const scrollPosition = window.scrollY + 150;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 no-print ${
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-xs border-b border-slate-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Name */}
          <div className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              H
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-slate-850 underline decoration-blue-500 decoration-2 underline-offset-4">
              N.K. Harini
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all duration-250 cursor-pointer ${
                    activeSection === item.id
                      ? "bg-slate-100 text-blue-600 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Customize / Edit Dropdown */}
            <div className="relative" ref={editDropdownRef}>
              <button
                type="button"
                onClick={() => setEditDropdownOpen(!editDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100/50 transition-all duration-200 cursor-pointer shadow-xs hover:scale-102"
              >
                <Edit3 size={12} />
                <span>Customize</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${editDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {editDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/80 rounded-xl shadow-lg py-1.5 z-55 text-left"
                  >
                    <button
                      type="button"
                      onClick={triggerCustomizePersonal}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer text-left border-none bg-transparent"
                    >
                      <Sparkles size={12} className="text-blue-500 shrink-0" />
                      <span>Edit Personal Bio</span>
                    </button>
                    <button
                      type="button"
                      onClick={triggerCustomizeSkills}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer text-left border-none bg-transparent"
                    >
                      <Sliders size={12} className="text-blue-500 shrink-0" />
                      <span>Manage Skills Matrix</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditDropdownOpen(false);
                        handleNavClick("certifications");
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent("open-certificates-editor"));
                        }, 100);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer text-left border-none bg-transparent"
                    >
                      <Award size={12} className="text-blue-500 shrink-0" />
                      <span>Upload Certificates</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Action Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-black/5 transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200/50 bg-white/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg font-sans text-base font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
