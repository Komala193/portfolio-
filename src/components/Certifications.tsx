import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Award, ShieldCheck, ChevronRight, Bookmark, Download, Plus, X, Upload, File, Trash2, RotateCcw, Check, Sparkles } from "lucide-react";
import { PORTFOLIO_DATA, Certification } from "../data";

interface UploadedFileState {
  name: string;
  type: string;
  content: string;
}

export default function Certifications() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Form State
  const [newCert, setNewCert] = useState({
    title: "",
    organization: "",
    date: "",
    verificationId: ""
  });
  const [uploadedFile, setUploadedFile] = useState<UploadedFileState | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadCertificate = (cert: Certification) => {
    // If it has uploaded fileContent, download that file
    if (cert.fileContent) {
      const link = document.createElement("a");
      link.href = cert.fileContent;
      link.download = cert.fileName || `Certificate_${cert.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Default SVG Gen Engine
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect width="800" height="600" fill="#f8fafc" />
      <rect x="25" y="25" width="750" height="550" fill="none" stroke="#1e293b" stroke-width="12" />
      <rect x="35" y="35" width="730" height="530" fill="none" stroke="#2563eb" stroke-width="2" />
      
      <!-- Corner Accents -->
      <path d="M25 45 L45 25" stroke="#1e293b" stroke-width="12" />
      <path d="M755 25 L775 45" stroke="#1e293b" stroke-width="12" />
      <path d="M25 555 L45 575" stroke="#1e293b" stroke-width="12" />
      <path d="M755 575 L775 555" stroke="#1e293b" stroke-width="12" />

      <!-- Seal Background Accent -->
      <circle cx="400" cy="480" r="55" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" />

      <!-- Header -->
      <text x="400" y="100" font-family="'Times New Roman', Georgia, serif" font-size="28" font-weight="bold" fill="#0f172a" text-anchor="middle" letter-spacing="4">
        CERTIFICATE OF ACHIEVEMENT
      </text>
      <text x="400" y="135" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle" letter-spacing="6">
        TRUSTED SECURE CREDENTIAL
      </text>
      
      <text x="400" y="185" font-family="'Arial', sans-serif" font-size="11" font-weight="normal" fill="#475569" text-anchor="middle">
        This is to officially recognize that
      </text>
      
      <!-- Recipient name -->
      <text x="400" y="235" font-family="'Times New Roman', Georgia, serif" font-size="36" font-style="italic" font-weight="bold" fill="#1e40af" text-anchor="middle">
        Sanaboina Naga Komala Harini
      </text>
      <line x1="160" y1="250" x2="640" y2="250" stroke="#cbd5e1" stroke-width="1" />
      
      <text x="400" y="295" font-family="'Arial', sans-serif" font-size="11" fill="#475569" text-anchor="middle">
        has successfully met the academic and professional criteria for completing
      </text>
      
      <!-- Course / Certification title -->
      <text x="400" y="345" font-family="'Arial', sans-serif" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">
        ${cert.title}
      </text>
      
      <!-- Organization -->
      <text x="400" y="380" font-family="'Arial', sans-serif" font-size="13" font-weight="bold" fill="#2563eb" text-anchor="middle">
        Issued by ${cert.organization}
      </text>
      
      <!-- Bottom Details -->
      <!-- Left Signature block -->
      <line x1="100" y1="480" x2="260" y2="480" stroke="#94a3b8" stroke-width="1" />
      <text x="180" y="498" font-family="'Arial', sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="middle">
        ISSUED CREDENTIAL BOARD
      </text>
      <text x="180" y="515" font-family="'Courier New', monospace" font-size="8.5" fill="#64748b" text-anchor="middle">
        Security Authenticated
      </text>
      
      <!-- Right Date block -->
      <line x1="540" y1="480" x2="700" y2="480" stroke="#94a3b8" stroke-width="1" />
      <text x="620" y="498" font-family="'Arial', sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="middle">
        DATE OF CONFERRAL
      </text>
      <text x="620" y="515" font-family="'Arial', sans-serif" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">
        ${cert.date}
      </text>
      
      <!-- Center Seal -->
      <circle cx="400" cy="480" r="42" fill="#2563eb" opacity="0.9" />
      <circle cx="400" cy="480" r="38" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4,4" />
      <text x="400" y="475" font-family="'Arial', sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">
        OFFICIAL
      </text>
      <text x="400" y="488" font-family="'Arial', sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">
        STAMP
      </text>
      
      <!-- Verification ID details at the absolute bottom -->
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

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("Certificate file payload size exceeds 10MB. Please use a smaller file size.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile({
        name: file.name,
        type: file.type,
        content: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.organization || !newCert.date) {
      alert("Please fill in Title, Issuing Organization, and Issue Date.");
      return;
    }

    const certToAdd: Certification = {
      id: `cert-custom-${Date.now()}`,
      title: newCert.title,
      organization: newCert.organization,
      date: newCert.date,
      verificationId: newCert.verificationId || `USER-UPLOADED-${Math.floor(Math.random() * 9000 + 1000)}`,
      fileContent: uploadedFile?.content,
      fileName: uploadedFile?.name,
      fileType: uploadedFile?.type
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
    setUploadedFile(null);
    setIsModalOpen(false);
  };

  const handleDeleteCert = (id: string) => {
    if (window.confirm("Are you sure you want to remove this custom certificate?")) {
      const updated = certifications.filter(c => c.id !== id);
      setCertifications(updated);
      localStorage.setItem("portfolio_certifications", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("portfolio-certifications-updated"));
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to restore the default certifications list? All uploaded credentials will be cleared.")) {
      setCertifications(PORTFOLIO_DATA.certifications);
      localStorage.removeItem("portfolio_certifications");
      window.dispatchEvent(new CustomEvent("portfolio-certifications-updated"));
    }
  };

  const hasModifiedList = certifications.length !== PORTFOLIO_DATA.certifications.length;

  return (
    <section
      id="certifications"
      className="py-24 bg-[#F5F7FA] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Visual background lines */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-sm font-semibold tracking-wider text-[#374151] uppercase font-mono">
              04. Credentials
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-sans font-extrabold text-[#111827] tracking-tight">
              Professional Certifications
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 self-center font-sans">
            {hasModifiedList && (
              <button
                onClick={handleResetDefaults}
                title="Reset to portfolio defaults"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F5F7FA] text-[#374151] font-sans text-xs font-bold rounded-xl border border-[#D1D5DB] shadow-xs cursor-pointer transition-all"
              >
                <RotateCcw size={12} />
                Reset Defaults
              </button>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-sans text-xs font-extrabold rounded-xl shadow-sm cursor-pointer transition-all"
            >
              <Plus size={14} />
              Upload Certificate
            </button>
          </div>
        </div>

        {/* Certifications Card Grid */}
        {certifications.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-[#D1D5DB] rounded-2xl">
            <Award size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-550 text-sm">No certifications are currently displayed.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-bold hover:underline cursor-pointer"
            >
              Upload your first credentials now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {certifications.map((cert) => {
              const isCustom = !PORTFOLIO_DATA.certifications.some((c) => c.id === cert.id);
              return (
                <div
                  key={cert.id}
                  className="group relative p-6 bg-white border border-[#D1D5DB] rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 flex items-start gap-5 overflow-hidden"
                >
                  {/* Certification Emblem Badge */}
                  <div className="relative shrink-0 p-3 rounded-xl bg-[#F5F7FA] text-[#374151] border border-[#D1D5DB] transition-colors duration-300">
                    <Award size={24} />
                    {cert.fileContent && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold border border-white" title="Verifiable User Upload">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Main Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-mono text-[9px] font-bold text-[#374151] uppercase tracking-widest bg-[#F5F7FA] px-2 py-0.5 rounded inline-block border border-[#D1D5DB]">
                        ID: {cert.verificationId}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                        {cert.date}
                      </span>
                      {cert.fileName && (
                        <span className="font-mono text-[9px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded truncate max-w-[130px]" title={cert.fileName}>
                          📎 File
                        </span>
                      )}
                    </div>

                    <h3 className="font-sans font-bold text-[#111827] text-base sm:text-lg tracking-tight group-hover:text-[#2563EB] transition-colors leading-snug">
                      {cert.title}
                    </h3>

                    <p className="font-sans font-semibold text-[#374151] text-sm mt-1 flex items-center gap-1">
                      <Bookmark size={13} className="shrink-0 text-slate-400" />
                      {cert.organization}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                      <button
                        onClick={() => handleDownloadCertificate(cert)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F5F7FA] hover:bg-[#2563EB] text-[#374151] hover:text-white font-sans text-xs font-semibold rounded-full border border-[#D1D5DB] shadow-2xs transition-all duration-200 cursor-pointer"
                      >
                        <Download size={12} />
                        Download Certificate
                      </button>

                      {isCustom && (
                        <button
                          onClick={() => handleDeleteCert(cert.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 cursor-pointer transition-colors px-2 py-1 rounded hover:bg-red-50"
                        >
                          <Trash2 size={11} />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Accompanying verification mark */}
                  <div className="hidden sm:flex self-center text-slate-300 group-hover:text-[#2563EB] transition-colors duration-300 pr-1">
                    {cert.fileContent ? <Sparkles size={20} className="text-emerald-400" /> : <ShieldCheck size={20} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Certificate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in">
            <form onSubmit={handleSubmit}>
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
                    setIsModalOpen(false);
                    setUploadedFile(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Drag and Drop Upload Zone */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Certificate Document / Attachment (Optional)
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      isDragging
                        ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 scale-[1.01]"
                        : "border-slate-250 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                      className="hidden"
                    />

                    {uploadedFile ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full">
                          <Check size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-sans font-bold text-slate-800 dark:text-white max-w-[250px] truncate mx-auto">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {(uploadedFile.type) || "Credential file loaded"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveUploadedFile}
                          className="px-2.5 py-1 text-[10px] bg-red-100 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-950 dark:hover:bg-red-600 dark:text-red-400 font-sans font-bold rounded-md transition-colors cursor-pointer"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center w-full focus:outline-none cursor-pointer"
                      >
                        <Upload size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors mb-2" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Drag & drop card or click to browse
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
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
                    setIsModalOpen(false);
                    setUploadedFile(null);
                  }}
                  className="px-4 py-2 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-sans font-bold rounded-lg cursor-pointer transition-colors border border-slate-205 dark:border-slate-750"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg font-sans font-bold cursor-pointer transition-colors"
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
