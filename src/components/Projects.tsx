import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, ExternalLink, Leaf, Cpu, Globe, Filter, Code } from "lucide-react";
import { PORTFOLIO_DATA, Project } from "../data";

export default function Projects() {
  const projects = PORTFOLIO_DATA.projects;
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Web", "IoT / Embedded", "Environment / Social"];

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter(p => p.category === filter);

  // Return icons based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Environment / Social":
        return <Leaf size={20} className="text-emerald-500" />;
      case "IoT / Embedded":
        return <Cpu size={20} className="text-amber-500" />;
      case "Web":
      default:
        return <Globe size={20} className="text-blue-500" />;
    }
  };

  // Get stylized class for project card hover effects
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "Environment / Social":
        return "group-hover:border-emerald-500/20 group-hover:shadow-emerald-500/5";
      case "IoT / Embedded":
        return "group-hover:border-amber-500/20 group-hover:shadow-amber-500/5";
      case "Web":
      default:
        return "group-hover:border-blue-500/20 group-hover:shadow-blue-500/5";
    }
  };

  return (
    <section
      id="projects"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
            03. Practical Works
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic & Independent Projects
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2 flex items-center gap-1.5">
            <Filter size={14} /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4.5 py-1.5 rounded-full font-sans text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                filter === cat
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={project.id}
                  className="group flex flex-col justify-between h-full p-6 sm:p-7 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-900 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-800"
                >
                  <div>
                    {/* Header: Category Icon & GitHub URL */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-xs">
                        {getCategoryIcon(project.category)}
                      </div>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer"
                        title="View Github Code"
                        aria-label={`GitHub code for ${project.title}`}
                      >
                        <Github size={20} />
                      </a>
                    </div>

                    {/* Category Label */}
                    <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                      {project.category}
                    </span>

                    {/* Title */}
                    <h3 className="font-sans font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Footing detail: Tech stack list */}
                  <div className="mt-6 pt-5 border-t border-slate-200/40 dark:border-slate-800/40">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-md font-mono text-[10px] font-medium tracking-tight border border-slate-200/20 dark:border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
