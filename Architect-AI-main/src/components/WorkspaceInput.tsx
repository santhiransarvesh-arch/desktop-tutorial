import React, { useState } from "react";
import { Server, Users, Landmark, Scale, Cpu, Terminal, Sparkles } from "lucide-react";

interface WorkspaceInputProps {
  onGenerate: (data: {
    projectName: string;
    description: string;
    targetUsers: string;
    scale: string;
    budget: string;
    preference: string;
  }) => void;
  isLoading: boolean;
  activeStep: number;
}

export function WorkspaceInput({ onGenerate, isLoading, activeStep }: WorkspaceInputProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [targetUsers, setTargetUsers] = useState("SaaS customers & support teams");
  const [scale, setScale] = useState("10,000 monthly active users (150 concurrent)");
  const [budget, setBudget] = useState("$2,500 monthly AWS cap limit");
  const [preference, setPreference] = useState("Spring Boot 3 + Angular 20 + MySQL 8 + AWS");

  const [activeTab, setActiveTab] = useState<"custom" | "templates">("custom");

  const templates = [
    {
      name: "E-Commerce multi-vendor Platform",
      desc: "Highly robust catalog management, payment carts checkout, billing invoices, vendor portals.",
      users: "Vendors, buyers, delivery managers",
      scale: "50,000 concurrent shopping checkouts",
      budget: "$5,000 infra cost bounds",
      pref: "Spring Boot + Angular + Hibernate + AWS CloudFront/S3"
    },
    {
      name: "Hospital Clinical ERP System",
      desc: "Secure patient appointments routing, secure EMR medical histories database, billing logs tracker.",
      users: "Doctors, Patients, Receptionists",
      scale: "10,000 patient records pagination load",
      budget: "$1,500 AWS micro allocation",
      pref: "Spring Security JWT + MySQL 8 + Angular Material"
    },
    {
      name: "Decentralized Bank Ledger Engine",
      desc: "Double-entry transactional safety balance, auditing trails logs, JWT route authorization keys.",
      users: "Corporate bank customers, auditors, Admins",
      scale: "1,000 transactions per second (low latency)",
      budget: "$10,000 redundant backup systems budget",
      pref: "Event-Driven Microservices + Kafka + MySQL Cluster"
    }
  ];

  const handleApplyTemplate = (t: typeof templates[0]) => {
    setProjectName(t.name);
    setDescription(t.desc);
    setTargetUsers(t.users);
    setScale(t.scale);
    setBudget(t.budget);
    setPreference(t.pref);
    setActiveTab("custom");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !description) return;
    onGenerate({
      projectName,
      description,
      targetUsers,
      scale,
      budget,
      preference
    });
  };

  const pipelineSteps = [
    { id: 1, label: "Functional Requirements", desc: "User stories & specifications details mapping" },
    { id: 2, label: "Non-Functional Requirements", desc: "Reliability, high availability throughput bounds" },
    { id: 3, label: "Technology Config", desc: "Spring, Angular & databases configurations" },
    { id: 4, label: "Schema design", desc: "Tables schemas, indexes & constraint generation" },
    { id: 5, label: "Architecture Node Mapping", desc: "Docker orchestration & aws connections setup" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="workspace-input-container">
      {/* Tab selection to configure template easily */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "custom"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
          id="tab-custom-input"
        >
          Custom Architecture Specification
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "templates"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
          id="tab-template-input"
        >
          Enterprise Template Blueprints
        </button>
      </div>

      {activeTab === "templates" ? (
        <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
          {templates.map((t, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 transition shadow-sm hover:shadow-md flex flex-col justify-between"
              id={`template-card-${idx}`}
            >
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{t.desc}</p>
                <div className="space-y-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  <div className="flex gap-2">
                    <span className="text-slate-400">Audience:</span>
                    <span>{t.users}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-400">Scale:</span>
                    <span>{t.scale}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleApplyTemplate(t)}
                className="mt-6 w-full py-2.5 rounded-xl border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition text-xs font-semibold cursor-pointer"
                id={`apply-template-${idx}`}
              >
                Apply Parameters
              </button>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl" id="custom-gen-form">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Project Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Project Name</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. ArchitectAI, RetailSphere, CareFlow Hub"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-400"
                id="input-project-name"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Project Idea & Detailed Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Clearly state what you want to build: Core business models, critical database interactions, specific workflow operations, etc."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-400"
                id="input-project-desc"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>Target Users / Personas</span>
              </label>
              <input
                type="text"
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                placeholder="Doctors, Patients, Internal Admins"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                id="input-target-users"
              />
            </div>

            {/* Target Scale */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-purple-500" />
                <span>Expected System Scale</span>
              </label>
              <input
                type="text"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                placeholder="50,000 monthly active users"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                id="input-expected-scale"
              />
            </div>

            {/* Project Budget */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-500" />
                <span>Budget Allocations</span>
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="$50,000 capital, AWS $500 monthly limit"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                id="input-project-budget"
              />
            </div>

            {/* Technology Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Technology preferences</span>
              </label>
              <input
                type="text"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                placeholder="Spring Boot + Angular + MySQL + AWS Ready"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                id="input-tech-preference"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
            <div className="text-xs text-slate-500 max-w-sm">
              Powered by server-side Gemini 1.5 Flash compiler pipelines. Enterprise code templates generate inside active thread dynamically.
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !projectName || !description}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 active:scale-98 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              id="submit-gen-blueprint"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Compile Architecture Blueprint</span>
            </button>
          </div>
        </form>
      )}

      {/* Loading Pipelines progress animation steps */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl relative" id="pipeline-loading-dialog">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />

            <div className="text-center mb-6">
              <div className="inline-flex py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold mb-2">
                Running server-side pipeline compiler...
              </div>
              <h4 className="text-xl font-bold text-white">Synthesizing System Blueprint</h4>
              <p className="text-xs text-slate-400 mt-1">Converting descriptions into full database columns, models interfaces & multi-architecture guides.</p>
            </div>

            <div className="space-y-4">
              {pipelineSteps.map((step) => {
                const isCompleted = step.id < activeStep;
                const isActive = step.id === activeStep;
                return (
                  <div 
                    key={step.id}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
                      isCompleted 
                        ? "bg-slate-950/40 border-emerald-500/20 text-slate-300" 
                        : isActive 
                        ? "bg-indigo-950/20 border-indigo-500/60 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                        : "bg-slate-950/10 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="relative">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xs font-mono text-emerald-400">✓</div>
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-xs font-mono text-indigo-400 animate-pulse">●</div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-800/40 border border-slate-700 flex items-center justify-center text-xs font-mono text-slate-400">{step.id}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none">{step.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
