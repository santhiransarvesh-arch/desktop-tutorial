import React, { useState } from "react";
import { Server, Grid, Zap, Layers, Network, ChevronRight } from "lucide-react";
import { ArchitectureNode, ArchitectureEdge } from "../types";

interface ArchitectureModuleProps {
  monolith: {
    description: string;
    diagramNodes: ArchitectureNode[];
    diagramEdges: ArchitectureEdge[];
  };
  microservices: {
    description: string;
    diagramNodes: ArchitectureNode[];
    diagramEdges: ArchitectureEdge[];
  };
  eventDriven: {
    description: string;
    diagramNodes: ArchitectureNode[];
    diagramEdges: ArchitectureEdge[];
  };
}

export function ArchitectureModule({ monolith, microservices, eventDriven }: ArchitectureModuleProps) {
  const [activeArch, setActiveArch] = useState<"monolith" | "microservices" | "eventDriven">("microservices");
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);

  const getArchData = () => {
    switch (activeArch) {
      case "monolith": return monolith;
      case "microservices": return microservices;
      case "eventDriven": return eventDriven;
    }
  };

  const rawData = getArchData();
  const data = {
    description: rawData?.description || "No architecture description generated yet.",
    diagramNodes: Array.isArray(rawData?.diagramNodes) ? rawData.diagramNodes : [],
    diagramEdges: Array.isArray(rawData?.diagramEdges) ? rawData.diagramEdges : [],
  };

  // Draw elegant positions for nodes for display purely inside a stylish CSS container
  const getNodeStyles = (index: number, total: number) => {
    // Spread nodes in a clean balanced network design
    const angles = [0, 45, -45, 135, -135, 90, -90];
    const angle = angles[index % angles.length];
    const radius = 130;
    const x = Math.cos((angle * Math.PI) / 180) * radius + 180;
    const y = Math.sin((angle * Math.PI) / 180) * radius + 140;

    // Standard linear chain fallback for monolith or smaller arrays
    if (total <= 3) {
      return {
        left: `${index * 130 + 60}px`,
        top: `120px`
      };
    }

    return {
      left: `${x}px`,
      top: `${y}px`
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl" id="architecture-module">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Multi-Paradigm System Architectures</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Toggle between structural models depending on your scale and complexity tradeoffs.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-980 p-1 border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => { setActiveArch("monolith"); setSelectedNode(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeArch === "monolith"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="arch-tab-monolith"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Monolithic</span>
          </button>
          <button
            onClick={() => { setActiveArch("microservices"); setSelectedNode(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeArch === "microservices"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="arch-tab-microservices"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Microservices</span>
          </button>
          <button
            onClick={() => { setActiveArch("eventDriven"); setSelectedNode(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeArch === "eventDriven"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="arch-tab-eventdriven"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Event-Driven</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Visual Graph Area with interactive nodes */}
        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-850 p-6 relative overflow-hidden min-h-[360px] flex items-center justify-center">
          {/* Decorative glowing grid bg */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:30px_30px] opacity-[0.03] dark:opacity-[0.15]" />

          {/* Render SVG connection paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 dark:opacity-85 z-0" id="arch-connection-svg">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
              </marker>
            </defs>
            {/* Draw direct connecting loops between visual locations */}
            {data.diagramEdges.map((edge, idx) => {
              const fromIdx = data.diagramNodes.findIndex(n => n.id === edge.from);
              const toIdx = data.diagramNodes.findIndex(n => n.id === edge.to);
              
              if (fromIdx === -1 || toIdx === -1) return null;

              // Calculate styled line positions
              const fromStyles = getNodeStyles(fromIdx, data.diagramNodes.length);
              const toStyles = getNodeStyles(toIdx, data.diagramNodes.length);

              const fx = parseInt(fromStyles.left) + 65;
              const fy = parseInt(fromStyles.top) + 25;
              const tx = parseInt(toStyles.left) + 65;
              const ty = parseInt(toStyles.top) + 25;

              return (
                <g key={idx}>
                  <line 
                    x1={fx} y1={fy} x2={tx} y2={ty} 
                    stroke="url(#line-glow)" 
                    strokeWidth="2" 
                    markerEnd="url(#arrow)"
                    className="stroke-indigo-400 dark:stroke-indigo-500/50"
                  />
                  {/* Subtle pulsing dot navigating on line */}
                  <circle r="3" fill="#818cf8" className="animate-ping" style={{ motionPath: `path('M ${fx} ${fy} L ${tx} ${ty}')`, animationDuration: '3s' }} />
                </g>
              );
            })}
            <linearGradient id="line-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </svg>

          {/* Interactive node elements */}
          <div className="relative w-full h-[320px] z-10">
            {data.diagramNodes.map((node, idx) => {
              const styles = getNodeStyles(idx, data.diagramNodes.length);
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  id={`arch-node-${node.id}`}
                  onClick={() => setSelectedNode(node)}
                  style={styles}
                  className={`absolute w-[130px] p-2.5 rounded-xl border text-center transition-all duration-300 transform scale-100 active:scale-95 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25 z-30"
                      : "bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 text-slate-800 dark:text-slate-100 shadow-sm z-20"
                  }`}
                >
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 truncate">
                    {node.type}
                  </span>
                  <span className="block text-xs font-bold mt-1 truncate">
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 font-mono">
            💡 Tip: Click on any system node to inspect telemetry bounds & details.
          </div>
        </div>

        {/* Node Side Panel Description Drawer */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <span className="font-bold block text-slate-900 dark:text-white mb-1 uppercase tracking-wide">Paradigm Overview</span>
              {data.description}
            </div>

            {selectedNode ? (
              <div className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in" id="node-details-drawer">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] font-mono font-semibold uppercase">
                  {selectedNode.type}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">{selectedNode.label}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {selectedNode.details}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                  <div>
                    <span>Proxy Path:</span>
                    <span className="block text-slate-700 dark:text-slate-300">/api/v1/{selectedNode.id}</span>
                  </div>
                  <div>
                    <span>Replication:</span>
                    <span className="block text-emerald-500 font-semibold">Active, Dual</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-850 text-center text-xs text-slate-500">
                Pick a node from the architectural design schema to display metadata annotations or deployment structures.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Network State:</span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Docker Orchestrated Ready</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
