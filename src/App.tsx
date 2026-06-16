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
  useEffect(() => {
    // Strictly utilize professional light theme
    document.documentElement.classList.remove("dark");
    localStorage.setItem("portfolio_theme", "light");
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#111827] transition-colors duration-300 overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-800">
      {/* Navbar segment */}
      <Navbar isDark={false} onToggleTheme={() => {}} />
      
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
