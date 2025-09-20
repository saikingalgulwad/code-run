"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { dracula, githubLight } from "@uiw/codemirror-themes-all";
import * as ts from "typescript";
import Link from "next/link";

// IMPORTANT: load heavy/editor libs only on client to avoid SSR/hydration issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

export default function AdvancedCodeRunner() {
  // Boilerplate templates
  const boilerplates = {
    javascript: `// JavaScript Boilerplate
function greet(name) {
  console.log("Hello " + name);
}
greet("World");`,
    python: `# Python Boilerplate
def greet(name):
    print("Hello", name)

greet("World")`,
    typescript: `// TypeScript Boilerplate
function greet(name: string) {
  console.log("Hello " + name);
}
greet("World");`,
  };

  // --- state ---
  const [isMounted, setIsMounted] = useState(false); // client-only guard
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(boilerplates.javascript);
  const [output, setOutput] = useState("");
  const [pyodideReady, setPyodideReady] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [fullscreen, setFullscreen] = useState(null);
  const [editorWidth, setEditorWidth] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // mobile
  const [fontSize, setFontSize] = useState(14);
  const [panelPosition, setPanelPosition] = useState("right"); // "right" | "bottom"

  // Monaco refs (for JS/TS)
  const monacoRef = useRef(null);
  const monacoEditorRef = useRef(null);

  // mark mounted after hydration to avoid client/server mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Pyodide for Python (client only)
  useEffect(() => {
    if (!isMounted) return;
    if (!pyodideReady) {
      const pyScript = document.createElement("script");
      pyScript.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      pyScript.onload = async () => {
        // eslint-disable-next-line no-undef
        window.pyodide = await window.loadPyodide();
        setPyodideReady(true);
      };
      document.body.appendChild(pyScript);
    }
  }, [isMounted, pyodideReady]);

  // --- Helpers: run code ---
  const runJS = (userCode) => {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));
    try {
      Function('"use strict";' + userCode)();
    } catch (e) {
      console.log = originalLog;
      return `Runtime Error: ${e.message}`;
    }
    console.log = originalLog;
    return logs.length ? logs.join("\n") : "";
  };

  const runTS = (userCode) => {
    try {
      const transpileResult = ts.transpileModule(userCode, {
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
      });
      return runJS(transpileResult.outputText);
    } catch (err) {
      return "TS Compile Error: " + err.message;
    }
  };

  const runPython = async (userCode) => {
    if (!isMounted || !window.pyodide) return "Python runtime loading...";
    try {
      const wrappedCode = `
import sys
from io import StringIO
output = StringIO()
sys.stdout = output
try:
${userCode.split("\n").map((l) => "    " + l).join("\n")}
except Exception as e:
    print("Error:", e)
sys.stdout.getvalue()
      `;
      return await window.pyodide.runPythonAsync(wrappedCode);
    } catch (e) {
      return "Python Error: " + e.message;
    }
  };

  // Get monaco markers (errors/warnings) for current model (JS/TS)
  const collectMonacoMarkersText = () => {
    try {
      if (!monacoRef.current || !monacoEditorRef.current) return [];
      const model = monacoEditorRef.current.getModel();
      if (!model) return [];
      const markers = monacoRef.current.editor.getModelMarkers({ resource: model.uri });
      return markers.map((m) => {
        let sev = "";
        try {
          const MarkerSeverity = monacoRef.current.MarkerSeverity || monacoRef.current.MarkerSeverity;
          if (m.severity === MarkerSeverity.Error) sev = "Error";
          else if (m.severity === MarkerSeverity.Warning) sev = "Warning";
        } catch {
          // ignore
        }
        return `${sev ? sev + ":" : ""} ${m.message} (Line ${m.startLineNumber}${m.startColumn ? `, Col ${m.startColumn}` : ""})`;
      });
    } catch (e) {
      return [];
    }
  };

  const runCode = async () => {
    setOutput("Running...");

    if (language === "javascript" || language === "typescript") {
      const markersText = collectMonacoMarkersText();
      if (markersText.length > 0) {
        setOutput(markersText.join("\n"));
        if (isMounted && window.innerWidth < 640) setActiveTab("output");
        return;
      }
      if (language === "javascript") {
        setOutput(runJS(code) || "(no output)");
      } else {
        setOutput(runTS(code) || "(no output)");
      }
    } else if (language === "python") {
      const res = await runPython(code);
      setOutput(res || "(no output)");
    }

    if (isMounted && window.innerWidth < 640) setActiveTab("output");
  };

  // Monaco lifecycle hooks for editing JS/TS
  const handleMonacoBeforeMount = (monaco) => {
    monacoRef.current = monaco;
    try {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        strict: true,
        allowNonTsExtensions: true,
        noEmitOnError: true,
        lib: ["es2020", "dom"],
      });
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    } catch (e) {
      // ignore if API differs
    }
  };

  const handleMonacoMount = (editor, monaco) => {
    monacoRef.current = monaco;
    monacoEditorRef.current = editor;
    try {
      const model = editor.getModel();
      if (model) {
        const lang = language === "typescript" ? "typescript" : "javascript";
        monaco.editor.setModelLanguage(model, lang);
      }
    } catch (e) {
      // ignore
    }
  };

  // Copy / download utilities
  const copyOutput = () => {
    if (!output) return alert("Nothing to copy");
    navigator.clipboard.writeText(output).then(() => alert("Output copied!")).catch(() => alert("Failed to copy"));
  };

  const copyCode = () => {
    if (!code) return alert("Nothing to copy");
    navigator.clipboard.writeText(code).then(() => alert("Code copied!")).catch(() => alert("Failed to copy"));
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${language === "python" ? "py" : language === "typescript" ? "ts" : "js"}`;
    link.click();
  };

  // Resize (desktop)
  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) setEditorWidth(newWidth);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // Language change → load boilerplate
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(boilerplates[newLang]);
  };

  const outputBgColor = darkMode ? "#111827" : "#f3f4f6";
  const outputTextColor = darkMode ? "#f9fafb" : "#111827";

  // --- Render: IMPORTANT: suppressHydrationWarning prevents the console hydration error (eg. fdprocessedid injection by extensions) ---
  return (
    <div suppressHydrationWarning={true} className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} w-screen h-screen flex flex-col`}>
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center p-3 shadow-lg border-b border-gray-600 gap-2">
        <h1 className="text-base font-bold text-indigo-500">Online Code Runner</h1>
        <div className="flex gap-2 flex-wrap items-center">
          {/* Font Size & Language */}
          <label>
         Font Size:<input
            type="number"
            min="10"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-14 text-xs p-1 rounded bg-gray-700 text-white"
          />
            </label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-800 text-white"} p-1 text-xs rounded-md`}
          >
            <option value="javascript">JavaScript</option>
             <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
           
          </select>

          {/* Buttons */}
          <button onClick={downloadCode} className="bg-green-600 px-2 py-1 text-xs rounded-md">Download</button>
          <button onClick={() => setDarkMode(!darkMode)} className="bg-indigo-500 px-2 py-1 text-xs rounded-md">
            {darkMode ? "Light" : "Dark"}
          </button>
          <button
            onClick={() => setPanelPosition(panelPosition === "bottom" ? "right" : "bottom")}
            className="bg-blue-500 px-2 py-1 text-xs rounded-md"
          >
            Move {panelPosition === "bottom" ? "Right" : "Bottom"}
          </button>
              <Link
      href="/about"
      className="bg-blue-500 px-2 py-1 text-xs rounded-md text-white hover:bg-blue-600"
    >
      About Me
    </Link>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="sm:hidden flex justify-center gap-4 border-b border-gray-600 p-2">
        <button
          className={`px-3 py-1 text-xs rounded-md ${activeTab === "editor" ? "bg-indigo-600 text-white" : "bg-gray-700"}`}
          onClick={() => setActiveTab("editor")}
        >
          Editor
        </button>
        <button
          className={`px-3 py-1 text-xs rounded-md ${activeTab === "output" ? "bg-green-600 text-white" : "bg-gray-700"}`}
          onClick={() => setActiveTab("output")}
        >
          Output
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ flexDirection: panelPosition === "bottom" ? "column" : "row" }}>
        {/* Editor */}
        {(fullscreen === null || fullscreen === "editor") && (
          <div
            className="flex flex-col p-2"
            style={{
              backgroundColor: darkMode ? "#1f1f1f" : "#fafafa",
              width: fullscreen === "editor" ? "100%" : panelPosition === "right" ? `${editorWidth}%` : "100%",
              height: panelPosition === "bottom" ? "65%" : "100%",
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-sm font-semibold text-indigo-400">Code Editor</h2>
              <div className="flex gap-2">
                <button onClick={runCode} className="bg-purple-600 px-2 py-1 text-xs rounded-md">Run</button>
                <button onClick={copyCode} className="bg-blue-500 px-2 py-1 text-xs rounded-md">Copy</button>
                <button onClick={() => setFullscreen(fullscreen === "editor" ? null : "editor")} className="bg-gray-600 px-2 py-1 text-xs rounded-md">
                  {fullscreen === "editor" ? "Exit Full" : "Full"}
                </button>
              </div>
            </div>

            {/* Editor Switch */}
            {/* render editors only after mount to avoid SSR mismatches */}
            {isMounted ? (
              language === "python" ? (
                <CodeMirror
                  value={code}
                  extensions={python ? [python()] : []}
                  theme={darkMode ? dracula : githubLight}
                  onChange={(value) => setCode(value)}
                  className="flex-1 rounded-md overflow-auto text-sm"
                  style={{ fontSize: `${fontSize}px`, height: "100%" }}
                />
              ) : (
                <MonacoEditor
                  height="100%"
                  language={language === "typescript" ? "typescript" : "javascript"}
                  value={code}
                  beforeMount={handleMonacoBeforeMount}
                  onMount={handleMonacoMount}
                  onChange={(val) => setCode(val || "")}
                  theme={darkMode ? "vs-dark" : "vs-light"}
                  options={{ fontSize, minimap: { enabled: false } }}
                />
              )
            ) : (
              // placeholder during SSR -> keeps layout consistent
              <div className="flex-1 rounded-md overflow-auto text-sm" style={{ fontSize: `${fontSize}px`, height: "100%", backgroundColor: darkMode ? "#121212" : "#fff" }}>
                {/* intentionally empty until client mount to avoid hydration mismatch */}
              </div>
            )}
          </div>
        )}

        {/* Resize Handle (only when right panel) */}
        {fullscreen === null && panelPosition === "right" && <div className="w-1 cursor-col-resize bg-gray-600" onMouseDown={handleMouseDown} />}

        {/* Output */}
        {(fullscreen === null || fullscreen === "output") && (
          <div
            className="flex flex-col p-2"
            style={{
              backgroundColor: outputBgColor,
              width: fullscreen === "output" ? "100%" : panelPosition === "right" ? `${100 - editorWidth}%` : "100%",
              height: panelPosition === "bottom" ? "35%" : "100%",
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-sm font-semibold text-green-400">Output</h2>
              <button onClick={copyOutput} className="bg-green-500 px-2 py-1 text-xs rounded-md">Copy</button>
            </div>
            <div
              className="flex-1 font-mono overflow-auto whitespace-pre-wrap p-2 rounded-md border border-gray-600"
              style={{ fontSize: `${fontSize}px`, lineHeight: "1.5", color: outputTextColor }}
            >
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
