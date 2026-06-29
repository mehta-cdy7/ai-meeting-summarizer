import React from "react";
import { Brain, Cpu, MessageSquareQuote, LogOut, User as UserIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <div className="w-full max-w-4xl flex items-center justify-between mb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <span className="font-bold text-white tracking-tight text-lg sm:text-xl block">
            Recall AI
          </span>
          <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase block -mt-1">
            Meeting Intelligence
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            GPT-4o-mini
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg">
            <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
            Whisper-large-v3
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/8 pl-3 pr-2 py-1.5 rounded-xl">
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-[11px] font-semibold text-zinc-200 leading-tight">
                {user.email}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-tighter">
                Nametag: {user.id.substring(0, 8)}...
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
