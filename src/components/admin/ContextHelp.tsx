import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ContextHelpProps {
  text: string;
}

export function ContextHelp({ text }: ContextHelpProps) {
  return (
    <div className="group relative inline-block ml-1 align-middle">
      <HelpCircle 
        size={14} 
        className="text-slate-500 hover:text-primary cursor-help transition-colors" 
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-3 bg-slate-800 text-white text-[10px] rounded-xl shadow-2xl z-50 animate-scale-in border border-slate-700">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
      </div>
    </div>
  );
}
