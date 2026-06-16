import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code, Database, Wrench, Sparkles, Star, Plus, Trash2, X, ChevronRight, Save, RotateCcw, Edit3, Sliders } from "lucide-react";
import { PORTFOLIO_DATA, SkillCategory } from "../data";

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(() => {
    const saved = localStorage.getItem("portfolio_skill_categories");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading saved skill categories", e);
      }
    }
    return PORTFOLIO_DATA.skillCategories;
  });

  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenEdit = () => {
      setIsEditModalOpen(true);
    };
    window.addEventListener("open-skills-editor", handleOpenEdit);
    return () => window.removeEventListener("open-skills-editor", handleOpenEdit);
  }, []);
  
  // Editor state
  const [editingCategories, setEditingCategories] = useState<SkillCategory[]>([]);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number>(0);
  
  // Fields for adding a new skill to current category
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProf, setNewSkillProf] = useState(80);
  
  // Fields for adding a new category
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  // Keep in sync with external updates (like reset actions elsewhere)
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("portfolio_skill_categories");
      if (saved) {
        try {
          setSkillCategories(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener("portfolio-skill-categories-updated", handleSync);
    return () => window.removeEventListener("portfolio-skill-categories-updated", handleSync);
  }, []);

  // Update transient editor state when opening the modal
  useEffect(() => {
    if (isEditModalOpen) {
      setEditingCategories(JSON.parse(JSON.stringify(skillCategories))); // Deep clone
      setSelectedCategoryIdx(0);
      setNewSkillName("");
      setNewSkillProf(80);
      setNewCategoryTitle("");
    }
  }, [isEditModalOpen, skillCategories]);

  // Skill parsing and presentation helpers
  const getSkillProficiency = (skillName: string): number => {
    if (skillName.includes(":")) {
      const parts = skillName.split(":");
      const pct = parseInt(parts[1], 10);
      if (!isNaN(pct)) return pct;
    }
    
    switch (skillName.toLowerCase()) {
      case "java": return 85;
      case "python": return 80;
      case "c": return 75;
      case "html": return 90;
      case "css": return 85;
      case "javascript": return 82;
      case "react": return 75;
      case "tailwind css": return 85;
      case "mysql": return 80;
      case "relational db design": return 75;
      case "git": return 82;
      case "github": return 85;
      case "vs code": return 90;
      default: return 80;
    }
  };

  const getCleanSkillName = (skillName: string): string => {
    if (skillName.includes(":")) {
      return skillName.split(":")[0];
    }
    return skillName;
  };

  const getCategoryIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("programming") || lower.includes("code")) {
      return <Code size={22} className="text-indigo-500" />;
    }
    if (lower.includes("web") || lower.includes("frontend") || lower.includes("react")) {
      return <Star size={22} className="text-sky-500" />;
    }
    if (lower.includes("db") || lower.includes("database") || lower.includes("sql") || lower.includes("mongo")) {
      return <Database size={22} className="text-teal-500" />;
    }
    if (lower.includes("ai") || lower.includes("ml") || lower.includes("intelligence") || lower.includes("learning")) {
      return <Sparkles size={22} className="text-purple-500" />;
    }
    return <Wrench size={22} className="text-amber-500" />;
  };

  // Handler submissions in modal
  const handleAddNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    
    const cleanName = newSkillName.trim().replace(":", " "); // prevent formatting issues
    const formatted = `${cleanName}:${newSkillProf}`;
    
    const updated = [...editingCategories];
    const targetCategory = updated[selectedCategoryIdx];
    
    // Prevent duplicate skill names inside this category
    const existsIdx = targetCategory.skills.findIndex(
      s => getCleanSkillName(s).toLowerCase() === cleanName.toLowerCase()
    );
    
    if (existsIdx !== -1) {
      targetCategory.skills[existsIdx] = formatted; // update existing
    } else {
      targetCategory.skills.push(formatted); // add new
    }
    
    setEditingCategories(updated);
    setNewSkillName("");
    setNewSkillProf(80);
  };

  const handleDeleteSkill = (skillIdx: number) => {
    const updated = [...editingCategories];
    updated[selectedCategoryIdx].skills.splice(skillIdx, 1);
    setEditingCategories(updated);
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) return;
    
    // Prevent duplicated titles
    if (editingCategories.some(c => c.title.toLowerCase() === newCategoryTitle.trim().toLowerCase())) {
      alert("A skill category with this title already exists.");
      return;
    }
    
    const newCat: SkillCategory = {
      title: newCategoryTitle.trim(),
      skills: []
    };
    
    const updated = [...editingCategories, newCat];
    setEditingCategories(updated);
    setSelectedCategoryIdx(updated.length - 1); // select the newly added category
    setNewCategoryTitle("");
  };

  const handleDeleteCategory = (catIdx: number) => {
    if (editingCategories.length <= 1) {
      alert("You need to keep at least 1 skills capability category.");
      return;
    }
    if (window.confirm(`Are you sure you want to remove the entire "${editingCategories[catIdx].title}" category? All skills inside it will be deleted.`)) {
      const updated = editingCategories.filter((_, idx) => idx !== catIdx);
      setEditingCategories(updated);
      setSelectedCategoryIdx(0);
    }
  };

  const handleSaveAll = () => {
    // Validate empty categories
    const hasEmpty = editingCategories.some(c => c.skills.length === 0);
    if (hasEmpty) {
      const confirmSave = window.confirm("Some categorizations currently have no skills added. Are you sure you want to save anyway?");
      if (!confirmSave) return;
    }
    
    localStorage.setItem("portfolio_skill_categories", JSON.stringify(editingCategories));
    setSkillCategories(editingCategories);
    setIsEditModalOpen(false);
    window.dispatchEvent(new CustomEvent("portfolio-skill-categories-updated"));
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset your skills data back to original default settings? This will erase all categories and proficiency levels you added.")) {
      localStorage.removeItem("portfolio_skill_categories");
      const defaults = PORTFOLIO_DATA.skillCategories;
      setSkillCategories(defaults);
      setEditingCategories(defaults);
      setIsEditModalOpen(false);
      window.dispatchEvent(new CustomEvent("portfolio-skill-categories-updated"));
    }
  };

  return (
    <section
      id="skills"
      className="py-24 bg-[#F5F7FA] transition-colors duration-300 relative overflow-hidden text-left"
    >
      {/* Decorative back-grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <h2 className="text-sm font-semibold tracking-wider text-[#374151] uppercase font-mono">
            02. Core Capabilities
          </h2>
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-3xl sm:text-4xl font-sans font-extrabold text-[#111827] tracking-tight">
              Technical Skillset Matrix
            </p>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="mt-2 sm:mt-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs transition-colors"
            >
              <Sliders size={13} />
              Manage Skills
            </button>
          </div>
        </div>

        {/* Bento-style Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, idx) => {
            const isHovered = hoveredCategory === idx;

            return (
              <div
                key={category.title}
                onMouseEnter={() => setHoveredCategory(idx)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`p-6 sm:p-8 rounded-xl bg-white border border-[#D1D5DB] transition-all duration-300 ${
                  isHovered ? "shadow-md border-blue-400" : "shadow-sm"
                }`}
              >
                {/* Header card info */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-[#F5F7FA] text-[#374151]">
                      {getCategoryIcon(category.title)}
                    </span>
                    <h3 className="text-lg font-sans font-bold text-[#111827]">
                      {category.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-[#374151] uppercase tracking-wider font-semibold">
                    {category.skills.length} skills
                  </span>
                </div>

                {/* Grid list or bar-chart items */}
                {category.skills.length === 0 ? (
                  <p className="text-xs text-[#374151] italic font-sans py-4">
                    No individual skills added to this category yet. Click Manage Skills above to add some!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {category.skills.map((skill) => {
                      const prof = getSkillProficiency(skill);
                      const cleanName = getCleanSkillName(skill);
                      return (
                        <div key={skill} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans font-semibold text-[#111827] text-sm">
                              {cleanName}
                            </span>
                            <span className="font-mono text-xs text-[#374151] font-medium">
                              {prof}%
                            </span>
                          </div>

                          {/* Skill bar */}
                          <div className="w-full h-1.5 bg-[#F5F7FA] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${prof}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full rounded-full bg-[#2563EB]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Design Note or summary */}
        <div className="mt-12 text-center p-5 bg-white border border-[#D1D5DB] rounded-xl max-w-2xl mx-auto shadow-sm">
          <p className="font-sans text-xs sm:text-sm text-[#374151] flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-[#2563EB] shrink-0" />
            Always eager to expand this matrix. Currently learning <strong>Next.js</strong> and exploring <strong>TensorFlow</strong>.
          </p>
        </div>
      </div>

      {/* Skills Management Dialog Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print text-left overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[85vh] md:h-[80vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
                <div className="flex items-center gap-2.5">
                  <Sliders size={20} className="text-blue-505 shrink-0" />
                  <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base">
                    Technical Capabilities & Skills Manager
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-none"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body Work-area */}
              <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                
                {/* Left Drawer pane: Category selecting and adding */}
                <div className="w-full md:w-1/3 border-r border-slate-100 dark:border-slate-805 p-4 flex flex-col gap-3.5 bg-slate-50/40 dark:bg-slate-955/20 overflow-y-auto">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">
                      Skill Group Categories
                    </span>
                  </div>

                  {/* Active List */}
                  <div className="space-y-1">
                    {editingCategories.map((cat, idx) => (
                      <button
                        key={`${cat.title}-${idx}`}
                        type="button"
                        onClick={() => setSelectedCategoryIdx(idx)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl font-sans text-xs font-bold border transition-colors cursor-pointer text-left ${
                          selectedCategoryIdx === idx
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-slate-50 dark:bg-slate-900/50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <span className="truncate pr-2">{cat.title}</span>
                        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-medium ${
                          selectedCategoryIdx === idx ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}>
                          {cat.skills.length}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Add New Category form segment */}
                  <form onSubmit={handleAddNewCategory} className="border-t border-slate-200/50 dark:border-slate-800 pt-4 mt-auto">
                    <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1.5">
                      Create New Category
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newCategoryTitle}
                        onChange={(e) => setNewCategoryTitle(e.target.value)}
                        placeholder="e.g. Cloud Platforms"
                        className="flex-1 min-w-0 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
                        title="Add Category"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </form>

                </div>

                {/* Right Area pane: Manage skills in chosen category */}
                <div className="flex-1 p-6 flex flex-col min-h-0 overflow-y-auto">
                  {editingCategories[selectedCategoryIdx] ? (
                    <div className="space-y-5 flex-1 flex flex-col min-h-0">
                      
                      {/* Active category details and rename/delete buttons */}
                      <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0 flex-wrap">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            Active Category ({selectedCategoryIdx + 1} of {editingCategories.length})
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              required
                              value={editingCategories[selectedCategoryIdx].title}
                              onChange={(e) => {
                                const updated = [...editingCategories];
                                updated[selectedCategoryIdx].title = e.target.value;
                                setEditingCategories(updated);
                              }}
                              className="font-sans font-bold text-lg text-slate-950 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:outline-none py-0.5 px-1 rounded"
                              title="Click to rename Category Title"
                            />
                            <Edit3 size={13} className="text-slate-400 shrink-0 pointer-events-none" />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(selectedCategoryIdx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-red-50 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-955 dark:hover:bg-red-600 dark:text-red-400 font-sans font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete Category
                        </button>
                      </div>

                      {/* Add skill to selected category FORM */}
                      <div className="bg-slate-50/50 dark:bg-slate-950/25 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shrink-0">
                        <form onSubmit={handleAddNewSkill} className="space-y-3">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                            Add or Update Skill in this Group
                          </span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                            <div>
                              <label className="block text-[10px] text-slate-405 mb-1 font-semibold">Skill Name</label>
                              <input
                                type="text"
                                required
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                                placeholder="e.g. Kubernetes, Docker, Node.js"
                                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-805 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                              />
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1 text-[10px] text-slate-405">
                                <label className="font-semibold">Proficiency Rating Estimate</label>
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{newSkillProf}%</span>
                              </div>
                              <input
                                type="range"
                                min="20"
                                max="100"
                                step="5"
                                value={newSkillProf}
                                onChange={(e) => setNewSkillProf(parseInt(e.target.value, 10))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-sans text-xs font-bold cursor-pointer transition-colors shadow-xs"
                            >
                              <Plus size={12} />
                              Save Skill Entry
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Display of currently added skills inside selected category */}
                      <div className="flex-1 flex flex-col min-h-0">
                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-1.5 shrink-0">
                          Active Skills ({editingCategories[selectedCategoryIdx].skills.length})
                        </span>
                        
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 h-36">
                          {editingCategories[selectedCategoryIdx].skills.length === 0 ? (
                            <p className="text-xs text-slate-400 italic font-sans text-center py-6">
                              No individual skills defined in this group yet. Add one above!
                            </p>
                          ) : (
                            editingCategories[selectedCategoryIdx].skills.map((skill, sIdx) => {
                              const prof = getSkillProficiency(skill);
                              const cleanName = getCleanSkillName(skill);
                              return (
                                <div
                                  key={`${cleanName}-${sIdx}`}
                                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 transition-colors"
                                >
                                  <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center justify-between gap-2 max-w-sm">
                                      <span className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                        {cleanName}
                                      </span>
                                      <span className="font-mono text-[10px] text-slate-450">{prof}%</span>
                                    </div>
                                    <div className="w-full max-w-sm h-1 bg-slate-250 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${prof}%` }} />
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSkill(sIdx)}
                                    className="p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 rounded-lg cursor-pointer transition-colors shrink-0"
                                    title={`Remove ${cleanName}`}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 italic text-xs py-10">
                      Select or create a capabilities group on the left.
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-red-50 hover:bg-red-550 text-red-650 hover:text-white dark:bg-red-950/40 dark:hover:bg-red-600 dark:text-red-400 font-sans font-bold rounded-lg cursor-pointer transition-colors border border-red-200/20"
                >
                  <RotateCcw size={12} />
                  Reset Defaults
                </button>

                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-755 text-slate-705 dark:text-slate-305 font-sans font-bold rounded-lg cursor-pointer transition-colors border border-slate-205 dark:border-slate-750"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAll}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-sans font-bold cursor-pointer transition-colors shadow-sm hover:shadow-md"
                  >
                    <Save size={14} />
                    Save Skills Configuration
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
