import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, ExternalLink, Filter, Star, Calendar, RefreshCw, Globe, Code2, AlertCircle } from "lucide-react";
import { PORTFOLIO_DATA } from "../data";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics?: string[];
  fork: boolean;
}

// Map Unsplash images based on repo keywords
const getRepoThumbnail = (repoName: string, language: string | null, topics: string[] = []): string => {
  const lowerName = repoName.toLowerCase();
  const lowerLang = (language || "").toLowerCase();
  const allTags = [...(topics || []).map(t => t.toLowerCase()), lowerName, lowerLang];

  if (allTags.some(t => t.includes("starbucks"))) {
    return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"; // Starbucks
  }
  if (allTags.some(t => t.includes("plant") || t.includes("green") || t.includes("environ") || t.includes("tree") || t.includes("pollution"))) {
    return "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"; // Green / Ecology
  }
  if (allTags.some(t => t.includes("fashion") || t.includes("clothing") || t.includes("store") || t.includes("shop") || t.includes("genz"))) {
    return "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"; // GENZ Fashion
  }
  if (allTags.some(t => t.includes("blood") || t.includes("donat") || t.includes("health") || t.includes("medical"))) {
    return "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"; // Donation
  }
  if (allTags.some(t => t.includes("motor") || t.includes("arduino") || t.includes("iot") || t.includes("embedded") || t.includes("speed"))) {
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"; // IoT speed control
  }

  // Fallback themes based on primary programming language
  if (lowerLang === "typescript" || lowerLang === "javascript") {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"; 
  }
  if (lowerLang === "java" || lowerLang === "python" || lowerLang === "c" || lowerLang === "c++") {
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"; 
  }
  if (lowerLang === "html" || lowerLang === "css") {
    return "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"; 
  }

  return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"; 
};

// Clean up repo name to be readable title
const formatRepoTitle = (name: string): string => {
  return name
    .split(/[-_]+/)
    .map(word => {
      const upper = word.toUpperCase();
      if (upper === "GENZ") return "GenZ";
      if (upper === "DC") return "DC";
      if (upper === "IOT") return "IoT";
      if (upper === "HTML" || upper === "CSS" || upper === "JS" || upper === "UI") return upper;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>(() => {
    const cached = localStorage.getItem("github_repos");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse cached GitHub repositories", e);
      }
    }
    // Return empty array initially, we will trigger fetch
    return [];
  });

  const [isLoading, setIsLoading] = useState(repos.length === 0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const fetchGithubRepos = async (forceSync = false) => {
    if (forceSync) {
      setIsSyncing(true);
    } else {
      setIsLoading(repos.length === 0);
    }
    setError(null);

    try {
      const response = await fetch("https://api.github.com/users/Komala193/repos?sort=updated&per_page=100");
      if (!response.ok) {
        throw new Error(`Failed to fetch from GitHub API (${response.status})`);
      }
      const data: GitHubRepo[] = await response.json();

      // Filter out forks if there are any, and sort by updated date
      const originalRepos = data
        .filter(repo => !repo.fork)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      setRepos(originalRepos);
      localStorage.setItem("github_repos", JSON.stringify(originalRepos));
    } catch (err: any) {
      console.error("Error loading GitHub repositories:", err);
      setError(err?.message || "Something went wrong while connecting to the GitHub API.");
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchGithubRepos();
  }, []);

  // Compute dynamic filter tags based on primary languages available on fetched repositories
  const availableLanguages = Array.from(
    new Set(repos.map(r => r.language).filter(Boolean))
  ) as string[];
  
  const categories = ["All", ...availableLanguages];

  const filteredRepos = filter === "All"
    ? repos
    : repos.filter(r => r.language === filter);

  return (
    <section
      id="projects"
      className="py-24 bg-white transition-colors duration-300 relative text-left glow-mask"
    >
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title & Fetch Control */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold tracking-wider text-[#374151] uppercase font-mono">
            03. Dynamic Portfolios
          </h2>
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-3xl sm:text-4xl font-sans font-extrabold text-[#111827] tracking-tight">
              GitHub Repositories Matrix
            </p>
            <button
              type="button"
              onClick={() => fetchGithubRepos(true)}
              disabled={isSyncing}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs transition-all ${
                isSyncing ? "opacity-60 cursor-not-allowed" : ""
              }`}
              title="Synchronize projects with my GitHub account"
            >
              <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Synchronizing..." : "Sync with GitHub"}
            </button>
          </div>
          <p className="mt-3 text-sm text-[#374151] leading-relaxed font-normal">
            Automatically keeping my works synchronized in real-time with my active GitHub profile (<strong>Komala193</strong>).
          </p>
        </div>

        {/* Dynamic Category Filters Bar */}
        {!isLoading && repos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            <span className="text-xs font-mono font-bold text-[#374151] uppercase tracking-widest mr-2 flex items-center gap-1.5">
              <Filter size={13} /> Filter by Language:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  filter === cat
                    ? "bg-[#2563EB] text-white border-transparent shadow-sm scale-102"
                    : "bg-white hover:bg-slate-50 text-[#374151] border-[#D1D5DB]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Error Notification Banner */}
        {error && (
          <div className="max-w-xl mx-auto p-4 mb-8 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="text-left">
              <h4 className="text-xs font-bold text-red-800">Connection Interrupted</h4>
              <p className="text-[11px] text-red-650 mt-1 leading-relaxed">
                {error}. Displaying cached content from offline session database.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Status / Loading Screen */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((skel) => (
              <div
                key={skel}
                className="flex flex-col justify-between h-[420px] bg-[#F5F7FA] rounded-2xl border border-[#D1D5DB] overflow-hidden relative animate-pulse"
              >
                <div className="aspect-video w-full bg-slate-205" />
                <div className="p-6 flex-1 space-y-4">
                  <div className="h-4 w-2/3 bg-slate-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-200 rounded" />
                    <div className="h-3 w-5/6 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="p-6 pt-0 space-y-3">
                  <div className="h-3 w-1/3 bg-slate-200 rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 bg-slate-200 rounded-xl" />
                    <div className="h-8 flex-1 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F7FA] border border-[#D1D5DB] rounded-2xl max-w-lg mx-auto">
            <Github size={40} className="mx-auto text-[#374151] mb-4 animate-bounce duration-1000" />
            <h3 className="text-base font-bold text-[#111827]">No repositories matched</h3>
            <p className="text-xs text-[#374151] mt-1.5 px-6 leading-relaxed">
              We couldn't locate any public repositories under the current language selections. Change the filter tags or trigger a sync.
            </p>
          </div>
        ) : (
          /* Repositories grid displaying loaded items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredRepos.map((repo) => {
                const thumbnail = getRepoThumbnail(repo.name, repo.language, repo.topics);
                const title = formatRepoTitle(repo.name);
                const formattedDate = new Date(repo.updated_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    key={repo.id}
                    className="group relative flex flex-col justify-between h-full bg-white rounded-2xl border border-[#D1D5DB] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-400 hover:-translate-y-1.5"
                  >
                    {/* Master click routing to the repository */}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10 cursor-pointer"
                      title={`Open ${title} GitHub Repository`}
                      aria-label={`Open repository ${title}`}
                    />

                    {/* Top Segment: Thumbnail + Meta info */}
                    <div>
                      <div className="relative aspect-video w-full overflow-hidden bg-[#F5F7FA]">
                        <img
                          src={thumbnail}
                          alt={title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {/* Dynamic Language Overlay Badge */}
                        {repo.language && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-105 bg-blue-50/95 text-[#2563EB] text-[10px] font-bold uppercase tracking-wider shadow-2xs backdrop-blur-xs">
                            <Code2 size={11} className="text-[#2563EB]" />
                            <span>{repo.language}</span>
                          </span>
                        )}

                        {/* Stars Indicator Overlay */}
                        {repo.stargazers_count > 0 && (
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-2xs">
                            <Star size={10} className="fill-white" />
                            <span>{repo.stargazers_count}</span>
                          </span>
                        )}
                      </div>

                      {/* Content: Title, Description & Stats */}
                      <div className="p-6 text-left">
                        <h3 className="font-sans font-bold text-[#111827] text-lg group-hover:text-[#2563EB] transition-colors leading-snug">
                          {title}
                        </h3>

                        <p className="font-sans text-[#374151] text-sm mt-3 leading-relaxed line-clamp-3">
                          {repo.description || "A public repository built by Komala193 showcasing responsive principles."}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Segment: Action panel & date */}
                    <div className="p-6 pt-0 mt-auto text-left relative">
                      {/* Last update metrics */}
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono mb-4">
                        <Calendar size={12} />
                        <span>Updated on {formattedDate}</span>
                      </div>

                      {/* Action trigger links */}
                      <div className="flex items-center gap-3">
                        {/* View code button */}
                        <div className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#111827] bg-white border border-[#D1D5DB] rounded-xl transition-colors shadow-2xs group-hover:bg-[#F5F7FA]">
                          <Github size={13} className="text-[#374151] shrink-0" />
                          <span>View Code</span>
                        </div>

                        {/* Interactive Live Demo Link */}
                        {repo.homepage && (
                          <a
                            href={repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              // Essential to block clicking the entire card anchor
                              e.stopPropagation();
                            }}
                            className="flex-1 relative z-20 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl cursor-pointer transition-colors shadow-sm hover:shadow-md border border-transparent"
                            title={`Open ${title} Live Deployment`}
                          >
                            <ExternalLink size={13} className="shrink-0" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
