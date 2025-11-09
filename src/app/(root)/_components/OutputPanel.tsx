"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

function OutputPanel() {
  const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = error || output;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#181825] rounded-xl p-3 sm:p-4 ring-1 ring-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-300">Output</span>
        </div>

        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
            rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Output Area */}
      <div className="relative">
        <div
          className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-3 sm:p-4 h-[400px] sm:h-[500px] md:h-[600px] overflow-auto font-mono text-xs sm:text-sm"
        >
          {isRunning ? (
            <RunningCodeSkeleton />
          ) : error ? (
            <div className="flex items-start gap-2 sm:gap-3 text-red-400">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-1" />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-medium text-xs sm:text-sm">Execution Error</div>
                <pre className="whitespace-pre-wrap text-red-400/80 text-xs sm:text-sm break-words">{error}</pre>
              </div>
            </div>
          ) : output ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-2 sm:mb-3">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-xs sm:text-sm">Execution Successful</span>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300 text-xs sm:text-sm break-words">{output}</pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="text-center text-xs sm:text-sm px-4">Run your code to see the output here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
