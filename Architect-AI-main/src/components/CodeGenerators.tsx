import React, { useState } from "react";
import { Folder, File, Code, Cpu, Layers, Copy, Check, Terminal } from "lucide-react";
import { SpringBootCode, AngularCode } from "../types";

interface CodeGeneratorsProps {
  angularStructure: {
    folders: string[];
    files: { path: string; desc: string }[];
    samples: AngularCode[];
  };
  springbootStructure: {
    folders: string[];
    files: { path: string; desc: string }[];
    samples: SpringBootCode[];
  };
}

export function CodeGenerators({ angularStructure, springbootStructure }: CodeGeneratorsProps) {
  const [framework, setFramework] = useState<"angular" | "springboot">("springboot");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const safeAngular = {
    folders: Array.isArray(angularStructure?.folders) ? angularStructure.folders : [],
    files: Array.isArray(angularStructure?.files) ? angularStructure.files : [],
    samples: Array.isArray(angularStructure?.samples) ? angularStructure.samples : [],
  };

  const safeSpringboot = {
    folders: Array.isArray(springbootStructure?.folders) ? springbootStructure.folders : [],
    files: Array.isArray(springbootStructure?.files) ? springbootStructure.files : [],
    samples: Array.isArray(springbootStructure?.samples) ? springbootStructure.samples : [],
  };

  const currentData = framework === "angular" ? safeAngular : safeSpringboot;
  const currentSamples = currentData.samples;

  // Pick default file on framework toggle
  const firstSampleFile = currentSamples[0]?.filename;
  const activeFileName = selectedFile || firstSampleFile || "";
  const activeSample = currentSamples.find(s => s.filename === activeFileName) || currentSamples[0];

  const handleCopyCode = () => {
    if (!activeSample) return;
    navigator.clipboard.writeText(activeSample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl" id="code-generators">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Developer Code & File Tree compilers</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Physical class mappings aligning architecture bounds to actual executable artifacts packages.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-980 p-1 border border-slate-200/50 dark:border-slate-800" id="framework-selector">
          <button
            onClick={() => { setFramework("springboot"); setSelectedFile(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              framework === "springboot"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="fw-btn-springboot"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Spring Boot 3+ (Java)</span>
          </button>
          <button
            onClick={() => { setFramework("angular"); setSelectedFile(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              framework === "angular"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="fw-btn-angular"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Angular 20+ (TS)</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Physical tree directories visualizer */}
        <div className="md:col-span-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 p-4 max-h-[460px] overflow-y-auto">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Workspace Layout Directory</span>
          </span>

          <div className="space-y-4 font-mono text-[11px] leading-tight text-slate-600 dark:text-slate-350 select-none">
            {/* Folder section */}
            <div>
              <span className="text-slate-400 font-sans font-bold text-[10px] block uppercase mb-1.5 tracking-wider">Estimated Project Folders</span>
              <div className="space-y-1 pl-1">
                {currentData.folders.map((folder, folderIdx) => (
                  <div key={folderIdx} className="flex items-center gap-2.5 py-0.5">
                    <Folder className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/10 shrink-0" />
                    <span className="truncate">{folder}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable classes selecting button */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-850">
              <span className="text-slate-400 font-sans font-bold text-[10px] block uppercase mb-1.5 tracking-wider">Interactive Mapped Files</span>
              <div className="space-y-1.5">
                {currentSamples.map((sample, sampleIdx) => {
                  const isActive = activeFileName === sample.filename;
                  return (
                    <button
                      key={sampleIdx}
                      id={`file-btn-${sample.filename}`}
                      onClick={() => setSelectedFile(sample.filename)}
                      className={`w-full text-left p-2 rounded-lg border transition-all flex items-center gap-2.5 cursor-pointer ${
                        isActive 
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold" 
                          : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <File className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{sample.filename}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Code code view sandbox */}
        <div className="md:col-span-2 flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 shadow-inner">
          {activeSample ? (
            <div className="flex flex-col h-full min-h-[400px]">
              {/* Sandbox Code Header */}
              <div className="bg-slate-900/60 p-3.5 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    {activeSample.filepath}
                  </span>
                  <span className="text-xs text-slate-350 leading-none mt-1 inline-block text-slate-400">
                    {activeSample.description}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer flex items-center gap-1.5"
                  id="btn-copy-code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400 animate-scale-in" /> : <Copy className="w-4 h-4" />}
                  <span className="text-[10px] font-bold uppercase tracking-wide">{copied ? "Copied" : "Copy Source"}</span>
                </button>
              </div>

              {/* Code Pre container */}
              <div className="relative p-4 font-mono text-[11px] text-slate-200 overflow-auto h-[350px] leading-relaxed">
                <pre>{activeSample.code}</pre>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 font-sans my-auto">
              Select one class template script to view detailed Spring / Angular annotated implementation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
