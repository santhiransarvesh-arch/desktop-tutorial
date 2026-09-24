import React, { useState } from "react";
import { FolderGit, Search, Trash2, Copy, FileText, Download } from "lucide-react";
import { ProjectHistoryItem } from "../types";

interface ProjectHistoryProps {
  projects: ProjectHistoryItem[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCloneProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectHistory({ projects, activeProjectId, onSelectProject, onCloneProject, onDeleteProject }: ProjectHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.projectName.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.preference && p.preference.toLowerCase().includes(query))
    );
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl space-y-4" id="project-history">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <FolderGit className="w-5 h-5 text-indigo-500 animate-pulse" />
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Blueprints Vault</h4>
          <span className="text-[10px] text-slate-500 font-mono text-xs">{projects.length} saved schemas</span>
        </div>
      </div>

      {/* Search Input bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 /80 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-slate-400"
          id="search-projects"
        />
      </div>

      {/* Blueprints history list */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-805 rounded-xl bg-slate-50 dark:bg-transparent">
            No projects found in vault matching metrics filters.
          </div>
        ) : (
          filteredProjects.map((p) => {
            const isActive = activeProjectId === p.id;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isActive 
                    ? "bg-indigo-500/10 border-indigo-500 shadow-sm" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/50"
                }`}
                id={`history-item-${p.id}`}
              >
                <div>
                  <button
                    onClick={() => onSelectProject(p.id)}
                    className="w-full text-left font-bold text-xs text-slate-900 dark:text-slate-100 truncate hover:text-indigo-500 cursor-pointer"
                  >
                    {p.projectName}
                  </button>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                  <span className="inline-block mt-2 font-mono text-[9px] text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Clone / Delete operations row */}
                <div className="flex justify-end gap-1.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => onCloneProject(p.id)}
                    title="Clone project schema structure"
                    className="p-1 px-1.5 py-1 rounded-md bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 text-[9px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition cursor-pointer"
                    id={`btn-clone-${p.id}`}
                  >
                    <Copy className="w-3 h-3" />
                    <span>Clone</span>
                  </button>
                  <button
                    onClick={() => onDeleteProject(p.id)}
                    title="Delete project blueprint and comments history"
                    className="p-1 px-1.5 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-[9px] font-bold text-red-500 flex items-center gap-1 transition cursor-pointer"
                    id={`btn-delete-${p.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
