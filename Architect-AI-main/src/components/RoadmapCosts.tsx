import React, { useState } from "react";
import { Calendar, Users, DollarSign, PieChart, Landmark, Star, ChevronDown, ChevronUp } from "lucide-react";
import { RoadmapPhase, CostItem } from "../types";

interface RoadmapCostsProps {
  roadmap: {
    phases: RoadmapPhase[];
    timelineEstimation: string;
    teamEstimation: string[];
    teamSize: number;
  };
  cost: {
    breakdown: CostItem[];
    monthlyTotal: number;
    annualTotal: number;
  };
}

export function RoadmapCosts({ roadmap, cost }: RoadmapCostsProps) {
  const [activeTab, setActiveTab] = useState<"roadmap" | "costs">("roadmap");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

  // Filter cost categories for customized calculations
  const infraCosts = cost.breakdown.filter(c => c.category === "infrastructure");
  const devCosts = cost.breakdown.filter(c => c.category === "development");
  const maintCosts = cost.breakdown.filter(c => c.category === "maintenance");

  const calcCategorySum = (items: CostItem[]) => {
    return items.reduce((acc, curr) => acc + curr.monthlyCost, 0);
  };

  const infraSum = calcCategorySum(infraCosts);
  const devSum = calcCategorySum(devCosts);
  const maintSum = calcCategorySum(maintCosts);
  const totalSum = infraSum + devSum + maintSum;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl" id="roadmap-costs">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Project Roadmap & Cost Analysis Engine</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Enterprise timeline milestones, professional staffing estimations, and infrastructure breakdowns.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-980 p-1 border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "roadmap"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="tab-roadmap"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline phase and staffing</span>
          </button>
          <button
            onClick={() => setActiveTab("costs")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "costs"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            }`}
            id="tab-costs"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>SaaS Pricing & AWS Cost Chart</span>
          </button>
        </div>
      </div>

      {activeTab === "roadmap" && (
        <div className="space-y-6">
          {/* Timeline / Team Info Headers */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 flex gap-3.5 items-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-505 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Duration bound</span>
                <span className="block text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{roadmap.timelineEstimation}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 flex gap-3.5 items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-505 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Users className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">Project Team Allocation</span>
                <span className="block text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{roadmap.teamSize} Certified Engineers</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 flex gap-3.5 items-center sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-505 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">Compiling Budget estimate</span>
                <span className="block text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">${totalSum.toLocaleString()} Monthly Run</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Staff breakdown column on left */}
            <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-850 pr-6 space-y-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Recommended Agile Staffing Roll</span>
              <div className="space-y-3">
                {roadmap.teamEstimation.map((member, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800/80 rounded-xl hover:shadow-sm transition flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 flex items-center justify-center shrink-0">{idx+1}</div>
                    <span className="text-xs text-slate-600 dark:text-slate-350 font-medium leading-relaxed">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expansible timeline phase details on right */}
            <div className="lg:col-span-2 space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Scrum Phase sprints mapping</span>
              {roadmap.phases.map((phase, pIdx) => {
                const isExpanded = expandedPhase === pIdx;
                return (
                  <div 
                    key={pIdx} 
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950"
                    id={`roadmap-phase-${pIdx}`}
                  >
                    <button
                      onClick={() => setExpandedPhase(isExpanded ? null : pIdx)}
                      className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-900 flex justify-between items-center transition cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-500 font-mono tracking-widest">{phase.duration}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{phase.name}</h4>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-transparent space-y-4 animate-scale-up">
                        {/* Task list */}
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Key Sprit Tasks</span>
                          <ul className="space-y-1.5 pl-1">
                            {phase.tasks.map((task, tIdx) => (
                              <li key={tIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Milestones list */}
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Completion Gate Milestones</span>
                          <ul className="space-y-1.5 pl-1">
                            {phase.milestones.map((ms, mIdx) => (
                              <li key={mIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span className="font-semibold">{ms}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Costs dynamic charts and breakdown */}
      {activeTab === "costs" && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cost chart visualization */}
            <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 p-6 rounded-2xl flex flex-col justify-between items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block">Monthly Budget Segment Ratio</span>

              {/* Elegant SVG doughnut indicator representation */}
              <div className="relative w-36 h-36 flex items-center justify-center" id="cost-ratio-radial">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="55" fill="transparent" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="12" />
                  {/* Draw parts manually depending on calculations */}
                  <circle 
                    cx="72" cy="72" r="55" fill="transparent" 
                    stroke="#10b981" strokeWidth="12" 
                    strokeDasharray={`${(infraSum / totalSum) * 345} 345`} 
                  />
                  <circle 
                    cx="72" cy="72" r="55" fill="transparent" 
                    stroke="#3b82f6" strokeWidth="12" 
                    strokeDasharray={`${(devSum / totalSum) * 345} 345`} 
                    strokeDashoffset={`-${(infraSum / totalSum) * 345}`}
                  />
                  <circle 
                    cx="72" cy="72" r="55" fill="transparent" 
                    stroke="#818cf8" strokeWidth="12" 
                    strokeDasharray={`${(maintSum / totalSum) * 345} 345`} 
                    strokeDashoffset={`-${((infraSum + devSum) / totalSum) * 345}`}
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-lg font-black text-slate-950 dark:text-white font-mono">${Math.round(totalSum / 1000)}k</span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Total Run</span>
                </div>
              </div>

              {/* Chart Indicator Labels */}
              <div className="mt-4 w-full grid grid-cols-3 gap-1.5 text-[10px] font-semibold text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-850">
                <div>
                  <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto" />
                  <span className="block mt-1 font-mono">${infraSum}</span>
                  <span className="block text-[8px] text-slate-400">AWS Infra</span>
                </div>
                <div>
                  <span className="block w-2.5 h-2.5 rounded-full bg-blue-500 mx-auto" />
                  <span className="block mt-1 font-mono">${devSum}</span>
                  <span className="block text-[8px] text-slate-400">Staffing</span>
                </div>
                <div>
                  <span className="block w-2.5 h-2.5 rounded-full bg-indigo-400 mx-auto" />
                  <span className="block mt-1 font-mono">${maintSum}</span>
                  <span className="block text-[8px] text-slate-400">DevOps</span>
                </div>
              </div>
            </div>

            {/* Individual cost lines descriptions */}
            <div className="lg:col-span-2 space-y-4 max-h-[340px] overflow-y-auto pr-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">AWS Infrastructure & Agile Staffing details</span>
              <div className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                {cost.breakdown.map((item, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-start text-xs gap-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{item.service}</span>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5 leading-relaxed">{item.description}</p>
                      <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500">
                        Category: {item.category}
                      </span>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className="font-mono font-extrabold text-slate-950 dark:text-white text-xs">${item.monthlyCost} / mo</span>
                      <span className="block text-[10px] text-slate-400 mt-1 font-mono">Anually: ${item.annualCost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
