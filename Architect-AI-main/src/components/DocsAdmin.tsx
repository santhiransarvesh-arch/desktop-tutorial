import React, { useState, useEffect } from "react";
import { FileText, Printer, MessageSquare, Send, BarChart2, Zap, Server, Code, Layers } from "lucide-react";

interface Comment {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}

interface AnalyticsStats {
  totalUsers: number;
  projectsGenerated: number;
  aiRequests: number;
  popularTech: Array<{ name: string; value: number }>;
  monthlyUsage: Array<{ month: string; requests: number }>;
}

interface DocsAdminProps {
  documentation: {
    srs: string;
    technicalDesign: string;
    apiDoc: string;
    databaseDoc: string;
    deploymentGuide: string;
  };
  projectId: string;
  currentUsername: string;
}

export function DocsAdmin({ documentation, projectId, currentUsername }: DocsAdminProps) {
  const [activeTab, setActiveTab ] = useState<"docs" | "collab" | "analytics">("docs");
  const [activeDoc, setActiveDoc] = useState<"srs" | "tdd" | "api" | "db" | "deploy">("srs");
  
  // Collaboration states
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState(currentUsername || "AnoymousDev");
  const [cmtLoading, setCmtLoading] = useState(false);

  // Analytics states
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);

  // Load comments
  const loadComments = () => {
    fetch(`/api/projects/${projectId}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.warn("Error loading comments", err));
  };

  // Load Admin statistical indices
  const loadAnalytics = () => {
    fetch(`/api/analytics`)
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.warn("Error loading analytics stats", err));
  };

  useEffect(() => {
    loadComments();
    loadAnalytics();
  }, [projectId]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCmtLoading(true);

    fetch(`/api/projects/${projectId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: commentAuthor,
        text: commentText
      })
    })
      .then(res => res.json())
      .then(comment => {
        setComments(prev => [...prev, comment]);
        setCommentText("");
        setCmtLoading(false);
      })
      .catch(() => setCmtLoading(false));
  };

  const getDocText = () => {
    switch (activeDoc) {
      case "srs": return documentation.srs;
      case "tdd": return documentation.technicalDesign;
      case "api": return documentation.apiDoc;
      case "db": return documentation.databaseDoc;
      case "deploy": return documentation.deploymentGuide;
    }
  };

  const handlePrint = () => {
    // Elegant standard printable view in new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${activeDoc.toUpperCase()} Specification Document</title>
          <style>
            body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { font-size: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
            h2 { font-size: 18px; margin-top: 24px; }
            pre { background: #f1f5f9; padding: 16px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>ArchitectAI - Certified Project Blueprints Documentation</h1>
          <div style="font-size: 11px; font-weight: bold; color: #64748b; margin-bottom: 24px;">Generated on 2026-06-07 by ${currentUsername}</div>
          <pre>${getDocText()}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl" id="docs-admin">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-505 dark:text-indigo-400 animate-pulse" />
            <span>AI Knowledge Base & Admin Instrumentation</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">SRS manual exports, collaborative team discussion walls, and active pipeline metrics indicators.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-980 p-1 border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("docs")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "docs" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            Blueprints SRS Docs
          </button>
          <button
            onClick={() => setActiveTab("collab")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "collab" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            Team Feed Comments
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "analytics" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            Admin Usage Dashboard
          </button>
        </div>
      </div>

      {activeTab === "docs" && (
        <div className="grid gap-6 md:grid-cols-4">
          {/* Docs Selector column on left */}
          <div className="md:col-span-1 space-y-1 border-r border-slate-100 dark:border-slate-850 pr-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Available manual topics</span>
            <button
              onClick={() => setActiveDoc("srs")}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeDoc === "srs" ? "bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
              }`}
            >
              Requirements Spec (SRS)
            </button>
            <button
              onClick={() => setActiveDoc("tdd")}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeDoc === "tdd" ? "bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
              }`}
            >
              Technical Design (TDD)
            </button>
            <button
              onClick={() => setActiveDoc("api")}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeDoc === "api" ? "bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
              }`}
            >
              REST APIs Guide
            </button>
            <button
              onClick={() => setActiveDoc("db")}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeDoc === "db" ? "bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
              }`}
            >
              Database Keys Indices
            </button>
            <button
              onClick={() => setActiveDoc("deploy")}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeDoc === "deploy" ? "bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
              }`}
            >
              AWS System Host Manual
            </button>

            <div className="pt-6">
              <button
                onClick={handlePrint}
                className="w-full py-2 rounded-xl bg-slate-900 border border-slate-705 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800 transition"
                id="btn-print-doc"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>

          {/* Formatted Manual Text pane on right */}
          <div className="md:col-span-3 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-850 h-[380px] overflow-y-auto leading-relaxed text-xs text-slate-700 dark:text-slate-300">
            <div className="relative font-mono whitespace-pre-wrap">{getDocText()}</div>
          </div>
        </div>
      )}

      {activeTab === "collab" && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Post Comment form panel on left */}
          <div className="md:col-span-1 space-y-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Collaborative Board comment feed</span>
            <form onSubmit={handlePostComment} className="space-y-3.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-201 dark:border-slate-850">
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Handle Author name</label>
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500">Proposed Comment / Architectural Suggestion</label>
                <textarea
                  required
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ask a technical team question, propose a framework modification..."
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs leading-normal focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={cmtLoading || !commentText.trim()}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                id="btn-submit-comment"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </form>
          </div>

          {/* Comments messages list on right */}
          <div className="md:col-span-2 space-y-3 max-h-[380px] overflow-y-auto pr-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Discussion Threads</span>
            {comments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-805 rounded-xl bg-slate-50 dark:bg-transparent">
                No telemetry comments yet. Be the first to start collaboration discussion loops.
              </div>
            ) : (
              comments.map((cmt) => (
                <div key={cmt.id} className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{cmt.username}</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(cmt.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-1">{cmt.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6 animate-fade-in" id="admin-analytics-tab">
          {analytics ? (
            <div className="space-y-6">
              {/* Core Index counters cards */}
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl flex items-center gap-3">
                  <BarChart2 className="w-5 h-5 text-indigo-500" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">Total Generated</span>
                    <span className="block text-base font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{analytics.projectsGenerated} Blueprints</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">AI Request volume</span>
                    <span className="block text-base font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{analytics.aiRequests} Calls</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-500" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">Active server pools</span>
                    <span className="block text-base font-extrabold text-slate-900 dark:text-white mt-1 font-mono">{analytics.totalUsers} instances</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl flex items-center gap-3">
                  <Code className="w-5 h-5 text-purple-500" />
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">Spring/Angular rates</span>
                    <span className="block text-base font-extrabold text-slate-900 dark:text-white mt-1 font-mono">99.8% Success</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG monthly usage stats chart */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/60 dark:border-slate-850 rounded-xl">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Pipeline Requests Flow index</span>
                  
                  {/* Clean SVG Trend Loop Graph */}
                  <div className="w-full h-44 relative">
                    <svg className="w-full h-full">
                      <defs>
                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Guide lines */}
                      <line x1="10%" y1="20%" x2="95%" y2="20%" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="10%" y1="50%" x2="95%" y2="50%" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="10%" y1="80%" x2="95%" y2="80%" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="3,3" />

                      {/* Smooth Path plot */}
                      <path 
                        d="M 40 130 Q 100 110 160 85 T 280 40 T 360 20 L 360 150 L 40 150 Z" 
                        fill="url(#chart-grad)" 
                      />
                      <path 
                        d="M 40 130 Q 100 110 160 85 T 280 40 T 360 20" 
                        fill="transparent" 
                        stroke="#2563eb" 
                        strokeWidth="3.5" 
                      />

                      {/* Dots */}
                      <circle cx="40" cy="130" r="5" fill="#3b82f6" />
                      <circle cx="120" cy="100" r="5" fill="#3b82f6" />
                      <circle cx="200" cy="80" r="5" fill="#3b82f6" />
                      <circle cx="280" cy="40" r="5" fill="#3b82f6" />
                      <circle cx="360" cy="20" r="5" fill="#3b82f6" />
                    </svg>

                    {/* Chart axis label markings */}
                    <div className="absolute bottom-1 w-full flex justify-between px-6 text-[8px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                      <span>Jan (45)</span>
                      <span>Feb (58)</span>
                      <span>Mar (80)</span>
                      <span>Apr (95)</span>
                      <span>May (120)</span>
                    </div>
                  </div>
                </div>

                {/* Popular tech breakdown rows */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/60 dark:border-slate-850 rounded-xl">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Popular blueprint structures ratio</span>
                  
                  <div className="space-y-4">
                    {analytics.popularTech.map((tech, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-350">
                          <span className="flex items-center gap-1.5">
                            {idx === 0 && <Server className="w-3.5 h-3.5 text-blue-500" />}
                            {idx === 1 && <Layers className="w-3.5 h-3.5 text-red-500" />}
                            {idx === 2 && <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />}
                            {idx === 3 && <Zap className="w-3.5 h-3.5 text-purple-500" />}
                            <span>{tech.name}</span>
                          </span>
                          <span className="font-mono">{tech.value}%</span>
                        </div>
                        {/* Horizontal Bar */}
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-red-500" : idx === 2 ? "bg-indigo-500" : "bg-purple-500"
                            }`}
                            style={{ width: `${tech.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-805 rounded-xl">
              Syncing analytics from node-express data files database...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
