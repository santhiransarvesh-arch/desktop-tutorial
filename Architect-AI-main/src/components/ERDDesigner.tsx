import React, { useState } from "react";
import { Database, FileCode, Download, Table, Eye, CheckCircle, Share2 } from "lucide-react";
import { TableInfo } from "../types";

interface ERDDesignerProps {
  mermaidEr: string;
  tables: TableInfo[];
  mysqlSchema: string;
  indexesDesc: string;
  projectName: string;
}

export function ERDDesigner({ mermaidEr, tables, mysqlSchema, indexesDesc, projectName }: ERDDesignerProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "sql" | "records">("visual");
  const [copied, setCopied] = useState(false);

  const safeTables = Array.isArray(tables) ? tables : [];

  const handleCopySql = () => {
    navigator.clipboard.writeText(mysqlSchema || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([mysqlSchema || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(projectName || "project").toLowerCase().replace(/\s+/g, "_")}_schema.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl" id="erd-designer">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Database Architect & ERD Designer</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Physical MySQL 8 tables schema generation with constraint safety cascades.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-980 p-1 border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "visual"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="erd-tab-visual"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Schema Entity Tables</span>
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "sql"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="erd-tab-sql"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>MySQL 8.0 DDL SQL</span>
          </button>
        </div>
      </div>

      {activeTab === "visual" && (
        <div className="space-y-6">
          {/* Index description summary alert */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
            <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Index Optimizations & Constraints:</span>
            {indexesDesc}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeTables.map((table, tableIdx) => (
              <div 
                key={tableIdx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm"
                id={`table-card-${table.name}`}
              >
                {/* Table header specifying keys metadata */}
                <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 p-3 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-indigo-500 flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5" />
                    <span>{table.name}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {table.columns.length} Fields
                  </span>
                </div>

                {/* Table Body listing Columns and keys */}
                <div className="divide-y divide-slate-100 dark:divide-slate-850">
                  {table.columns.map((col, colIdx) => (
                    <div key={colIdx} className="p-3 text-xs flex justify-between items-start gap-4">
                      <div>
                        <span className="font-mono font-bold text-slate-950 dark:text-slate-250 flex items-center gap-1">
                          {col.isPk && <span className="text-amber-500 font-bold" title="Primary Key">🔑</span>}
                          {col.isFk && <span className="text-emerald-500 font-bold" title="Foreign Key">🔗</span>}
                          <span>{col.name}</span>
                        </span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                          {col.desc}
                        </span>
                        {col.refTable && (
                          <span className="inline-block text-[9px] bg-slate-100 dark:bg-slate-900/80 text-slate-500 border border-slate-200 dark:border-slate-800 px-1 px-1.5 py-0.5 rounded font-mono mt-1">
                            Refers: {col.refTable}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] text-indigo-500 bg-indigo-500/5 px-1.5 py-0.5 rounded font-semibold whitespace-nowrap">
                          {col.type}
                        </span>
                        <span className="block text-[9px] text-slate-400 dark:text-slate-500 mt-1">
                          {col.nullable ? "NULL OK" : "NOT NULL"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mermaid Diagram syntax output view */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 font-mono text-[11px] text-slate-500">
            <span className="block font-sans font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">Mermaid ER Syntax Blueprint</span>
            <pre className="overflow-x-auto whitespace-pre p-2">{mermaidEr}</pre>
          </div>
        </div>
      )}

      {activeTab === "sql" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Ready to execute schema script compatible with MySQL 8.0 and above.</span>
            
            <div className="flex gap-2">
              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                id="btn-copy-ddl"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Eye className="w-4 h-4" />}
                <span>{copied ? "Copied DDL" : "Copy Schema SQL"}</span>
              </button>
              <button
                onClick={handleDownloadSql}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                id="btn-download-ddl"
              >
                <Download className="w-4 h-4" />
                <span>Download .sql File</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto h-[400px]">
            <pre className="whitespace-pre">{mysqlSchema}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
