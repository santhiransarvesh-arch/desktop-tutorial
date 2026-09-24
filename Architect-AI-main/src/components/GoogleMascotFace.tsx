import React from "react";

interface GoogleMascotFaceProps {
  className?: string;
}

export function GoogleMascotFace({ className = "w-10 h-10" }: GoogleMascotFaceProps) {
  return (
    <div className={`relative ${className} flex items-center justify-center shrink-0`} id="google-mascot-avatar">
      {/* Outer spinning ring with Google core colors alignment */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 via-yellow-500 to-emerald-500 p-[2.5px] shadow-[0_0_15px_rgba(66,133,244,0.3)] animate-spin-infinite">
        <div className="w-full h-full bg-slate-950 rounded-full" />
      </div>
      
      {/* Mascot Head Component Box */}
      <div className="relative w-[85%] h-[85%] rounded-full bg-slate-900 dark:bg-slate-950 border border-slate-850 dark:border-slate-800 flex flex-col items-center justify-center shadow-inner overflow-hidden">
        {/* Google Smart fore-node bulb */}
        <div className="absolute top-[3px] w-1.5 h-1 rounded-full bg-yellow-400/80 animate-ping" />
        
        {/* Smiling robot digital eyes */}
        <div className="flex items-center gap-[6px] mt-1.5">
          {/* Blue digital eye */}
          <div className="relative w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)] flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-white opacity-90" />
          </div>
          
          {/* Red digital eye */}
          <div className="relative w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)] flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-white opacity-90" />
          </div>
        </div>

        {/* Glowing blushing side-cheeks */}
        <div className="absolute left-[5px] top-[15px] w-2 h-1 rounded-full bg-yellow-400/30 blur-[0.5px]" />
        <div className="absolute right-[5px] top-[15px] w-2 h-1 rounded-full bg-emerald-400/40 blur-[0.5px]" />

        {/* Digital smiling mouth arch representing AI friendliness */}
        <div className="w-4 h-1.5 border-b-[2px] border-emerald-400 rounded-b-full mt-1.5 animate-bounce" style={{ animationDuration: "3s" }} />
      </div>

      {/* Soft color backdrop glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-500/20 via-red-500/10 via-yellow-500/15 to-emerald-500/20 rounded-full blur-md -z-10" />
    </div>
  );
}
