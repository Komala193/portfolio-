import { useState } from "react";
import { motion } from "motion/react";
import { Code, Database, Wrench, Sparkles, Star } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

export default function Skills() {
  const skillCategories = PORTFOLIO_DATA.skillCategories;
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  // Return icons based on category titles
  const getCategoryIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case "programming":
        return <Code size={22} className="text-indigo-500" />;
      case "web technologies":
        return <Star size={22} className="text-sky-500" />;
      case "database":
        return <Database size={22} className="text-teal-500" />;
      case "tools & libraries":
      default:
        return <Wrench size={22} className="text-amber-500" />;
    }
  };

  // Get color themes for different cards
  const getCategoryColors = (title: string) => {
    switch (title.toLowerCase()) {
      case "programming":
        return {
          bg: "bg-indigo-50/40 dark:bg-indigo-950/10",
          borderHover: "hover:border-indigo-500/30",
          accent: "indigo",
          barBg: "bg-indigo-500",
        };
      case "web technologies":
        return {
          bg: "bg-sky-50/40 dark:bg-sky-950/10",
          borderHover: "hover:border-sky-500/30",
          accent: "sky",
          barBg: "bg-sky-500",
        };
      case "database":
        return {
          bg: "bg-teal-50/40 dark:bg-teal-950/10",
          borderHover: "hover:border-teal-500/30",
          accent: "teal",
          barBg: "bg-teal-500",
        };
      case "tools & libraries":
      default:
        return {
          bg: "bg-amber-50/40 dark:bg-slate-950/10",
          borderHover: "hover:border-amber-500/30",
          accent: "amber",
          barBg: "bg-amber-500",
        };
    }
  };

  // Mock estimated skill level ratios to render gorgeous visual indicator lines
  const getSkillProficiency = (skillName: string): number => {
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

  return (
    <section
      id="skills"
      className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Decorative back-grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
            02. Core Capabilities
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            Technical Skillset Matrix
          </p>
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
                className={`p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${
                  isHovered ? "shadow-md border-slate-300 dark:border-slate-700" : "shadow-xs"
                }`}
              >
                {/* Header card info */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {getCategoryIcon(category.title)}
                    </span>
                    <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white">
                      {category.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                    {category.skills.length} skills
                  </span>
                </div>

                {/* Grid list or bar-chart items */}
                <div className="space-y-4">
                  {category.skills.map((skill) => {
                    const prof = getSkillProficiency(skill);
                    return (
                      <div key={skill} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-sans font-semibold text-slate-800 dark:text-slate-200 text-sm">
                            {skill}
                          </span>
                          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {prof}%
                          </span>
                        </div>

                        {/* Skill bar */}
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${prof}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Design Note or summary */}
        <div className="mt-12 text-center p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl max-w-2xl mx-auto">
          <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-blue-500 shrink-0" />
            Always eager to expand this matrix. Currently learning <strong>Next.js</strong> and exploring <strong>TensorFlow</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
