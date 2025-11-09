"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon, ShieldCheckIcon, Zap, } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { useQuery } from "convex/react";

function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore();
  const [showProModal, setShowProModal] = useState(false);
  const mounted = useMounted();
  const currentUser = useQuery(api.codeExecutions.getCurrentUser);
  const [editorHeight, setEditorHeight] = useState("400px");

  useEffect(() => {
    const updateHeight = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          setEditorHeight("350px");
        } else if (window.innerWidth < 768) {
          setEditorHeight("450px");
        } else {
          setEditorHeight("600px");
        }
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };
  const handleShareClick = () => {
    if (currentUser?.isPro) {
      setIsShareDialogOpen(true); // User is Pro, open the normal share dialog
    } else {
      setShowProModal(true); // User is not Pro, open the "Upgrade" modal
    }
  };

  if (!mounted) return null;


  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/5 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5 shrink-0">
              <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500 hidden sm:block">Write and execute your code</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Font Size Slider - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-3 sm:size-4 text-gray-400" />
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-16 sm:w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-400 min-w-6 sm:min-w-8 text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-1.5 sm:p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors shrink-0"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-3.5 sm:size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              onClick={handleShareClick}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg overflow-hidden bg-linear-to-r
               from-blue-500 to-blue-600 transition-all hover:from-blue-600 hover:to-blue-700`}
            >
              <ShareIcon className="size-3.5 sm:size-4 text-white" />
              <span className="text-xs sm:text-sm font-medium text-white hidden sm:inline">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Editor  */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/5">
          {clerk.loaded && (
            <Editor
              height={editorHeight}
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
                wordWrap: "on",
              }}
            />
          )}

          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
    </div>
  );
}
export default EditorPanel;

function ProModal({ onClose }: { onClose: () => void }) {
  const CHECKOUT_URL = "/pricing";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-[#1e1e2e] rounded-lg p-4 sm:p-6 w-full max-w-md border border-white/10 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <ShieldCheckIcon className="size-10 sm:size-12 text-blue-500 mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Upgrade to Pro</h2>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
            You must be a Pro user to share code snippets. Upgrade your plan to
            unlock this feature.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 bg-[#2a2a3a] hover:bg-[#3a3a4a] text-gray-300 rounded-lg transition-colors w-full sm:w-auto"
            >
              Maybe Later
            </motion.button>
            <Link
              href={CHECKOUT_URL}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-white 
                bg-linear-to-r from-blue-500 to-blue-600 rounded-lg 
                hover:from-blue-600 hover:to-blue-700 transition-all w-full sm:w-auto"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
