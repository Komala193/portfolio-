import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Award, Calendar, BookOpen, Target, Sparkles, Edit3, X, Save, RotateCcw, MapPin, Mail, Phone, Globe } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

export default function About() {
  const [personal, setPersonal] = useState(() => {
    const saved = localStorage.getItem("portfolio_personal");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading saved personal data", e);
      }
    }
    return PORTFOLIO_DATA.personal;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...personal });

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("portfolio_personal");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPersonal(parsed);
          setFormData(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener("portfolio-personal-updated", handleSync);
    return () => window.removeEventListener("portfolio-personal-updated", handleSync);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("portfolio_personal", JSON.stringify(formData));
    setPersonal(formData);
    setIsEditModalOpen(false);
    window.dispatchEvent(new CustomEvent("portfolio-personal-updated"));
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset your profile to the default portfolio values? This will undo all customized edits you've made to your bio, name, tagline, and contact info.")) {
      localStorage.removeItem("portfolio_personal");
      const defaults = PORTFOLIO_DATA.personal;
      setPersonal(defaults);
      setFormData(defaults);
      setIsEditModalOpen(false);
      window.dispatchEvent(new CustomEvent("portfolio-personal-updated"));
    }
  };

  const { aboutHeading, aboutMe, location } = personal;
  const education = PORTFOLIO_DATA.education;

  return (
    <section
      id="about"
      className="py-24 bg-white transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-[30%] left-[-10%] w-[35%] aspect-square rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-[#374151] uppercase font-mono">
            01. Professional Bio
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-sans font-extrabold text-[#111827] tracking-tight">
            About Me & Education Journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Personal Story & Interests */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 bg-[#F5F7FA] rounded-2xl border border-[#D1D5DB] shadow-sm relative group">
              <div className="flex items-center justify-between gap-3 text-blue-600 mb-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <Sparkles size={22} className="shrink-0 text-[#2563EB]" />
                  <h3 className="text-xl font-sans font-bold text-[#111827]">
                    Meet {personal.firstName || "Harini"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#2563EB] text-[#2563EB] hover:text-white text-xs font-bold rounded-lg border border-[#D1D5DB] cursor-pointer transition-all hover:scale-102 hover:shadow-xs"
                >
                  <Edit3 size={11} />
                  Edit Profile
                </button>
              </div>
              <h4 className="font-sans font-semibold text-[#111827] text-lg mb-3">
                {aboutHeading}
              </h4>
              <p className="font-sans text-[#374151] text-base leading-relaxed whitespace-pre-line">
                {aboutMe}
              </p>
            </div>

            {/* Core Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#D1D5DB] flex items-start gap-4 shadow-xs">
                <div className="p-2.5 bg-blue-100 text-[#2563EB] rounded-xl">
                  <Target size={20} />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-[#111827] text-sm">Career Focus</h5>
                  <p className="font-sans text-xs text-[#374151] mt-1">
                    Full-Stack Web Development, OOP Architecture, AI Application Integrations.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#D1D5DB] flex items-start gap-4 shadow-xs">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-[#111827] text-sm">Academic Standings</h5>
                  <p className="font-sans text-xs text-[#374151] mt-1">
                    B.Tech Final Year Candidate. High records in labs, algorithms, and micro-projects.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Timeline Education */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl font-sans font-bold text-[#111827] flex items-center gap-3">
              <GraduationCap size={24} className="text-[#2563EB]" />
              Education Milestones
            </h3>

            {/* Vertical timeline */}
            <div className="relative border-l border-[#D1D5DB] ml-4 pl-6 sm:pl-8 space-y-12 py-2">
              {education.map((edu, idx) => (
                <div key={edu.id} className="relative group">
                  {/* Timeline bullet tag */}
                  <span className="absolute -left-10 sm:-left-12 top-1 w-8 h-8 rounded-full bg-[#F5F7FA] text-[#374151] border border-white shadow-xs flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white duration-200">
                    <GraduationCap size={15} />
                  </span>

                  {/* Card item */}
                  <div className="p-6 bg-white rounded-xl border border-[#D1D5DB] transition-all duration-300 hover:shadow-sm hover:border-[#2563EB]">
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#374151]">
                        <Calendar size={12} />
                        {edu.duration}
                      </span>
                      <span className="inline-block self-start sm:self-auto px-2.5 py-0.5 bg-[#F5F7FA] text-[#374151] rounded-full font-mono text-xs font-semibold border border-[#D1D5DB]">
                        {edu.score}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-[#111827] text-base">
                      {edu.degree}
                    </h4>
                    <p className="font-sans font-medium text-[#374151] text-sm mt-1">
                      {edu.institution}
                    </p>

                    {edu.details && (
                      <p className="font-sans text-[#374151] text-xs mt-3 border-t border-[#D1D5DB] pt-2 pb-0">
                        {edu.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print text-left overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full xl:max-w-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <form onSubmit={handleSave}>
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex items-center gap-2.5">
                    <Edit3 size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base">
                      Customize Your Professional Profile
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setFormData({ ...personal }); // revert temporary changes
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-none"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  
                  {/* Row 1: Profile Identifiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Sanaboina Naga Komala Harini"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1">
                        First / Preferred Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName || ""}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Harini"
                      />
                    </div>
                  </div>

                  {/* Row 2: Headline / Tagline */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1">
                      Professional Role / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. Software Developer | Web Engineer | AI Enthusiast"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1">
                      Hero Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter a punchy, professional slogan or focus phrase"
                    />
                  </div>

                  {/* Row 3: Bio Heading */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1">
                      Bio Introduction Heading *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.aboutHeading}
                      onChange={(e) => setFormData({ ...formData, aboutHeading: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. Aspiring Web & Software Engineer Passionate about Technology"
                    />
                  </div>

                  {/* Row 4: Professional Biography */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1">
                      Detailed Biography (About Me) *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.aboutMe}
                      onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans leading-relaxed"
                      placeholder="Tell your professional story, educational details, focus areas, and future aspirations..."
                    />
                  </div>

                  {/* Row 5: Contact Identifiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin size={11} /> Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="City, State, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Mail size={11} /> Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="yourname@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Phone size={11} /> Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="+91 9XXXX XXXXX"
                      />
                    </div>
                  </div>

                  {/* Row 6: External URL Profiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1">
                        GitHub URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider mb-1">
                        LinkedIn URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-red-50 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-950/40 dark:hover:bg-red-600 dark:text-red-400 font-sans font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    <RotateCcw size={12} />
                    Reset to Default
                  </button>

                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setFormData({ ...personal });
                      }}
                      className="px-4 py-2 bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-750 text-slate-705 dark:text-slate-300 font-sans font-bold rounded-lg cursor-pointer transition-colors border border-slate-205 dark:border-slate-750"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-sans font-bold cursor-pointer transition-colors shadow-sm hover:shadow-md"
                    >
                      <Save size={14} />
                      Save Profile
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
