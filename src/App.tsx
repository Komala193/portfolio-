import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ButterflyCursor from "./components/ButterflyCursor";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect theme on mount
    const savedTheme = localStorage.getItem("portfolio_theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("portfolio_theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300">
      {/* Navbar segment */}
      <Navbar isDark={isDark} onToggleTheme={handleToggleTheme} />
      
      {/* Scroll sections */}
      <main className="transition-all duration-300">
        <Home />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Resume />
        <Contact />
      </main>

      {/* Footer copyright */}
      <Footer />

      {/* Magical Butterfly Custom Cursor */}
      <ButterflyCursor />
    </div>
  );
}
