import { create } from "zustand";
import * as monaco from "monaco-editor";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";

// ✅ Define the TypeScript interface for editor state
export interface CodeEditorState {
  language: string;
  theme: string;
  fontSize: number;
  output: string;
  isRunning: boolean;
  error: string | null;
  editor: monaco.editor.IStandaloneCodeEditor | null;
  executionResult: {
    code: string;
    output: string;
    error: string | null;
  } | null;

  // Methods
  getCode: () => string;
  setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  setLanguage: (language: string) => void;
  runCode: () => Promise<void>;
}

// ✅ Helper function to safely get defaults (handles SSR)
const getInitialState = () => {
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      theme: "vs-dark",
      fontSize: 16,
    };
  }

  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = parseInt(localStorage.getItem("editor-font-size") || "16");

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: savedFontSize,
  };
};

// ✅ Zustand Store
export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,

    // ✅ Get code from editor safely
    getCode: () => get().editor?.getValue() || "",

    // ✅ Save editor instance when mounted
    setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editor.setValue(savedCode);
      set({ editor });
    },

    // ✅ Update theme
    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    // ✅ Update font size
    setFontSize: (fontSize: number) => {
      const clamped = Math.min(Math.max(fontSize, 12), 24);
      localStorage.setItem("editor-font-size", clamped.toString());
      set({ fontSize: clamped });
    },

    // ✅ Change language & preserve old code
    setLanguage: (language: string) => {
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }
      localStorage.setItem("editor-language", language);
      set({ language, output: "", error: null });
    },

    // ✅ Execute code using Piston API
    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode();

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [{ content: code }],
          }),
        });

        const data = await response.json();
        console.log("Execution result from Piston:", data);

        // 🛑 Handle API or runtime errors
        if (data.message) {
          set({
            error: data.message,
            executionResult: { code, output: "", error: data.message },
          });
          return;
        }

        if (data.compile && data.compile.code !== 0) {
          const error = data.compile.stderr || data.compile.output;
          set({
            error,
            executionResult: { code, output: "", error },
          });
          return;
        }

        if (data.run && data.run.code !== 0) {
          const error = data.run.stderr || data.run.output;
          set({
            error,
            executionResult: { code, output: "", error },
          });
          return;
        }

        // ✅ Successful execution
        const output = data.run.output.trim();
        set({
          output,
          error: null,
          executionResult: { code, output, error: null },
        });
      } catch (err) {
        console.error("Error running code:", err);
        set({
          error: "Error running code",
          executionResult: { code, output: "", error: "Error running code" },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

// ✅ Helper to get last execution result without re-rendering
export const getExecutionResult = () => useCodeEditorStore.getState().executionResult;
