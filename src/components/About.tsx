import { motion } from "motion/react";
import { GraduationCap, Award, Calendar, BookOpen, Target, Sparkles } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

export default function About() {
  const { aboutHeading, aboutMe, location } = PORTFOLIO_DATA.personal;
  const education = PORTFOLIO_DATA.education;

  return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-[30%] left-[-10%] w-[35%] aspect-square rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
            01. Professional Bio
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Me & Education Journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Personal Story & Interests */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-4">
                <Sparkles size={22} className="shrink-0" />
                <h3 className="text-xl font-sans font-bold text-slate-900 dark:text-white">
                  Meet Naga Komala Harini
                </h3>
              </div>
              <h4 className="font-sans font-semibold text-slate-800 dark:text-slate-200 text-lg mb-3">
                {aboutHeading}
              </h4>
              <p className="font-sans text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line">
                {aboutMe}
              </p>
            </div>

            {/* Core Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-xs">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Target size={20} />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-slate-900 dark:text-white text-sm">Career Focus</h5>
                  <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Full-Stack Web Development, OOP Architecture, AI Application Integrations.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-xs">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-slate-900 dark:text-white text-sm">Academic Standings</h5>
                  <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1">
                    B.Tech Final Year Candidate. High records in labs, algorithms, and micro-projects.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Timeline Education */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl font-sans font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <GraduationCap size={24} className="text-blue-600 dark:text-blue-400" />
              Education Milestones
            </h3>

            {/* Vertical timeline */}
            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 pl-6 sm:pl-8 space-y-12 py-2">
              {education.map((edu, idx) => (
                <div key={edu.id} className="relative group">
                  {/* Timeline bullet tag */}
                  <span className="absolute -left-10 sm:-left-12 top-1 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-white dark:border-slate-900 shadow-xs flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white duration-200">
                    <GraduationCap size={15} />
                  </span>

                  {/* Card item */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-900 transition-all duration-300 hover:shadow-sm hover:border-blue-500/10">
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Calendar size={12} />
                        {edu.duration}
                      </span>
                      <span className="inline-block self-start sm:self-auto px-2.5 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-full font-mono text-xs font-semibold border border-slate-200/60 dark:border-slate-800">
                        {edu.score}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-slate-900 dark:text-white text-base">
                      {edu.degree}
                    </h4>
                    <p className="font-sans font-medium text-slate-600 dark:text-slate-300 text-sm mt-1">
                      {edu.institution}
                    </p>

                    {edu.details && (
                      <p className="font-sans text-slate-500 dark:text-slate-400 text-xs mt-3 border-t border-slate-200/30 dark:border-slate-800/30 pt-2 pb-0">
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
    </section>
  );
}
