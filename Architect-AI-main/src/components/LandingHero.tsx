import React from "react";
import { Sparkles, Terminal, Activity, Layers, Server, ShieldAlert } from "lucide-react";
import { GoogleMascotFace } from "./GoogleMascotFace";

interface LandingHeroProps {
  onSuggest: (suggestion: string) => void;
  onOpenNewProject: () => void;
  stats: {
    totalUsers: number;
    projectsGenerated: number;
    aiRequests: number;
  };
}

export function LandingHero({ onSuggest, onOpenNewProject, stats }: LandingHeroProps) {
  const suggestions = [
    { title: "E-Commerce Microservices", desc: "Scale to millions of users with payment integrations" },
    { title: "Hospital Management System", desc: "Secure multi-tenant clinical records and appointments" },
    { title: "Food Delivery Platform", desc: "Event-driven dispatch driver routing with spatial queries" },
    { title: "Decentralized Banking App", desc: "Double-entry ledge account audit paths, high throughput" },
    { title: "SaaS AI Copilot Workspace", desc: "Realtime collaboration with dynamic vector databases" }
  ];

  return (
    <div className="relative py-12 md:py-20 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background radial soft light blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-full blur-[100px] -z-10 animate-pulse duration-[10000ms]" />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 p-1.5 pr-3.5 rounded-full bg-slate-900/60 dark:bg-white/10 border border-slate-700/50 dark:border-white/10 backdrop-blur-xl text-xs font-semibold text-blue-400 dark:text-blue-300 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
        <GoogleMascotFace className="w-6 h-6 shrink-0" />
        <span>V2.4 Enterprise Blueprint Generator</span>
      </div>

      {/* Main headings */}
      <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl line-clamp-2 leading-tight md:leading-[1.1]">
        Describe Your Idea.<br />
        <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Get a Complete Software Architecture.
        </span>
      </h1>

      <p className="mt-6 text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-light leading-relaxed">
        Instantly compile enterprise-grade database schemas, ER diagrams, REST API specs, Spring Boot architectures, Angular modules, and cloud deployment guides.
      </p>

      {/* CTA Trigger */}
      <div className="mt-10 flex flex-wrap gap-4 items-center justify-center">
        <button
          onClick={onOpenNewProject}
          className="relative group overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2"
          id="btn-get-started"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <Terminal className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Launch AI Workspace</span>
        </button>
      </div>

      {/* Suggested Input Prompt Suggestions */}
      <div className="mt-16 w-full max-w-3xl">
        <div className="text-left mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Select an enterprise candidate blueprint to begin</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {suggestions.slice(0, 3).map((sugg, idx) => (
            <button
              key={idx}
              id={`suggest-btn-${idx}`}
              onClick={() => onSuggest(sugg.title)}
              className="group text-left p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 shadow-[0_4px_24px_-1px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(59,130,246,0.06)] scale-100 hover:scale-[1.02]"
            >
              <span className="block font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors text-sm">
                {sugg.title}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {sugg.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Premium Statistics Banner */}
      <div className="mt-20 w-full max-w-4xl grid grid-cols-3 gap-4 md:gap-8 border-y border-slate-200/60 dark:border-slate-800/80 py-8 text-center bg-slate-50/40 dark:bg-transparent rounded-2xl">
        <div>
          <span className="block text-2xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {stats.projectsGenerated}
          </span>
          <span className="block text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Architectures Generated
          </span>
        </div>
        <div>
          <span className="block text-2xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {stats.aiRequests}
          </span>
          <span className="block text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            API Endpoints Analyzed
          </span>
        </div>
        <div>
          <span className="block text-2xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.totalUsers}
          </span>
          <span className="block text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Active Engineers
          </span>
        </div>
      </div>
    </div>
  );
}
