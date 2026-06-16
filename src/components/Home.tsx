import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Github, Linkedin, Mail, ArrowDown, Download, FileText, ChevronDown, Camera, Upload, X, RefreshCw, Check, Trash2, Video } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

export default function Home() {
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
        try {
          setPersonal(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("portfolio-personal-updated", handleSync);
    return () => window.removeEventListener("portfolio-personal-updated", handleSync);
  }, []);

  const { fullName, role, tagline, github, linkedin, email, avatarPath } = personal;

  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("portfolio_avatar") || avatarPath;
  });

  // Watch avatarPath default changes in case they reset profile data
  useEffect(() => {
    if (!localStorage.getItem("portfolio_avatar")) {
      setAvatar(personal.avatarPath);
    }
  }, [personal.avatarPath]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [useCameraMode, setUseCameraMode] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setErrorMsg(null);
    setCapturedImage(null);
    setUseCameraMode(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: "user" }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setErrorMsg("Camera access failed or blocked. Please verify camera permission in your browser or import from gallery instead.");
      setUseCameraMode(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setUseCameraMode(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 400;
      canvas.height = videoRef.current.videoHeight || 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCapturedImage(result);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = () => {
    if (capturedImage) {
      setAvatar(capturedImage);
      localStorage.setItem("portfolio_avatar", capturedImage);
      setIsEditModalOpen(false);
      setCapturedImage(null);
      stopCamera();
    }
  };

  const resetToDefault = () => {
    localStorage.removeItem("portfolio_avatar");
    setAvatar(avatarPath);
    setIsEditModalOpen(false);
    setCapturedImage(null);
    setErrorMsg(null);
    stopCamera();
  };

  // Automatically turn off camera when modal closes
  useEffect(() => {
    if (!isEditModalOpen) {
      stopCamera();
    }
  }, [isEditModalOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Let's create an elegant smooth scroll action to resume section
  const handleScrollToSection = (id: string) => {
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
    }
  };

  const handleDownloadWord = () => {
    let activePersonal = personal;
    let activeSkills = PORTFOLIO_DATA.skillCategories;
    try {
      const savedP = localStorage.getItem("portfolio_personal");
      if (savedP) activePersonal = JSON.parse(savedP);
      const savedS = localStorage.getItem("portfolio_skill_categories");
      if (savedS) activeSkills = JSON.parse(savedS);
    } catch (e) {
      console.error(e);
    }

    const { fullName, role, email, github, linkedin } = activePersonal;
    const { phone, location } = activePersonal;
    const education = PORTFOLIO_DATA.education;
    const skillCategories = activeSkills;
    const projects = PORTFOLIO_DATA.projects;
    const certifications = PORTFOLIO_DATA.certifications;

    const content = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <title>${fullName} Resume</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: 'Arial', 'Calibri', sans-serif;
            font-size: 11.5pt;
            line-height: 1.4;
            color: #334155;
            margin: 1.0in;
          }
          .title {
            font-size: 26pt;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 2pt;
            text-transform: uppercase;
          }
          .subtitle {
            font-size: 13pt;
            font-weight: bold;
            color: #2563eb;
            margin-top: 0px;
            margin-bottom: 12pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .contact-table {
            width: 100%;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 8pt;
            margin-bottom: 15pt;
          }
          .contact-cell {
            font-size: 10pt;
            color: #475569;
          }
          .section-title {
            font-size: 12.5pt;
            font-weight: bold;
            color: #1e3a8a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 3pt;
            margin-top: 20pt;
            margin-bottom: 8pt;
            text-transform: uppercase;
          }
          .item-header {
            width: 100%;
            margin-bottom: 2pt;
          }
          .item-title {
            font-size: 11pt;
            font-weight: bold;
            color: #0f172a;
            text-align: left;
          }
          .item-meta {
            font-size: 10.5pt;
            font-style: italic;
            color: #475569;
          }
          .item-right {
            font-size: 10.5pt;
            font-weight: bold;
            color: #2563eb;
            text-align: right;
          }
          .item-desc {
            font-size: 10.5pt;
            color: #515e73;
            margin-top: 2pt;
            margin-bottom: 10pt;
          }
          .skills-table {
            width: 100%;
            margin-top: 5pt;
          }
          .skills-category {
            font-size: 10.5pt;
            font-weight: bold;
            color: #0f172a;
            width: 120pt;
            vertical-align: top;
            padding-bottom: 5pt;
          }
          .skills-list {
            font-size: 10.5pt;
            color: #475569;
            vertical-align: top;
            padding-bottom: 5pt;
          }
          .tech-list {
            font-size: 9.5pt;
            font-weight: bold;
            color: #475569;
            margin-top: 1pt;
          }
        </style>
      </head>
      <body>
        <div class="title">${fullName}</div>
        <div class="subtitle">${role}</div>
        
        <table class="contact-table">
          <tr>
            <td class="contact-cell"><strong>Email:</strong> ${email}</td>
            <td class="contact-cell" style="text-align: right;"><strong>Phone:</strong> ${phone}</td>
          </tr>
          <tr>
            <td class="contact-cell"><strong>GitHub:</strong> ${github}</td>
            <td class="contact-cell" style="text-align: right;"><strong>LinkedIn:</strong> ${linkedin}</td>
          </tr>
          <tr>
            <td class="contact-cell" colspan="2"><strong>Location:</strong> ${location}</td>
          </tr>
        </table>

        <div style="font-size: 10.5pt; font-style: italic; color: #475569; margin-bottom: 15pt;">
          To secure a challenging role in software development where I can contribute to meaningful engineering goals, leverage my programming skills (Java, Python, C), web development expertise, and relational databases foundations while learning from industry systems.
        </div>

        <div class="section-title">Education</div>
        ${education.map(edu => `
          <div style="margin-bottom: 10pt;">
            <table class="item-header">
              <tr>
                <td class="item-title">${edu.degree}</td>
                <td class="item-right">${edu.score}</td>
              </tr>
            </table>
            <div class="item-meta">${edu.institution} | ${edu.duration}</div>
            ${edu.details ? `<div class="item-desc">${edu.details}</div>` : ''}
          </div>
        `).join('')}

        <div class="section-title">Key Projects</div>
        ${projects.map(proj => `
          <div style="margin-bottom: 10pt;">
            <table class="item-header">
              <tr>
                <td class="item-title">${proj.title}</td>
                <td class="item-right" style="color: #475569; font-size: 9.5pt; font-weight: normal;">${proj.category}</td>
              </tr>
            </table>
            <div class="item-desc" style="margin-bottom: 2pt;">${proj.description}</div>
            <div class="tech-list">Technologies: ${proj.technologies.join(', ')}</div>
          </div>
        `).join('')}

        <div class="section-title">Skills Matrix</div>
        <table class="skills-table">
          ${skillCategories.map(cat => `
            <tr>
              <td class="skills-category">${cat.title}</td>
              <td class="skills-list">${cat.skills.join(', ')}</td>
            </tr>
          `).join('')}
        </table>

        <div class="section-title">Certifications</div>
        ${certifications.map(cert => `
          <div style="margin-bottom: 8pt;">
            <table class="item-header">
              <tr>
                <td class="item-title">${cert.title}</td>
                <td class="item-right" style="color: #475569; font-size: 9.5pt; font-weight: normal;">${cert.date}</td>
              </tr>
            </table>
            <div class="item-meta" style="font-weight: bold; font-style: normal; font-size: 10pt;">${cert.organization}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Sanaboina_Naga_Komala_Harini_Resume.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadStub = () => {
    // Generate a beautiful, readable text mockup of her Resume as a downloaded .txt document
    // and also direct the user to the print-ready Resume visualizer below!
    const resumeText = `
==================================================
SANABOINA NAGA KOMALA HARINI
Software Developer | Web Developer | AI Enthusiast
--------------------------------------------------
Email: ${email}
Phone: ${PORTFOLIO_DATA.personal.phone}
GitHub: ${github}
LinkedIn: ${linkedin}
Location: ${PORTFOLIO_DATA.personal.location}

OBJECTIVE:
To secure a challenging role in software development where I can contribute 
to meaningful engineering goals, leverage my programming skills (Java, Python, C),
web development expertise, and relational databases foundations while learning from industry systems.

EDUCATION:
- B.Tech in Computer Science & Engineering
  Vignan's Institute of Engineering for Women (2023 - 2027)
  Score: CGPA 7.43/10
  
- Intermediate (M.P.C)
  Sri Viswa Junior College (2021 - 2023)
  Score: 85.1%
  
- Secondary School Certificate (SSC)
  Bhashyam High School (2020 - 2021)
  Score: 10.0 GPA

TECHNICAL SKILLS:
- Programming Languages: Java, Python, C
- Web Technologies: HTML, CSS, JavaScript, React, Tailwind CSS
- Databases: MySQL, Relational Database Design
- Tools & Frameworks: Git, GitHub, VS Code, Vite, Framer Motion

KEY PROJECTS:
1. Green Plantation Drive to Combat Pollution
   Description: Ecological software platform that enables cataloging, tracking, and monitoring of plantation drives and AQI metrics.
   Technologies: React, Tailwind CSS, JavaScript, LocalStorage, Recharts
   
2. Smart DC Motor Speed Control via Bluetooth
   Description: IoT micro-controller hardware-software prototype implementing variable speed regulation via PWM.
   Technologies: Arduino C++, HC-05, Bluetooth Protocols, Android UI Client
   
3. Online Blood Donation Management System
   Description: Grid routing matching query bridge connecting voluntary blood donors and local immediate care clinics.
   Technologies: HTML5, CSS3, JavaScript, MySQL, Node.js/Express

CERTIFICATIONS:
- Oracle Academy: Java Fundamentals and Database Integration Certificate
- Google Cloud Skill Boost: Introduction to Artificial Intelligence and Machine Learning
- Infosys Springboard: Python Core and Advanced Programming Academy
- CISCO Networking Academy: Introduction to Cyber Security Essentials

==================================================
Generated from Sanaboina Naga Komala Harini's Professional Portfolio.
    `.trim();

    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Sanaboina_Naga_Komala_Harini_Resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#F5F7FA] transition-colors duration-300"
    >
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] aspect-square rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[45%] aspect-square rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Info */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-center lg:text-left">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Smooth scroll to internships-section
                handleScrollToSection("internships-section");
                
                // Dispatch event to focus / switch tab to internships
                window.dispatchEvent(new CustomEvent("focus-internships"));
              }}
              transition={{ duration: 0.5 }}
              className="inline-flex self-center lg:self-start items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[#2563EB] text-xs font-sans font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
              title="Click to view & add internships"
            >
              <span>✨ Open to internships & Graduate roles (Active)</span>
            </motion.button>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6.5xl font-sans font-extrabold tracking-tight text-[#111827] leading-tight"
            >
              Hi, I am <br />
              <span className="text-[#2563EB]">
                {fullName}
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl font-sans text-[#374151] font-semibold tracking-wide"
            >
              {role}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-[#374151] max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed"
            >
              {tagline}
            </motion.p>

            {/* Social Icons & Call To Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              {/* Main Format Dropdown selector for Resume */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white font-sans text-sm font-semibold rounded-full shadow-md transition-all duration-200 cursor-pointer"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <Download size={16} />
                  Download Resume
                  <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 mt-2 w-56 rounded-xl bg-white border border-[#D1D5DB] shadow-xl py-1.5 z-50">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleScrollToSection("resume");
                        setTimeout(() => {
                          window.print();
                        }, 800);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 font-sans text-xs sm:text-sm font-semibold text-[#111827] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      PDF Format (Web Print)
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleDownloadWord();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 font-sans text-xs sm:text-sm font-semibold text-[#111827] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      Word Document (.doc)
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleDownloadStub();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 font-sans text-xs sm:text-sm font-semibold text-[#111827] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      Plain Text Format (.txt)
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleScrollToSection("resume")}
                className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-50 border border-[#D1D5DB] active:scale-95 text-[#111827] font-sans text-sm font-semibold rounded-full shadow-xs transition-all duration-200 cursor-pointer"
              >
                <FileText size={16} />
                View Full Resume (PDF)
              </button>

              {/* Social links */}
              <div className="flex items-center gap-3 sm:ml-4 mt-3 sm:mt-0">
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-[#D1D5DB] hover:border-[#2563EB] hover:text-[#2563EB] text-[#374151] transition-all duration-200"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-[#D1D5DB] hover:border-slate-800 hover:text-[#111827] text-[#374151] transition-all duration-200"
                  aria-label="GitHub Profile"
                >
                  <Github size={20} />
                </a>
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-xl bg-white border border-[#D1D5DB] hover:border-red-500 hover:text-red-500 text-[#374151] transition-all duration-200"
                  aria-label="Send Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Avatar Image */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="relative w-72 h-72 sm:w-85 sm:h-85 lg:w-96 lg:h-96"
            >
              {/* Spinning / Pulsing Tech Circles decorative */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#2563EB]/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-indigo-500/10 animate-[spin_30s_linear_infinite_reverse]" />
              <div className="absolute inset-0 bg-blue-500/5 rounded-full filter blur-xl animate-pulse" />

              {/* Float container */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full relative z-10"
              >
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white relative group/avatar">
                  <img
                    src={avatar}
                    alt={fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      // Fallback in case of image load delay, render a visual placeholder using SVG matching the aesthetic
                      const target = e.target as HTMLImageElement;
                      target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${fullName}&radius=10&backgroundColor=b6e3f4,c0aede,d1c4e9`;
                    }}
                  />
                  {/* Floating camera overlay edit button */}
                  <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white z-20">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-3 bg-white/20 hover:bg-white/40 border border-white/45 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-110 mb-2 shadow-md"
                      title="Update Profile Picture"
                    >
                      <Camera size={22} className="text-white" />
                    </button>
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider">Update Photo</span>
                  </div>

                  {/* Corner absolute quick-trigger for touch screens */}
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-lg cursor-pointer z-30 transition-all border border-blue-500 flex items-center justify-center sm:hidden"
                    title="Update Profile Photo"
                  >
                    <Camera size={14} />
                  </button>
                </div>
              </motion.div>

              {/* Experience Card Overlay */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -right-4 bottom-12 z-20 bg-white/95 px-5 py-3.5 rounded-2xl shadow-xl border border-[#D1D5DB] flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-105 text-[#2563EB] flex items-center justify-center font-sans font-bold text-lg">
                  🎓
                </div>
                <div>
                  <span className="block font-sans font-bold text-[#111827] text-sm leading-tight">Vignan Student</span>
                  <span className="block font-sans text-xs text-[#374151]">Class of 2027</span>
                </div>
              </motion.div>

              {/* Tech Stack Overlay Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -left-4 top-16 z-20 bg-white/95 px-4 py-2.5 rounded-2xl shadow-xl border border-[#D1D5DB] flex items-center gap-2.5"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-mono text-xs text-[#111827] font-semibold tracking-tight">Active Tech Stack</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll down Indicator */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <button
            onClick={() => handleScrollToSection("about")}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-[#2563EB] transition-colors duration-200 cursor-pointer"
          >
            <span className="font-sans text-xs uppercase tracking-widest font-semibold">Explore Portfolio</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ArrowDown size={18} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Edit Profile Image Modal overlay */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-[#D1D5DB] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D1D5DB]">
              <h3 className="font-sans font-bold text-[#111827] text-base">Update Profile Picture</h3>
              <button
                onClick={() => {
                  stopCamera();
                  setIsEditModalOpen(false);
                }}
                className="p-1 px-1.5 rounded-lg text-[#374151] hover:text-red-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col items-center">
              {/* Image Preview / Video Stream Container */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-[#F5F7FA] border-2 border-[#D1D5DB] flex items-center justify-center shadow-inner">
                {useCameraMode ? (
                  <div className="w-full h-full relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute inset-x-0 bottom-3 flex justify-center z-10">
                      <button
                        onClick={capturePhoto}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-sans text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Camera size={14} className="animate-pulse" />
                        Capture Frame
                      </button>
                    </div>
                  </div>
                ) : capturedImage ? (
                  <div className="w-full h-full relative">
                    <img
                      src={capturedImage}
                      alt="Captured preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/60 hover:bg-slate-900/85 rounded-full text-white cursor-pointer transition-colors"
                      title="Clear photo"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#D1D5DB] flex items-center justify-center mx-auto text-[#374151]">
                      <Camera size={24} />
                    </div>
                    <p className="font-sans text-xs text-[#374151]">No Image Prepared</p>
                  </div>
                )}
              </div>

              {/* Status or errors */}
              {errorMsg && (
                <div className="w-full p-3 bg-red-50 text-red-600 font-sans text-xs rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Input Controller Options */}
              <div className="w-full space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Select Gallery */}
                  <button
                    onClick={() => {
                      stopCamera();
                      setCapturedImage(null);
                      fileInputRef.current?.click();
                    }}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white hover:bg-[#F5F7FA] border border-[#D1D5DB] rounded-xl transition-all cursor-pointer group"
                  >
                    <Upload size={20} className="text-[#2563EB] group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-xs font-semibold text-[#111827]">Choose Gallery</span>
                  </button>

                  {/* Camera Snap */}
                  <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white hover:bg-[#F5F7FA] border border-[#D1D5DB] rounded-xl transition-all cursor-pointer group"
                  >
                    <Video size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-xs font-semibold text-[#111827]">Use Camera</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#F5F7FA] border-t border-[#D1D5DB] flex items-center justify-between gap-3">
              <button
                onClick={resetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-[#374151] hover:text-red-605 font-sans text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                Reset Original
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    stopCamera();
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 bg-white border border-[#D1D5DB] hover:bg-slate-50 text-[#111827] font-sans text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveImage}
                  disabled={!capturedImage}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:hover:bg-[#2563EB] text-white font-sans text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  <Check size={14} />
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
