import React, { useState, useEffect } from "react";
import { ParticleBackground } from "./components/ParticleBackground";
import { LandingHero } from "./components/LandingHero";
import { AuthModal } from "./components/AuthModal";
import { WorkspaceInput } from "./components/WorkspaceInput";
import { ArchitectureModule } from "./components/ArchitectureModule";
import { ERDDesigner } from "./components/ERDDesigner";
import { APIDesigner } from "./components/APIDesigner";
import { CodeGenerators } from "./components/CodeGenerators";
import { CloudDevOps } from "./components/CloudDevOps";
import { RoadmapCosts } from "./components/RoadmapCosts";
import { DocsAdmin } from "./components/DocsAdmin";
import { ProjectHistory } from "./components/ProjectHistory";
import { GoogleMascotFace } from "./components/GoogleMascotFace";
import { ArchitecturePayload } from "./types";
import { 
  Sun, Moon, ShieldCheck, Terminal, FolderGit, 
  Layers, Database, Server, Code, Cloud, Calendar, 
  FileText, LogOut, ChevronRight, Share2, Sparkles, Check
} from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [user, setUser] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Repository list of generated projects
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [activeProject, setActiveProject] = useState<ArchitecturePayload & { id: string } | null>(null);

  // Active workspace modules view: "architecture" | "database" | "apis" | "code" | "devops" | "roadmap" | "docs"
  const [activeModule, setActiveModule] = useState<
    "architecture" | "database" | "apis" | "code" | "devops" | "roadmap" | "docs"
  >("architecture");

  // Admin stats totals representation
  const [stats, setStats] = useState({
    totalUsers: 1420,
    projectsGenerated: 18,
    aiRequests: 128
  });

  const [copiedLink, setCopiedLink] = useState(false);

  // Sync theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("arch-theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const savedUser = localStorage.getItem("arch-user");
    if (savedUser) {
      setUser(savedUser);
    }

    // Load available histories
    loadProjectsHistory();
    loadAnalyticsStats();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("arch-theme", theme);
  }, [theme]);

  const loadProjectsHistory = () => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjectsList(data);
        if (data.length > 0 && !activeProject) {
          // Default load the first available project in list
          setActiveProject(data[0]);
        }
      })
      .catch((err) => console.warn("Error loading projects history list", err));
  };

  const loadAnalyticsStats = () => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalUsers: data.totalUsers,
          projectsGenerated: data.projectsGenerated,
          aiRequests: data.aiRequests
        });
      })
      .catch((err) => console.warn("Error loading statistics", err));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleAuthSuccess = (username: string) => {
    setUser(username);
    localStorage.setItem("arch-user", username);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("arch-user");
  };

  // Compile prompt payload using step progress loops
  const handleGenerateArchitecture = (data: {
    projectName: string;
    description: string;
    targetUsers: string;
    scale: string;
    budget: string;
    preference: string;
  }) => {
    setIsLoading(true);
    setActiveStep(1);

    // Run custom step timers on clients before parsing backend api output maps
    const intv = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 5) {
          clearInterval(intv);
          return 5;
        }
        return prev + 1;
      });
    }, 1300);

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((projectPayload) => {
        clearInterval(intv);
        setActiveStep(5);
        setTimeout(() => {
          setIsLoading(false);
          setActiveProject(projectPayload);
          setActiveModule("architecture");
          // Re-sync lists
          loadProjectsHistory();
          loadAnalyticsStats();
        }, 800);
      })
      .catch((err) => {
        clearInterval(intv);
        setIsLoading(false);
        console.warn("Generation error occurred", err);
      });
  };

  // Project cloning and deletion state handlers
  const handleSelectProject = (projectId: string) => {
    const selected = projectsList.find((p) => p.id === projectId);
    if (selected) {
      setActiveProject(selected);
    }
  };

  const handleCloneProject = (projectId: string) => {
    fetch("/api/projects/clone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId })
    })
      .then((res) => res.json())
      .then((cloned) => {
        setActiveProject(cloned);
        loadProjectsHistory();
      })
      .catch((err) => console.warn("Error cloning project", err));
  };

  const handleDeleteProject = (projectId: string) => {
    fetch(`/api/projects/${projectId}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then(() => {
        if (activeProject?.id === projectId) {
          setActiveProject(null);
        }
        loadProjectsHistory();
      })
      .catch((err) => console.warn("Error deleting project", err));
  };

  const handleSuggest = (suggestion: string) => {
    handleGenerateArchitecture({
      projectName: suggestion,
      description: `Build an enterprise highly scalable ${suggestion} targeting international audience. Build microservices models schemas, JPA repository files mapping and cloud configurations.`,
      targetUsers: "Global user segments",
      scale: "100k daily checkouts",
      budget: "$5,000 monthly Amazon allocation target",
      preference: "Spring Boot 3 + Angular 20 + MySQL 8 + AWS Multi-AZ"
    });
  };

  const handleShareProject = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-[#020617] text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans relative overflow-x-hidden ${theme === "light" ? "light-bg" : "dark-bg"}`} id="architecture-app-root">
      
      {/* Decorative starry background nodes canvasses */}
      <ParticleBackground />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-900/80 py-4 px-4 shadow-[0_2px_20px_-2px_rgba(0,0,0,0.02)]" id="platform-header">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <GoogleMascotFace className="w-10 h-10 shrink-0" />
            <div>
              <span className="font-black text-lg md:text-xl tracking-tight text-slate-900 dark:text-white font-mono flex items-center gap-1.5 leading-none">
                <h1>AI Software Architect</h1>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded px-1.5 py-0.5 uppercase tracking-wider font-extrabold font-sans">Core v2</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-semibold font-mono mt-0.5">Enterprise Software Planner</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* System Ingress Indicators */}
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-bold bg-slate-100/50 dark:bg-slate-900/60 p-1.5 px-3 rounded-full border border-slate-200/60 dark:border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Container Port Active: 3000</span>
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              title="Toggle Theme Preset Colors"
              id="btn-theme-toggle"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User Profile Avatar Controls */}
            {user ? (
              <div className="flex items-center gap-2" id="user-profile-badge">
                <div className="text-right hidden sm:block">
                  <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">{user}</span>
                  <span className="block text-[9px] text-slate-400 font-semibold">Active Architect</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-indigo-800 text-white font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                  {user.substring(0, 2).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out Developer Profile"
                  className="p-2 ml-1 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-slate-400 transition cursor-pointer"
                  id="btn-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-4.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-md hover:opacity-90 active:scale-98 transition flex items-center gap-1.5 cursor-pointer"
                id="btn-trigger-login"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Developer Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-[1400px] mx-auto w-full px-4 flex-grow py-6" id="main-app-host">
        {!activeProject ? (
          /* Landing view when no project structure generated/loaded */
          <div className="space-y-6 animate-fade-in" id="landing-screen">
            <LandingHero 
              onSuggest={handleSuggest} 
              onOpenNewProject={() => {
                // Initialize default project setup params directly
                handleGenerateArchitecture({
                  projectName: "Hospital Management EMR",
                  description: "Full service platform orchestrating clinical appointments routing logs, doctor profiles catalogs, data analytics indexes, and security credentials separation.",
                  targetUsers: "Clinical staff, patients, medical team",
                  scale: "50,000 active monthly user records",
                  budget: "$1,500 monthly Amazon billing limit",
                  preference: "Spring Boot 3 + Angular 20 + MySQL 8 + AWS Multi-AZ"
                });
              }}
              stats={stats} 
            />
          </div>
        ) : (
          /* Main AI Active Workspace Dashboard with lateral parameters control panel */
          <div className="grid gap-6 lg:grid-cols-4 animate-scale-up" id="developer-workspace">
            
            {/* Sidebar Columns: Project Vault & Specification Parameters form trigger */}
            <div className="lg:col-span-1 space-y-6">
              {/* Project Specifications Info Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden" id="project-meta-details-card">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl -z-10" />

                <div>
                  <span className="text-[9px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-widest font-mono">Active Sandbox</span>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white mt-2 leading-snug truncate" title={activeProject.projectName}>
                    {activeProject.projectName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                    {activeProject.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2 text-[10px] font-semibold text-slate-500 leading-none">
                  <div className="flex justify-between">
                    <span>Target Scale:</span>
                    <span className="text-slate-900 dark:text-slate-350 truncate max-w-[120px]" title={activeProject.scale}>{activeProject.scale}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Infrastructure Limit:</span>
                    <span className="text-slate-905 dark:text-slate-350 truncate max-w-[120px]" title={activeProject.budget}>{activeProject.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preferences:</span>
                    <span className="text-indigo-500 font-bold truncate max-w-[120px]" title={activeProject.preference}>{activeProject.preference}</span>
                  </div>
                </div>

                {/* Compile New Blueprint Trigger */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => setActiveProject(null)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-indigo-500/40 text-indigo-500 hover:bg-indigo-500/5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    id="btn-re-architect"
                  >
                    <Terminal className="w-4 h-4 rotate-90" />
                    <span>Re-Architect New Project</span>
                  </button>
                </div>
              </div>

              {/* Blueprints Vault history panel */}
              <ProjectHistory
                projects={projectsList}
                activeProjectId={activeProject.id}
                onSelectProject={handleSelectProject}
                onCloneProject={handleCloneProject}
                onDeleteProject={handleDeleteProject}
              />
            </div>

            {/* Dashboard Workspace View: Mapped Tabs navigation & Display panel */}
            <div className="lg:col-span-3 space-y-4">
              {/* Module Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-900 pb-2">
                <div className="flex flex-wrap gap-1.5" id="workspace-module-navigation-tabs">
                  <button
                    onClick={() => setActiveModule("architecture")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeModule === "architecture"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50"
                    }`}
                    id="module-tab-architecture"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Multi-Arch Nodes</span>
                  </button>
                  <button
                    onClick={() => setActiveModule("database")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeModule === "database"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50"
                    }`}
                    id="module-tab-database"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>ERD & SQL tables</span>
                  </button>
                  <button
                    onClick={() => setActiveModule("apis")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeModule === "apis"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50"
                    }`}
                    id="module-tab-apis"
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>REST API Specs</span>
                  </button>
                  <button
                    onClick={() => setActiveModule("code")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeModule === "code"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50"
                    }`}
                    id="module-tab-code"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>File Tree Templates</span>
                  </button>
                  <button
                    onClick={() => setActiveModule("devops")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeModule === "devops"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50"
                    }`}
                    id="module-tab-devops"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>AWS Infra CD</span>
                  </button>
                  <button
                    onClick={() => setActiveModule("roadmap")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeModule === "roadmap"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50"
                    }`}
                    id="module-tab-roadmap"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Timeline Fees</span>
                  </button>
                  <button
                    onClick={() => setActiveModule("docs")}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeModule === "docs"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50"
                    }`}
                    id="module-tab-docs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Knowledge Admin</span>
                  </button>
                </div>

                {/* Team Share Link */}
                <button
                  onClick={handleShareProject}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                  id="btn-share-project"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Link Copied" : "Share Blueprint"}</span>
                </button>
              </div>

              {/* Conditional Active views representation panels */}
              <div className="transition-all duration-300">
                {activeModule === "architecture" && (
                  <ArchitectureModule
                    monolith={activeProject.monolith}
                    microservices={activeProject.microservices}
                    eventDriven={activeProject.eventDriven}
                  />
                )}

                {activeModule === "database" && (
                  <ERDDesigner
                    mermaidEr={activeProject.mermaidEr}
                    tables={activeProject.tables}
                    mysqlSchema={activeProject.mysqlSchema}
                    indexesDesc={activeProject.indexesDesc}
                    projectName={activeProject.projectName}
                  />
                )}

                {activeModule === "apis" && (
                  <APIDesigner
                    apis={activeProject.apis}
                    openApiYaml={activeProject.openApiYaml}
                    projectName={activeProject.projectName}
                  />
                )}

                {activeModule === "code" && (
                  <CodeGenerators
                    angularStructure={activeProject.angularStructure}
                    springbootStructure={activeProject.springbootStructure}
                  />
                )}

                {activeModule === "devops" && (
                  <CloudDevOps
                    cloudArchitecture={activeProject.cloudArchitecture}
                    devops={activeProject.devops}
                  />
                )}

                {activeModule === "roadmap" && (
                  <RoadmapCosts
                    roadmap={activeProject.roadmap}
                    cost={activeProject.cost}
                  />
                )}

                {activeModule === "docs" && (
                  <DocsAdmin
                    documentation={activeProject.documentation}
                    projectId={activeProject.id}
                    currentUsername={user || "AnonymousDev"}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer System details */}
      <footer className="w-full bg-slate-100/50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-900/80 py-4 px-4 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 font-mono tracking-wide" id="platform-footer">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>© 2026 ArchitectAI platform. Built securely for Google AI Studio Final project assessment.</span>
          <span className="flex items-center gap-1.5 uppercase font-extrabold text-blue-500">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span>Systems online and verified</span>
          </span>
        </div>
      </footer>

      {/* Conditional Authentication credentials modal triggers */}
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}

      {/* Full physical compiling pipelines loader */}
      <WorkspaceInput
        onGenerate={handleGenerateArchitecture}
        isLoading={isLoading}
        activeStep={activeStep}
      />
    </div>
  );
}
