import React, { useState } from "react";
import { Cloud, Radio, Shield, List, Copy, Check, FileCode, Server } from "lucide-react";
import { CloudNode, CloudEdge } from "../types";

interface CloudDevOpsProps {
  cloudArchitecture: {
    awsNodes: CloudNode[];
    awsEdges: CloudEdge[];
    recommendations: string[];
  };
  devops: {
    dockerfileBackend: string;
    dockerfileFrontend: string;
    kubernetesManifest: string;
    githubActions: string;
    monitoringSetup: string;
  };
}

export function CloudDevOps({ cloudArchitecture, devops }: CloudDevOpsProps) {
  const [activeTab, setActiveTab] = useState<"aws" | "docker" | "k8s" | "github" | "logs">("aws");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const safeCloudArch = {
    awsNodes: Array.isArray(cloudArchitecture?.awsNodes) ? cloudArchitecture.awsNodes : [],
    awsEdges: Array.isArray(cloudArchitecture?.awsEdges) ? cloudArchitecture.awsEdges : [],
    recommendations: Array.isArray(cloudArchitecture?.recommendations) ? cloudArchitecture.recommendations : [],
  };

  const safeDevops = {
    dockerfileBackend: devops?.dockerfileBackend || "No Dockerfile generated yet.",
    dockerfileFrontend: devops?.dockerfileFrontend || "No Dockerfile generated yet.",
    kubernetesManifest: devops?.kubernetesManifest || "No Kubernetes manifests generated yet.",
    githubActions: devops?.githubActions || "No Github Actions pipelines generated yet.",
    monitoringSetup: devops?.monitoringSetup || "No monitoring setups generated yet.",
  };

  const handleCopyText = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Static physical position coordinates layout parameters for AWS visualization nodes
  const getAWSNodeStyle = (nodeId: string) => {
    switch (nodeId) {
      case "cf": return { left: "10%", top: "70px" };
      case "s3_f": return { left: "12%", top: "210px" };
      case "alb": return { left: "37%", top: "140px" };
      case "asg": return { left: "62%", top: "140px" };
      case "rds": return { left: "85%", top: "210px" };
      case "s3_u": return { left: "85%", top: "70px" };
      default: return { left: "50%", top: "140px" };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl" id="cloud-devops">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Cloud Engineering & Global DevOps Pipelines</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">Multi-AZ AWS infrastructure topologies mappings, container assemblies, and unified CI-CD triggers.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap rounded-xl bg-slate-100 dark:bg-slate-980 p-1 border border-slate-200/50 dark:border-slate-800" id="devops-tab-nav">
          <button
            onClick={() => setActiveTab("aws")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === "aws" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            AWS Topologies
          </button>
          <button
            onClick={() => setActiveTab("docker")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === "docker" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            Docker Config
          </button>
          <button
            onClick={() => setActiveTab("k8s")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === "k8s" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            K8s Pods
          </button>
          <button
            onClick={() => setActiveTab("github")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === "github" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            Actions CI-CD
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeTab === "logs" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
          >
            Grafana Logs
          </button>
        </div>
      </div>

      {activeTab === "aws" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* AWS interactive topology diagram */}
            <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-2xl p-6 min-h-[340px] relative overflow-hidden" id="aws-canvas">
              {/* Soft grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:25px_25px] opacity-[0.04] dark:opacity-[0.1]" />

              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0">
                <defs>
                  <marker id="aws-arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
                  </marker>
                </defs>
                {/* Dynamically draw paths according to static coordinate allocations */}
                {safeCloudArch.awsEdges.map((edge, idx) => {
                  const fromStyles = getAWSNodeStyle(edge.from);
                  const toStyles = getAWSNodeStyle(edge.to);

                  const fx = parseInt(fromStyles.left) + 60;
                  const fy = parseInt(fromStyles.top) + 25;
                  const tx = parseInt(toStyles.left) + 60;
                  const ty = parseInt(toStyles.top) + 25;

                  return (
                    <line 
                      key={idx} 
                      x1={fx} y1={fy} x2={tx} y2={ty} 
                      stroke="#4f46e5" 
                      strokeWidth="1.5" 
                      strokeDasharray="4,4" 
                      markerEnd="url(#aws-arrow)" 
                    />
                  );
                })}
              </svg>

              <div className="relative w-full h-[300px]">
                {safeCloudArch.awsNodes.map((node) => {
                  const style = getAWSNodeStyle(node.id);
                  return (
                    <div
                      key={node.id}
                      style={style}
                      id={`aws-node-${node.id}`}
                      className="absolute w-[120px] p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm select-none"
                    >
                      <span className="block text-[8px] uppercase tracking-widest text-indigo-500 font-bold font-mono">
                        {node.service}
                      </span>
                      <span className="block text-[10px] text-slate-800 dark:text-slate-100 font-bold mt-1 truncate">
                        {node.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 font-mono">
                AWS Multi-AZ Redundancy Topology Architecture
              </div>
            </div>

            {/* Recommendations sidebar */}
            <div className="space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">AWS Best-Practices recommendations</span>
              <div className="space-y-3">
                {safeCloudArch.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-slate-600 dark:text-slate-350 leading-relaxed flex gap-2">
                    <Shield className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Docker backend / frontend specifications */}
      {activeTab === "docker" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Backend Dockerfile */}
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-950 p-2 px-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">Spring Boot Multi-stage Dockerfile</span>
                <button
                  onClick={() => handleCopyText(safeDevops.dockerfileBackend, "be-docker")}
                  className="p-1 rounded-md bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  id="btn-copy-be-docker"
                >
                  {copiedText === "be-docker" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileCode className="w-3.5 h-3.5" />}
                  <span>{copiedText === "be-docker" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-[10px] text-slate-300 leading-relaxed overflow-x-auto h-[320px]">
                <pre>{safeDevops.dockerfileBackend}</pre>
              </div>
            </div>

            {/* Frontend Dockerfile */}
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-950 p-2 px-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">Angular Nginx compiled Host Dockerfile</span>
                <button
                  onClick={() => handleCopyText(safeDevops.dockerfileFrontend, "fe-docker")}
                  className="p-1 rounded-md bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  id="btn-copy-fe-docker"
                >
                  {copiedText === "fe-docker" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileCode className="w-3.5 h-3.5" />}
                  <span>{copiedText === "fe-docker" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-[10px] text-slate-300 leading-relaxed overflow-x-auto h-[320px]">
                <pre>{safeDevops.dockerfileFrontend}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kubernetes Manifest spec */}
      {activeTab === "k8s" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Dual replicas configuration deploying Spring core services target pools.</span>
            <button
              onClick={() => handleCopyText(safeDevops.kubernetesManifest, "k8s")}
              className="px-3.5 py-1.5 rounded-xl border border-slate-201 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              id="btn-copy-k8s"
            >
              {copiedText === "k8s" ? <Check className="w-4 h-4 text-emerald-500" /> : <FileCode className="w-4 h-4" />}
              <span>{copiedText === "k8s" ? "Copied Manifest" : "Copy deployment.yaml"}</span>
            </button>
          </div>
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto h-[360px]">
            <pre>{safeDevops.kubernetesManifest}</pre>
          </div>
        </div>
      )}

      {/* Github Actions workflow YAML */}
      {activeTab === "github" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Push-triggered CD actions automating AWS ECR tag compilation and deployments updates.</span>
            <button
              onClick={() => handleCopyText(safeDevops.githubActions, "github")}
              className="px-3.5 py-1.5 rounded-xl border border-slate-201 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              id="btn-copy-github"
            >
              {copiedText === "github" ? <Check className="w-4 h-4 text-emerald-500" /> : <FileCode className="w-4 h-4" />}
              <span>{copiedText === "github" ? "Copied Workflow" : "Copy ciCd.yaml"}</span>
            </button>
          </div>
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto h-[360px]">
            <pre>{safeDevops.githubActions}</pre>
          </div>
        </div>
      )}

      {/* Prometheus monitor telemetry details */}
      {activeTab === "logs" && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 animate-fade-in" id="monitoring-panel">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Active Telemetry Scraper & Prometheus Actuator</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {safeDevops.monitoringSetup}
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid text-center grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Database Pool load</span>
                  <span className="block text-base font-extrabold text-emerald-500 font-mono mt-0.5">3 / 20 Units</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Actuator ping delay</span>
                  <span className="block text-base font-extrabold text-blue-500 font-mono mt-0.5">28 ms</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Container memory load</span>
                  <span className="block text-base font-extrabold text-slate-700 dark:text-slate-300 font-mono mt-0.5">242 Megs</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400">Current thread safety</span>
                  <span className="block text-base font-extrabold text-indigo-500 font-mono mt-0.5">100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
