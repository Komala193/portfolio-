import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Download, Printer, GraduationCap, Code2, Award, Briefcase, Mail, Phone, MapPin, ExternalLink, Globe, FileDiff, Plus, X, Check, Trash2, Upload, File } from "lucide-react";
import { PORTFOLIO_DATA, Internship, Certification } from "../data";

export default function Resume() {
  const [personal, setPersonal] = useState(() => {
    const saved = localStorage.getItem("portfolio_personal");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PORTFOLIO_DATA.personal;
  });

  const [skillCategories, setSkillCategories] = useState(() => {
    const saved = localStorage.getItem("portfolio_skill_categories");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PORTFOLIO_DATA.skillCategories;
  });

  useEffect(() => {
    const handleSyncP = () => {
      const saved = localStorage.getItem("portfolio_personal");
      if (saved) {
        try { setPersonal(JSON.parse(saved)); } catch (e) {}
      }
    };
    const handleSyncS = () => {
      const saved = localStorage.getItem("portfolio_skill_categories");
      if (saved) {
        try { setSkillCategories(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener("portfolio-personal-updated", handleSyncP);
    window.addEventListener("portfolio-skill-categories-updated", handleSyncS);
    return () => {
      window.removeEventListener("portfolio-personal-updated", handleSyncP);
      window.removeEventListener("portfolio-skill-categories-updated", handleSyncS);
    };
  }, []);

  const { fullName, role, email, phone, location, github, linkedin, aboutMe } = personal;
  const education = PORTFOLIO_DATA.education;
  const projects = PORTFOLIO_DATA.projects;

  const [certifications, setCertifications] = useState<Certification[]>(() => {
    const saved = localStorage.getItem("portfolio_certifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading saved certifications", e);
      }
    }
    return PORTFOLIO_DATA.certifications;
  });

  const [internships, setInternships] = useState<Internship[]>(() => {
    const saved = localStorage.getItem("portfolio_internships");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading saved internships", e);
      }
    }
    return PORTFOLIO_DATA.internships;
  });

  const [activeTab, setActiveTab] = useState<"interactive" | "compact">("interactive");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAddInternshipOpen, setIsAddInternshipOpen] = useState(false);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);

  // Form State for dynamic certification creation & upload
  const [newCert, setNewCert] = useState({
    title: "",
    organization: "",
    date: "",
    verificationId: ""
  });
  const [certUploadedFile, setCertUploadedFile] = useState<{ name: string; type: string; content: string } | null>(null);
  const [isDraggingCert, setIsDraggingCert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for dynamic internship creation
  const [newInternship, setNewInternship] = useState({
    role: "",
    company: "",
    location: "",
    duration: "",
    description: "",
    skills: ""
  });

  useEffect(() => {
    const handleFocusInternships = () => {
      // Switch active tab to interactive since internships are displayed there
      setActiveTab("interactive");
      
      // Flash or highlight the internships container to draw the user's attention
      setTimeout(() => {
        const target = document.getElementById("internships-section");
        if (target) {
          target.classList.add("ring-4", "ring-blue-500/40", "dark:ring-blue-400/30", "p-4", "bg-blue-50/15", "dark:bg-blue-950/10", "rounded-2xl", "scale-[1.015]", "transition-all", "duration-500");
          setTimeout(() => {
            target.classList.remove("ring-4", "ring-blue-500/40", "dark:ring-blue-400/30", "p-4", "bg-blue-50/15", "dark:bg-blue-950/10", "rounded-2xl", "scale-[1.015]");
          }, 3500);
        }
      }, 200);
    };

    const handleSyncCerts = () => {
      const saved = localStorage.getItem("portfolio_certifications");
      if (saved) {
        try {
          setCertifications(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCertifications(PORTFOLIO_DATA.certifications);
      }
    };

    window.addEventListener("focus-internships", handleFocusInternships);
    window.addEventListener("portfolio-certifications-updated", handleSyncCerts);
    return () => {
      window.removeEventListener("focus-internships", handleFocusInternships);
      window.removeEventListener("portfolio-certifications-updated", handleSyncCerts);
    };
  }, []);

  // Handler for printing natively
  const handlePrint = () => {
    // Open instructions modal as fallback/assist and try standard print
    setIsPrintModalOpen(true);
    try {
      window.print();
    } catch (e) {
      console.warn("NATIVE PRINT ATTEMPT ERROR (expected block if in restricted iframe):", e);
    }
  };

  const handleDownloadInternshipCertificate = (intern: any) => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#fcfbf7" />
      <rect x="25" y="25" width="750" height="550" fill="none" stroke="#0f172a" stroke-width="12" />
      <rect x="35" y="35" width="730" height="530" fill="none" stroke="#b45309" stroke-width="2" />
      
      <!-- Luxury Corner Accents -->
      <path d="M25 50 L50 25 M25 60 L60 25 M25 70 L70 25" stroke="#b45309" stroke-width="2" fill="none" />
      <path d="M775 50 L750 25 M775 60 L740 25 M775 70 L730 25" stroke="#b45309" stroke-width="2" fill="none" />
      <path d="M25 550 L50 575 M25 540 L60 575 M25 530 L70 575" stroke="#b45309" stroke-width="2" fill="none" />
      <path d="M775 550 L750 575 M775 540 L740 575 M775 530 L730 575" stroke="#b45309" stroke-width="2" fill="none" />

      <!-- Seal Background Accent -->
      <circle cx="400" cy="485" r="50" fill="#fef3c7" stroke="#fbbf24" stroke-width="1" />

      <text x="400" y="90" font-family="'Georgia', serif" font-size="28" font-weight="bold" fill="#0f172a" text-anchor="middle" letter-spacing="3">
        INTERNSHIP CERTIFICATE
      </text>
      <text x="400" y="120" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#b45309" text-anchor="middle" letter-spacing="5">
        DATAVALLEY INDIA PVT LTD
      </text>
      
      <text x="400" y="180" font-family="'Arial', sans-serif" font-size="12" fill="#475569" text-anchor="middle">
        This is to certify that
      </text>
      
      <!-- Intern name -->
      <text x="400" y="230" font-family="'Georgia', serif" font-size="34" font-weight="bold" font-style="italic" fill="#0f172a" text-anchor="middle">
        Sanaboina Naga Komala Harini
      </text>
      <line x1="180" y1="245" x2="620" y2="245" stroke="#d97706" stroke-width="1.5" />
      
      <text x="400" y="290" font-family="'Arial', sans-serif" font-size="12" fill="#475569" text-anchor="middle">
        has successfully completed an industrial training internship on
      </text>
      
      <!-- Internship Title -->
      <text x="400" y="335" font-family="'Arial', sans-serif" font-size="18" font-weight="bold" fill="#b45309" text-anchor="middle">
        Foundations of AI and ML
      </text>
      <text x="400" y="365" font-family="'Arial', sans-serif" font-size="12" fill="#475569" text-anchor="middle">
        at Datavalley India Pvt Ltd, Vijayawada, Andhra Pradesh, India
      </text>
      
      <text x="400" y="400" font-family="'Arial', sans-serif" font-size="11" fill="#64748b" text-anchor="middle">
        During this period (May 2025 - Present), her technical performance and interest
      </text>
      <text x="400" y="420" font-family="'Arial', sans-serif" font-size="11" fill="#64748b" text-anchor="middle">
        towards Artificial Intelligence and Machine Learning implementation has been exemplary.
      </text>
      
      <!-- Left Sign -->
      <line x1="100" y1="490" x2="250" y2="490" stroke="#94a3b8" stroke-width="1" />
      <text x="175" y="508" font-family="'Arial', sans-serif" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">
        INTERNSHIP MENTOR
      </text>
      <text x="175" y="525" font-family="'Arial', sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">
        Datavalley India Pvt Ltd
      </text>
      
      <!-- Right Sign -->
      <line x1="550" y1="490" x2="700" y2="490" stroke="#94a3b8" stroke-width="1" />
      <text x="625" y="508" font-family="'Arial', sans-serif" font-size="10" font-weight="bold" fill="#475569" text-anchor="middle">
        Vijayawada, India Office
      </text>
      <text x="625" y="525" font-family="'Arial', sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">
        Date: June 2026
      </text>
      
      <!-- Seal -->
      <circle cx="400" cy="485" r="38" fill="#d97706" />
      <text x="400" y="480" font-family="'Arial', sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">
        SECURE
      </text>
      <text x="400" y="492" font-family="'Arial', sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">
        TRAINING
      </text>

      <text x="400" y="560" font-family="'Courier New', monospace" font-size="10" fill="#94a3b8" text-anchor="middle">
        Verification Ref No: DVI-AIML-2025-0982 | Secure Digitization Registry
      </text>
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Harini_Internship_Certificate_Datavalley.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCertificate = (cert: Certification) => {
    if (cert.fileContent) {
      const link = document.createElement("a");
      link.href = cert.fileContent;
      link.download = cert.fileName || `Certificate_${cert.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#f8fafc" />
      <rect x="25" y="25" width="750" height="550" fill="none" stroke="#1e293b" stroke-width="12" />
      <rect x="35" y="35" width="730" height="530" fill="none" stroke="#2563eb" stroke-width="2" />
      
      <path d="M25 45 L45 25" stroke="#1e293b" stroke-width="12" />
      <path d="M755 25 L775 45" stroke="#1e293b" stroke-width="12" />
      <path d="M25 555 L45 575" stroke="#1e293b" stroke-width="12" />
      <path d="M755 575 L775 555" stroke="#1e293b" stroke-width="12" />

      <circle cx="400" cy="480" r="55" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" />

      <text x="400" y="100" font-family="'Times New Roman', Georgia, serif" font-size="28" font-weight="bold" fill="#0f172a" text-anchor="middle" letter-spacing="4">
        CERTIFICATE OF ACHIEVEMENT
      </text>
      <text x="400" y="135" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle" letter-spacing="6">
        TRUSTED SECURE CREDENTIAL
      </text>
      
      <text x="400" y="185" font-family="'Arial', sans-serif" font-size="11" font-weight="normal" fill="#475569" text-anchor="middle">
        This is to officially recognize that
      </text>
      
      <text x="400" y="235" font-family="'Times New Roman', Georgia, serif" font-size="36" font-style="italic" font-weight="bold" fill="#1e40af" text-anchor="middle">
        Sanaboina Naga Komala Harini
      </text>
      <line x1="160" y1="250" x2="640" y2="250" stroke="#cbd5e1" stroke-width="1" />
      
      <text x="400" y="295" font-family="'Arial', sans-serif" font-size="11" fill="#475569" text-anchor="middle">
        has successfully met the academic and professional criteria for completing
      </text>
      
      <text x="400" y="345" font-family="'Arial', sans-serif" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">
        ${cert.title}
      </text>
      
      <text x="400" y="380" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">
        Issued by ${cert.organization}
      </text>
      
      <line x1="100" y1="480" x2="260" y2="480" stroke="#94a3b8" stroke-width="1" />
      <text x="180" y="498" font-family="'Arial', sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="middle">
        ISSUED CREDENTIAL BOARD
      </text>
      <text x="180" y="515" font-family="'Courier New', monospace" font-size="8.5" fill="#64748b" text-anchor="middle">
        Security Authenticated
      </text>
      
      <line x1="540" y1="480" x2="700" y2="480" stroke="#94a3b8" stroke-width="1" />
      <text x="620" y="498" font-family="'Arial', sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="middle">
        DATE OF CONFERRAL
      </text>
      <text x="620" y="515" font-family="'Arial', sans-serif" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">
        ${cert.date}
      </text>
      
      <circle cx="400" cy="480" r="42" fill="#2563eb" opacity="0.9" />
      <circle cx="400" cy="480" r="38" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4,4" />
      <text x="400" y="475" font-family="'Arial', sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">
        OFFICIAL
      </text>
      <text x="400" y="488" font-family="'Arial', sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">
        STAMP
      </text>
      
      <text x="400" y="555" font-family="'Courier New', monospace" font-size="9.5" fill="#64748b" text-anchor="middle">
        Verification Security Code: ${cert.verificationId || 'STAMP-AUTHENTIC-2025'} | Secured by Future Skills Web Engine
      </text>
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Harini_Certificate_${cert.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const processCertFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("Certificate file payload size exceeds 10MB. Please use a smaller file size.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCertUploadedFile({
        name: file.name,
        type: file.type,
        content: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCertFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      processCertFile(file);
    }
  };

  const handleDeleteCert = (id: string) => {
    if (window.confirm("Are you sure you want to remove this custom certificate?")) {
      const updated = certifications.filter(c => c.id !== id);
      setCertifications(updated);
      localStorage.setItem("portfolio_certifications", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("portfolio-certifications-updated"));
    }
  };

  const handleDownloadPrintableHTML = () => {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - ${fullName}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    body {
      font-family: 'Outfit', sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      body {
        background-color: white !important;
        color: black !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .print-shadow {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }
  </style>
</head>
<body class="p-4 sm:p-8 md:p-12 max-w-4xl mx-auto">
  <div class="no-print bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-sm text-blue-850 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h3 class="font-bold text-base text-blue-900 mb-1">Print Assistant (Native PDF Exporter)</h3>
      <p class="text-xs text-blue-700 leading-relaxed">
        Select <strong>"Save as PDF"</strong> or your physical printer as the destination. Ensure background features are <strong>Enabled</strong> in your printer settings for the best visual experience.
      </p>
    </div>
    <div class="flex gap-2 shrink-0">
      <button onclick="window.print()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer">
        Open Printer Settings
      </button>
    </div>
  </div>

  <div class="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm print-shadow">
    <!-- Header -->
    <div class="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col md:flex-row justify-between gap-6">
      <div>
        <h1 class="text-3xl font-extrabold uppercase tracking-tight text-slate-900">${fullName}</h1>
        <h2 class="text-sm text-blue-600 font-bold uppercase tracking-wider mt-1">${role}</h2>
        <p class="mt-3 text-xs text-slate-500 max-w-xl leading-relaxed">${aboutMe}</p>
      </div>
      <div class="flex flex-col space-y-2 text-xs text-slate-500 min-w-[210px] md:border-l md:border-slate-200 md:pl-6 leading-relaxed">
        <div><strong>Email:</strong> ${email}</div>
        <div><strong>Phone:</strong> ${phone}</div>
        <div><strong>Location:</strong> ${location}</div>
        <div><strong>LinkedIn:</strong> ${linkedin}</div>
        <div><strong>GitHub:</strong> ${github}</div>
      </div>
    </div>

    <!-- Grid info -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div class="md:col-span-12 space-y-8">
        <!-- Internships -->
        <div>
          <h3 class="text-base font-bold uppercase tracking-wider border-b-2 border-slate-100 pb-1.5 mb-4 text-slate-900">
            Professional Internships
          </h3>
          <div class="space-y-5">
            ${internships.map(intern => `
              <div class="border-l-2 border-blue-500 pl-4">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <h4 class="font-bold text-slate-900 text-sm">${intern.role}</h4>
                  <span class="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">${intern.duration}</span>
                </div>
                <p class="text-xs font-semibold text-slate-605 mt-0.5">${intern.company} | ${intern.location}</p>
                <p class="text-xs text-slate-550 mt-2 leading-relaxed">${intern.description}</p>
                <div class="flex flex-wrap gap-1 mt-2.5">
                  ${intern.skills.map(skill => `<span class="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-200/50 text-[9px] font-mono rounded mr-1 mb-1">${skill}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Education -->
        <div>
          <h3 class="text-base font-bold uppercase tracking-wider border-b-2 border-slate-100 pb-1.5 mb-4 text-slate-900">
            Education
          </h3>
          <div class="space-y-4">
            ${education.map(edu => `
              <div class="border-l-2 border-slate-300 pl-4">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <h4 class="font-bold text-slate-900 text-sm">${edu.degree}</h4>
                  <span class="text-xs font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">${edu.score}</span>
                </div>
                <p class="text-xs font-semibold text-slate-605 mt-0.5">${edu.institution} | ${edu.duration}</p>
                ${edu.details ? `<p class="text-xs text-slate-500 mt-1.5 leading-relaxed">${edu.details}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Projects -->
        <div>
          <h3 class="text-base font-bold uppercase tracking-wider border-b-2 border-slate-100 pb-1.5 mb-4 text-slate-900">
            Key Projects
          </h3>
          <div class="space-y-4">
            ${projects.map(proj => `
              <div class="border-l-2 border-slate-300 pl-4">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <h4 class="font-bold text-slate-900 text-sm">${proj.title}</h4>
                  <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">${proj.category}</span>
                </div>
                <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">${proj.description}</p>
                <div class="text-xs font-semibold text-slate-600 mt-2 font-mono">
                  Skills: ${proj.technologies.join(', ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Skills Matrix -->
        <div>
          <h3 class="text-base font-bold uppercase tracking-wider border-b-2 border-slate-100 pb-1.5 mb-4 text-slate-900">
            Skills Matrix
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${skillCategories.map(cat => `
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span class="block font-bold text-blue-600 text-xs uppercase tracking-wider mb-2">${cat.title}</span>
                <p class="text-xs text-slate-700 leading-relaxed font-sans">${cat.skills.join(', ')}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Certifications -->
        <div>
          <h3 class="text-base font-bold uppercase tracking-wider border-b-2 border-slate-100 pb-1.5 mb-4 text-slate-900">
            Certifications
          </h3>
          <div class="space-y-3">
            ${certifications.map(cert => `
              <div class="border-l-2 border-slate-200 pl-4">
                <div class="flex items-start justify-between flex-wrap gap-2">
                  <h4 class="font-bold text-slate-800 text-xs mb-0.5">${cert.title}</h4>
                  <span class="text-[10px] font-mono text-slate-400">${cert.date}</span>
                </div>
                <p class="text-xs text-slate-500 font-semibold">${cert.organization}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Verification Footer -->
    <div class="border-t border-slate-200 pt-6 mt-10 text-center text-[10px] text-slate-450 uppercase tracking-widest font-semibold">
      References Available Upon Request • Candidate Declaration: All Data is Academic and Authentic.
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 700);
    };
  </script>
</body>
</html>`;
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Harini_Naga_Komala_Resume_Printable.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadStubFile = () => {
    const internshipsText = internships.map(intern => `
- ${intern.role}
  ${intern.company}, ${intern.location} (${intern.duration})
  ${intern.description}
  Skills: ${intern.skills.join(', ')}
`).join('\n');

    const resumeText = `
==================================================
SANABOINA NAGA KOMALA HARINI
Software Developer | Web Developer | AI Enthusiast
--------------------------------------------------
Email: ${email}
Phone: ${phone}
GitHub: ${github}
LinkedIn: ${linkedin}
Location: ${location}

OBJECTIVE:
To secure a challenging role in software development where I can contribute 
to meaningful engineering goals, leverage my programming skills (Java, Python, C),
web development expertise, and relational databases foundations while learning from industry systems.

PROFESSIONAL INTERNSHIPS:
${internshipsText || 'None recorded.'}

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
- Oracle Cloud Infrastructure: Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate (ID: OCI-AI-2025-6849)
- NPTEL / SWAYAM: NPTEL Certification in Software Engineering (ID: NPTEL-SE-2025-7711)
- Infosys Springboard: Full Stack Development (ID: INF-SPRING-FSD-334)
- Future Skills Prime (NASSCOM): Acquiring Data, Exploratory Data Analysis, Data Processing and Visualization (ID: FSP-DA-EDA-2024-55)

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

  const handleDownloadWordFile = () => {
    const { fullName, role, email, phone, location, github, linkedin, aboutMe } = personal;
    const education = PORTFOLIO_DATA.education;
    const projects = PORTFOLIO_DATA.projects;

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
          ${aboutMe}
        </div>

        <div class="section-title">Professional Internships</div>
        ${internships.map(intern => `
          <div style="margin-bottom: 10pt;">
            <table class="item-header">
              <tr>
                <td class="item-title">${intern.role}</td>
                <td class="item-right">${intern.duration}</td>
              </tr>
            </table>
            <div class="item-meta">${intern.company} | ${intern.location}</div>
            <div class="item-desc">${intern.description}</div>
            <div class="tech-list">Skills: ${intern.skills.join(', ')}</div>
          </div>
        `).join('')}

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

    const blob = new Blob(['\ufeff' + content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Sanaboina_Naga_Komala_Harini_Resume.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="resume"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 no-print">
          <h2 className="text-sm font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
            05. Credentials Layout
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curriculum Vitae Preview
          </p>
        </div>

        {/* Action Header bar (Control board for downloading & printing) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs no-print">
          {/* Layout mode switcher tabs */}
          <div className="flex bg-slate-150 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("interactive")}
              className={`px-4.5 py-1.5 font-sans font-semibold text-xs sm:text-sm rounded-full transition-all cursor-pointer ${
                activeTab === "interactive"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-850"
              }`}
            >
              Interactive Preview
            </button>
            <button
              onClick={() => setActiveTab("compact")}
              className={`px-4.5 py-1.5 font-sans font-semibold text-xs sm:text-sm rounded-full transition-all cursor-pointer ${
                activeTab === "compact"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-850"
              }`}
            >
              Compact view
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full font-sans text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Printer size={16} />
              Save/Print PDF
            </button>
            <button
              onClick={handleDownloadWordFile}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-sans text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer w-full sm:w-auto"
            >
              <Download size={16} className="text-blue-200" />
              Download Word CV
            </button>
            <button
              onClick={handleDownloadStubFile}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 rounded-full font-sans text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Download size={16} className="text-slate-400" />
              Plain Text
            </button>
          </div>
        </div>

        {/* Paper Sheet Document Canvas Container */}
        <div className="relative">
          <div
            className={`w-full bg-white dark:bg-slate-950 rounded-xl overflow-hidden transition-all duration-300 ${
              activeTab === "compact"
                ? "border border-slate-205 dark:border-slate-800 p-8 sm:p-12 shadow-sm"
                : "border border-slate-205 dark:border-slate-800 p-6 sm:p-10 shadow-sm"
            } print-page`}
          >
            {/* CV Header: Core details */}
            <div className="border-b-2 border-slate-900 dark:border-slate-800 pb-6 mb-8 flex flex-col md:flex-row items-stretch justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1.5">
                  {fullName}
                </h1>
                <h2 className="text-sm font-sans text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  {role}
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl font-sans leading-relaxed">
                  {aboutMe}
                </p>
              </div>

              {/* Contact Sidebar Details */}
              <div className="flex flex-col justify-end space-y-2 text-xs font-sans text-slate-500 dark:text-slate-405 min-w-[210px] md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-6 leading-relaxed">
                <span className="flex items-center gap-2">
                  <Mail size={13} className="text-slate-450 dark:text-slate-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-450 dark:text-slate-400 shrink-0" />
                  <span>{phone}</span>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-450 dark:text-slate-400 shrink-0" />
                  <span>{location}</span>
                </span>
                <span className="flex items-center gap-2 no-print">
                  <Globe size={13} className="text-slate-450 dark:text-slate-400 shrink-0" />
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">LinkedIn Profile</a>
                </span>
                <span className="flex items-center gap-2 no-print">
                  <Code2 size={13} className="text-slate-450 dark:text-slate-400 shrink-0" />
                  <a href={github} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">GitHub Portfolio</a>
                </span>
              </div>
            </div>

            {/* Grid structure for CV columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column blocks: Education & Certifications (6/12 width or custom) */}
              <div className="md:col-span-7 space-y-8">
                {/* Internships section */}
                <div id="internships-section" className="space-y-4 scroll-mt-24">
                  <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-slate-100 dark:border-slate-800 pb-1.5 flex items-center justify-between gap-2.5">
                    <span className="flex items-center gap-2.5">
                      <Briefcase size={18} className="text-slate-500 dark:text-slate-400 shrink-0" />
                      Professional Internships
                    </span>
                    <div className="flex gap-1.5 no-print items-center">
                      {internships.length !== PORTFOLIO_DATA.internships.length && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to reset internships to default? This will clear entries you added.")) {
                              setInternships(PORTFOLIO_DATA.internships);
                              localStorage.removeItem("portfolio_internships");
                            }
                          }}
                          title="Reset to default list"
                          className="inline-flex items-center justify-center p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full cursor-pointer transition-colors border border-slate-200 dark:border-slate-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7H18M4 9h5V4" /></svg>
                        </button>
                      )}
                      <button
                        onClick={() => setIsAddInternshipOpen(true)}
                        className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/40 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white font-sans text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-colors border border-blue-105 dark:border-blue-900/50 shadow-xs"
                      >
                        <Plus size={11} />
                        Add Internship
                      </button>
                    </div>
                  </h3>
                  <div className="space-y-5">
                    {internships.map((intern) => (
                      <div key={intern.id} className="relative pl-3.5 border-l-2 border-blue-500 dark:border-blue-500">
                        <div className="flex items-center justify-between gap-2.5 mb-1 flex-wrap">
                          <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm">
                            {intern.role}
                          </h4>
                          <span className="font-mono text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 px-2 py-0.5 rounded shrink-0">
                            {intern.duration}
                          </span>
                        </div>
                        <p className="font-sans font-semibold text-slate-600 dark:text-slate-350 text-xs">
                          {intern.company} | {intern.location}
                        </p>
                        <p className="font-sans text-slate-550 dark:text-slate-450 text-[11.5px] mt-1.5 leading-relaxed">
                          {intern.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {intern.skills.map((skill) => (
                            <span key={skill} className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-850 font-mono text-[9px] rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                        {/* Internship Certificate Button (no-print) */}
                        <div className="mt-3.5 no-print flex items-center justify-between gap-2 flex-wrap">
                          <button
                            onClick={() => handleDownloadInternshipCertificate(intern)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-705 hover:text-white dark:text-slate-300 dark:hover:text-white font-sans text-xs font-semibold rounded-full shadow-xs transition-all duration-200 cursor-pointer"
                          >
                            <Download size={12} className="text-blue-500" />
                            Download Certificate
                          </button>
                          
                          {(!PORTFOLIO_DATA.internships.some(d => d.id === intern.id)) && (
                            <button
                              onClick={() => {
                                const updated = internships.filter(i => i.id !== intern.id);
                                setInternships(updated);
                                localStorage.setItem("portfolio_internships", JSON.stringify(updated));
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:text-white bg-red-55 hover:bg-red-600 dark:bg-red-950/30 dark:hover:bg-red-600 dark:text-red-450 font-sans text-[10px] font-bold rounded-full transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education section */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-2.5">
                    <GraduationCap size={18} className="text-slate-500 dark:text-slate-400 shrink-0" />
                    Education
                  </h3>
                  <div className="space-y-5">
                    {education.map((edu) => (
                      <div key={edu.id} className="relative pl-3.5 border-l-2 border-slate-300 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-2.5 mb-1 flex-wrap">
                          <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm">
                            {edu.degree}
                          </h4>
                          <span className="font-mono text-[10px] font-bold text-slate-800 dark:text-slate-205 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded shrink-0">
                            {edu.score}
                          </span>
                        </div>
                        <p className="font-sans font-semibold text-slate-600 dark:text-slate-350 text-xs">
                          {edu.institution} | {edu.duration}
                        </p>
                        {edu.details && (
                          <p className="font-sans text-slate-550 dark:text-slate-450 text-[11.5px] mt-1.5 leading-relaxed">
                            {edu.details}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic/Independent Projects */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-2.5">
                    <Briefcase size={18} className="text-slate-500 dark:text-slate-400 shrink-0" />
                    Key Projects
                  </h3>
                  <div className="space-y-5">
                    {projects.map((proj) => (
                      <div key={proj.id} className="relative pl-3.5 border-l-2 border-slate-300 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm">
                            {proj.title}
                          </h4>
                          <span className="font-mono text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                            {proj.category}
                          </span>
                        </div>
                        <p className="font-sans text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {proj.technologies.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-850 font-mono text-[9px] rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column blocks: Skills & credentials */}
              <div className="md:col-span-5 space-y-8">
                {/* Skill blocks */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-slate-100 dark:border-slate-800 pb-1.5 flex items-center gap-2.5">
                    <Code2 size={18} className="text-slate-500 dark:text-slate-400 shrink-0" />
                    Skills Matrix
                  </h3>
                  <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-900">
                    {skillCategories.map((cat) => (
                      <div key={cat.title} className="space-y-1.5">
                        <span className="block font-sans font-bold text-slate-800 dark:text-slate-250 text-xs text-blue-600 dark:text-blue-400">
                          {cat.title}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-0.5 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded font-sans text-[11px] font-semibold shadow-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications and credentials list */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-slate-100 dark:border-slate-800 pb-1.5 flex items-center justify-between gap-2.5 animate-pulse-once">
                    <span className="flex items-center gap-2.5">
                      <Award size={18} className="text-slate-500 dark:text-slate-400 shrink-0" />
                      Certifications
                    </span>
                    <div className="flex gap-2.5 no-print items-center">
                      {certifications.length !== PORTFOLIO_DATA.certifications.length && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to reset certifications to default? This will clear entries you uploaded.")) {
                              setCertifications(PORTFOLIO_DATA.certifications);
                              localStorage.removeItem("portfolio_certifications");
                              window.dispatchEvent(new CustomEvent("portfolio-certifications-updated"));
                            }
                          }}
                          type="button"
                          title="Reset to default certifications"
                          className="inline-flex items-center justify-center p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-805 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-350 rounded-full cursor-pointer transition-colors border border-slate-200 dark:border-slate-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7H18M4 9h5V4" /></svg>
                        </button>
                      )}
                      <button
                        onClick={() => setIsAddCertOpen(true)}
                        type="button"
                        className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/45 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors border border-blue-105 dark:border-blue-900/50 shadow-xs"
                      >
                        <Plus size={10} />
                        Upload
                      </button>
                    </div>
                  </h3>
                  <div className="space-y-3.5">
                    {certifications.map((cert) => {
                      const isCustom = !PORTFOLIO_DATA.certifications.some((c) => c.id === cert.id);
                      return (
                        <div key={cert.id} className="text-xs border-l-2 border-slate-100 dark:border-slate-800/60 pl-3 group relative">
                          <div className="flex items-start justify-between gap-1 mb-0.5">
                            <h4 className="font-sans font-bold text-slate-800 dark:text-white leading-tight">
                              {cert.title}
                            </h4>
                            <span className="font-mono text-[9px] text-slate-450 dark:text-slate-550 shrink-0 font-medium">
                              {cert.date}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2.5">
                            <p className="font-sans text-slate-500 dark:text-slate-400 font-semibold text-[11px] truncate max-w-[170px]" title={cert.organization}>
                              {cert.organization}
                            </p>
                            <div className="flex items-center gap-2 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleDownloadCertificate(cert)}
                                type="button"
                                title="Download / View Certificate"
                                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-350 cursor-pointer p-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-955"
                              >
                                <Download size={10} />
                              </button>
                              {isCustom && (
                                <button
                                  onClick={() => handleDeleteCert(cert.id)}
                                  type="button"
                                  title="Remove certificate"
                                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-955"
                                >
                                  <Trash2 size={10} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Footer footer in resume paper */}
            <div className="border-t-2 border-slate-950 dark:border-slate-750 pt-4 mt-10 text-center font-sans text-[10px] text-slate-450 dark:text-slate-550 tracking-wider font-semibold uppercase">
              References Available Upon Request • Candidate Declaration: All Data is Academic and Authentic.
            </div>
          </div>
        </div>
      </div>

      {/* Print / Save PDF Guide Assistant Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Printer className="text-blue-500 shrink-0" size={20} />
                <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base">
                  Save / Print PDF Assistant
                </h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 px-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-605 dark:text-slate-355 leading-relaxed">
                Because this application runs securely inside a sandboxed browser preview frame (iframe), native direct frame triggers are occasionally restricted by browser sandboxes. To bypass this easily, choose one of these premium options:
              </p>

              {/* Option 1: Standalone Download (Our Custom Magic Engine) */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-105 dark:border-blue-900/40 rounded-xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px]">A</span>
                  Print-Ready Dynamic HTML Resume
                </div>
                <p className="text-[11.5px] text-blue-800 dark:text-blue-300/80 leading-relaxed">
                  Downloads an offline-perfect, single-page resume document. Double-clicking this file on your computer opens a beautiful web view and <strong>automatically launches your computer's native system print dialog!</strong>
                </p>
                <button
                  onClick={() => {
                    handleDownloadPrintableHTML();
                    setIsPrintModalOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-extrabold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Download size={14} />
                  Download Print-Ready CV file
                </button>
              </div>

              {/* Option 2: Print in New Tab */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  <span className="px-1.5 py-0.5 bg-slate-850 dark:bg-slate-800 text-white rounded text-[9px]">B</span>
                  Print in a New Tab
                </div>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click the <strong>"Open in New Tab"</strong> button in the browser toolbar next to the app URL preview. In that fresh window, press <strong>Ctrl + P</strong> (or Cmd + P) to print.
                </p>
              </div>

              {/* Tips */}
              <div className="text-[10.5px] bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 p-3 rounded-lg leading-relaxed font-semibold flex items-start gap-2">
                <span className="shrink-0 font-bold text-amber-600">💡 Professional Tip:</span>
                <span>When saving as a PDF, make sure to <strong>checkbox "Background graphics"</strong> on in your browser's Print margins panel so the colored borders and badges render precisely!</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  try {
                    window.print();
                  } catch (e) {
                    console.error("Frame print blocked", e);
                  }
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-705 dark:text-slate-300 font-sans font-bold rounded-lg cursor-pointer transition-colors"
              >
                Try Direct Frame Print Again
              </button>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg font-sans font-bold cursor-pointer transition-colors"
              >
                Okay, I understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Internship Form Modal */}
      {isAddInternshipOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-250 dark:border-slate-800">
            {/* Modal Header */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newInternship.role || !newInternship.company) {
                  alert("Please fill in the Job Role and Company Name.");
                  return;
                }
                const skillsArr = newInternship.skills
                  ? newInternship.skills.split(",").map(s => s.trim()).filter(Boolean)
                  : [];
                
                const added: Internship = {
                  id: `intern-${Date.now()}`,
                  role: newInternship.role,
                  company: newInternship.company,
                  location: newInternship.location || "Remote",
                  duration: newInternship.duration || "June 2026 - Present",
                  description: newInternship.description || "Designed software solutions and contributed to web application modules.",
                  skills: skillsArr
                };

                const updated = [added, ...internships];
                setInternships(updated);
                localStorage.setItem("portfolio_internships", JSON.stringify(updated));

                // Reset form state
                setNewInternship({
                  role: "",
                  company: "",
                  location: "",
                  duration: "",
                  description: "",
                  skills: ""
                });
                setIsAddInternshipOpen(false);
              }}
              className="space-y-4"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Briefcase size={18} className="text-blue-500 shrink-0" />
                  <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
                    Add Dynamic Internship Experience
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddInternshipOpen(false)}
                  className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-sans text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form entries layout */}
              <div className="p-5 space-y-3.5 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Job Role / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Software Development Intern"
                      value={newInternship.role}
                      onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Google or Datavalley Labs"
                      value={newInternship.company}
                      onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Duration / Period
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., June 2026 - Present"
                      value={newInternship.duration}
                      onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Location / Territory
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Remote / Visakhapatnam, AP"
                      value={newInternship.location}
                      onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Skills Used (Comma-separated tags)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Material UI, TypeScript, APIs"
                    value={newInternship.skills}
                    onChange={(e) => setNewInternship({ ...newInternship, skills: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">
                    Separate technical skills with commas (e.g. Pandas, Python, Jupyter)
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Description & Core Accomplishments
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your goals, responsibilities, projects completed, and team milestones during the internship experience..."
                    value={newInternship.description}
                    onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Footer controls */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddInternshipOpen(false)}
                  className="px-4 py-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-705 dark:text-slate-300 font-sans font-bold rounded-lg cursor-pointer transition-colors border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg font-sans font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Save Internship Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Certificate Modal (Resume Side) */}
      {isAddCertOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCert.title || !newCert.organization || !newCert.date) {
                  alert("Please fill in the Certification Title, Issuing Organization, and Issue Date.");
                  return;
                }
                const certToAdd: Certification = {
                  id: `cert-custom-${Date.now()}`,
                  title: newCert.title,
                  organization: newCert.organization,
                  date: newCert.date,
                  verificationId: newCert.verificationId || `USER-UPLOADED-${Math.floor(Math.random() * 9000 + 1000)}`,
                  fileContent: certUploadedFile?.content,
                  fileName: certUploadedFile?.name,
                  fileType: certUploadedFile?.type
                };

                const updated = [certToAdd, ...certifications];
                setCertifications(updated);
                localStorage.setItem("portfolio_certifications", JSON.stringify(updated));
                window.dispatchEvent(new CustomEvent("portfolio-certifications-updated"));

                // Reset fields
                setNewCert({
                  title: "",
                  organization: "",
                  date: "",
                  verificationId: ""
                });
                setCertUploadedFile(null);
                setIsAddCertOpen(false);
              }}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Award size={20} className="text-blue-500 shrink-0" />
                  <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base">
                    Upload & Add Certification
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCertOpen(false);
                    setCertUploadedFile(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer border-none bg-none"
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-left">
                {/* Form fields */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Certification Title / Course *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., AWS Certified Cloud Practitioner"
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Amazon Web Services"
                      value={newCert.organization}
                      onChange={(e) => setNewCert({ ...newCert, organization: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Issue Date / Period *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Mar 2026"
                      value={newCert.date}
                      onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Verification ID / License (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., AWS-CCP-987456"
                    value={newCert.verificationId}
                    onChange={(e) => setNewCert({ ...newCert, verificationId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Drag and Drop Zone */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Certificate Document / Attachment (Optional)
                  </label>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingCert(true); }}
                    onDragLeave={() => setIsDraggingCert(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingCert(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) { processCertFile(file); }
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                      isDraggingCert
                        ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 scale-[1.01]"
                        : "border-slate-250 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleCertFileChange}
                      accept="image/*,application/pdf"
                      className="hidden"
                    />

                    {certUploadedFile ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full">
                          <Check size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-sans font-bold text-slate-800 dark:text-white max-w-[250px] truncate mx-auto">
                            {certUploadedFile.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {(certUploadedFile.type) || "Credential file loaded"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCertUploadedFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="px-2 py-0.5 text-[9px] bg-red-100 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-950 dark:hover:bg-red-600 dark:text-red-400 font-sans font-bold rounded transition-colors cursor-pointer font-sans"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center w-full focus:outline-none cursor-pointer border-none bg-none"
                      >
                        <Upload size={20} className="text-slate-400 mb-1.5" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Drag & drop certificate or click to browse
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
                          Supports PDF, PNG, JPG, JPEG up to 10MB
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCertOpen(false);
                    setCertUploadedFile(null);
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-750 text-slate-705 dark:text-slate-300 font-sans font-bold rounded-lg cursor-pointer transition-colors border border-slate-205 dark:border-slate-750"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-755 text-white rounded-lg font-sans font-bold cursor-pointer transition-colors"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
