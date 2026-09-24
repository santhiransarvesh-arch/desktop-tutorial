import React, { useState } from "react";
import { Server, FileText, Check, Shield, FileCode, CheckCircle, Download } from "lucide-react";
import { ApiEndpoint } from "../types";

interface APIDesignerProps {
  apis: ApiEndpoint[];
  openApiYaml: string;
  projectName: string;
}

export function APIDesigner({ apis, openApiYaml, projectName }: APIDesignerProps) {
  const [activeTab, setActiveTab] = useState<"endpoints" | "yaml">("endpoints");
  const safeApis = Array.isArray(apis) ? apis : [];
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(safeApis[0] || null);
  const [copied, setCopied] = useState(false);

  const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET": return "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20";
      case "POST": return "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20";
      case "PUT": return "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20";
      case "DELETE": return "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(openApiYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadYaml = () => {
    const blob = new Blob([openApiYaml], { type: "text/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName.toLowerCase().replace(/\s+/g, "_")}_openapi.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl" id="api-designer">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Secured REST API Designer</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Swagger / OpenAPI enterprise structures, route constraints, and token security roles checking.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-980 p-1 border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("endpoints")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "endpoints"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="api-tab-endpoints"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Interactive Swagger UI</span>
          </button>
          <button
            onClick={() => setActiveTab("yaml")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "yaml"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="api-tab-yaml"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>OpenAPI v3.0 YAML</span>
          </button>
        </div>
      </div>

      {activeTab === "endpoints" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* List of endpoints on left */}
          <div className="lg:col-span-1 space-y-2 border-r border-slate-100 dark:border-slate-850 pr-4 max-h-[420px] overflow-y-auto">
            {safeApis.map((api, idx) => {
              const isSelected = selectedEndpoint?.path === api.path && selectedEndpoint?.method === api.method;
              return (
                <button
                  key={idx}
                  id={`api-btn-${idx}`}
                  onClick={() => setSelectedEndpoint(api)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? "bg-slate-100 dark:bg-slate-950 border-indigo-500 text-slate-950 dark:text-white font-semibold" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="block text-[10px] text-slate-400 truncate uppercase tracking-widest leading-none font-bold mb-1">
                      {api.description}
                    </span>
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-350 truncate">
                      {api.path}
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${getMethodBadgeClass(api.method)}`}>
                    {api.method}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Request Parameter panel on right */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="space-y-6" id="api-endpoint-details">
                {/* Method / Path Details Header */}
                <div className="flex flex-wrap justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-850 gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black px-2.5 py-1.5 rounded border ${getMethodBadgeClass(selectedEndpoint.method)}`}>
                      {selectedEndpoint.method}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {selectedEndpoint.path}
                    </span>
                  </div>
                  <div className="text-[10px] bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-1 rounded inline-flex items-center gap-1 font-mono font-bold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Bearer JWT Verified</span>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Security/Validation rules on left */}
                  <div className="space-y-4">
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Input constraints & Validation Rules</span>
                      <ul className="space-y-1.5">
                        {(Array.isArray(selectedEndpoint.validationRules) ? selectedEndpoint.validationRules : []).map((rule, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-350 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Endpoint Route security mapping</span>
                      <ul className="space-y-1.5">
                        {(Array.isArray(selectedEndpoint.securityRules) ? selectedEndpoint.securityRules : []).map((rule, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-350 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Body Payload Visualizer on right */}
                  <div className="space-y-4">
                    {/* Request payload */}
                    {selectedEndpoint.requestBody && (
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">REST API Request Payload Schema (CURL / Client)</span>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 font-mono text-[10px] text-green-400 max-h-[160px] overflow-y-auto leading-relaxed">
                          <pre>{selectedEndpoint.requestBody}</pre>
                        </div>
                      </div>
                    )}

                    {/* Response payload */}
                    {selectedEndpoint.responseBody && (
                      <div>
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Expected HTTP Response Body (JSON standard)</span>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 font-mono text-[10px] text-blue-400 max-h-[160px] overflow-y-auto leading-relaxed">
                          <pre>{selectedEndpoint.responseBody}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-850 rounded-xl">
                Select an entry API routemap column to preview authentication controls schemas.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "yaml" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Fully validated OpenAPI 3.0 configuration ready to import inside Swagger, Postman or Gateway routers.</span>
            
            <div className="flex gap-2">
              <button
                onClick={handleCopyYaml}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                id="btn-copy-yaml"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Shield className="w-4 h-4" />}
                <span>{copied ? "Copied YAML" : "Copy OpenAPI Config"}</span>
              </button>
              <button
                onClick={handleDownloadYaml}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                id="btn-download-yaml"
              >
                <Download className="w-4 h-4" />
                <span>Save yaml blueprint</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto h-[400px]">
            <pre className="whitespace-pre">{openApiYaml}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
