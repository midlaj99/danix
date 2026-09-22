import React from 'react';
import { ArrowLeftRight, ArrowUp, Zap, Swords } from 'lucide-react';

export const ControlsBar: React.FC = () => {
  return (
    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-4 py-1.5 rounded-full flex items-center space-x-4 text-[11px] text-slate-300 shadow-xl">
        <div className="flex items-center space-x-1.5">
          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono text-[10px] font-bold border border-slate-700">
            A
          </span>
          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono text-[10px] font-bold border border-slate-700">
            D
          </span>
          <ArrowLeftRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400">Move</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center space-x-1.5">
          <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono text-[10px] font-bold border border-slate-700">
            Space
          </span>
          <ArrowUp className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400">Jump</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center space-x-1.5">
          <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono text-[10px] font-bold border border-slate-700">
            Shift
          </span>
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="text-slate-400">Sprint</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center space-x-1.5">
          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-400 font-mono text-[10px] font-bold border border-slate-700">
            C
          </span>
          <span className="text-slate-400">Dodge</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center space-x-1.5">
          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono text-[10px] font-bold border border-slate-700">
            E
          </span>
          <span className="text-slate-400">Interact</span>
        </div>

        <div className="h-3 w-px bg-slate-800" />

        <div className="flex items-center space-x-1.5">
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-amber-300 font-medium">Approach Sentinel to Battle</span>
        </div>
      </div>
    </div>
  );
};
