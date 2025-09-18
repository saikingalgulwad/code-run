"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { dracula, githubLight } from "@uiw/codemirror-themes-all";

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
  };

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

  // Load Pyodide
  useEffect(() => {
    if (!pyodideReady) {
      const pyScript = document.createElement("script");
      pyScript.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      pyScript.onload = async () => {
        window.pyodide = await window.loadPyodide();
        setPyodideReady(true);
      };
      document.body.appendChild(pyScript);
    }
  }, [pyodideReady]);

  // Run JS
  const runJS = (code) => {
    let logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));
    try {
      Function('"use strict";' + code)();
    } catch (e) {
      logs.push("Error: " + e.message);
    }
    console.log = originalLog;
    return logs.join("\n");
  };

  // Run Python
  const runPython = async (code) => {
    if (!window.pyodide) return "Python runtime loading...";
    try {
      const wrappedCode = `
import sys
from io import StringIO
output = StringIO()
sys.stdout = output
try:
    exec(${JSON.stringify(code)})
except Exception as e:
    print("Error:", e)
sys.stdout.getvalue()
      `;
      return await window.pyodide.runPythonAsync(wrappedCode);
    } catch (e) {
      return "Error: " + e.message;
    }
  };

  const runCode = async () => {
    setOutput("Running...");
    if (language === "javascript") setOutput(runJS(code));
    else if (language === "python") setOutput(await runPython(code));

    // Mobile: auto switch to output tab after run
    if (window.innerWidth < 640) setActiveTab("output");
  };

  const getLanguageExtension = () => {
    if (language === "javascript") return [javascript()];
    if (language === "python") return [python()];
    return [];
  };

  // Copy & Download
  const copyOutput = () => {
    if (!output) return alert("Nothing to copy");
    navigator.clipboard.writeText(output)
      .then(() => alert("Output copied!"))
      .catch(() => alert("Failed to copy"));
  };

  const copyCode = () => {
    if (!code) return alert("Nothing to copy");
    navigator.clipboard.writeText(code)
      .then(() => alert("Code copied!"))
      .catch(() => alert("Failed to copy"));
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${language === "python" ? "py" : "js"}`;
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

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} w-screen h-screen flex flex-col`}>
      {/* Header */}
     {/* Header */}
<header className="flex flex-wrap justify-between items-center p-3 shadow-lg border-b border-gray-600 gap-2">
  <h1 className="text-base font-bold text-indigo-500">Online Code Runner</h1>
  <div className="flex gap-2 flex-wrap items-center">
    {/* Font Size & Language */}
    <input
      type="number"
      min="10"
      max="24"
      value={fontSize}
      onChange={(e) => setFontSize(Number(e.target.value))}
      className="w-14 text-xs p-1 rounded bg-gray-700 text-white"
    />
    <select
      value={language}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-800 text-white"} p-1 text-xs rounded-md`}
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
    </select>

    {/* Buttons */}
    <button onClick={downloadCode} className="bg-green-600 px-2 py-1 text-xs rounded-md">Download</button>
    <button onClick={() => setDarkMode(!darkMode)} className="bg-indigo-500 px-2 py-1 text-xs rounded-md">
      {darkMode ? "Light" : "Dark"}
    </button>

    {/* NEW: About Page Link */}
    <a
      href="/about"
      className="bg-blue-500 px-2 py-1 text-xs rounded-md text-white hover:bg-blue-600"
    >
      About Me
    </a>
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
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop */}
        <div className="hidden sm:flex flex-1 overflow-hidden">
          {/* Editor */}
          {(fullscreen === null || fullscreen === "editor") && (
            <div className="flex flex-col p-2" style={{ backgroundColor: darkMode ? "#1f1f1f" : "#fafafa", width: fullscreen === "editor" ? "100%" : `${editorWidth}%` }}>
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
              <CodeMirror
                value={code}
                extensions={getLanguageExtension()}
                theme={darkMode ? dracula : githubLight}
                onChange={(value) => setCode(value)}
                className="flex-1 rounded-md overflow-auto text-sm"
                style={{ fontSize: `${fontSize}px`, height: "100%" }}
              />
            </div>
          )}

          {/* Resize Handle */}
          {fullscreen === null && <div className="w-1 cursor-col-resize bg-gray-600" onMouseDown={handleMouseDown} />}

          {/* Output */}
          {(fullscreen === null || fullscreen === "output") && (
            <div className="flex flex-col p-2" style={{ backgroundColor: darkMode ? "#111827" : "#f3f4f6", width: fullscreen === "output" ? "100%" : `${100 - editorWidth}%` }}>
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-sm font-semibold text-green-400">Output</h2>
                <button onClick={copyOutput} className="bg-green-500 px-2 py-1 text-xs rounded-md">Copy</button>
              </div>
              <div className="flex-1 font-mono overflow-auto whitespace-pre-wrap p-2 rounded-md border border-gray-600" style={{ fontSize: `${fontSize}px`, lineHeight: "1.5" }}>
                {output}
              </div>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex-1">
          {activeTab === "editor" && (
            <div className="flex flex-col h-full p-2" style={{ backgroundColor: darkMode ? "#1f1f1f" : "#fafafa" }}>
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-sm font-semibold text-indigo-400">Code Editor</h2>
                <button onClick={runCode} className="bg-purple-600 px-2 py-1 text-xs rounded-md">Run</button>
              </div>
              <CodeMirror
                value={code}
                extensions={getLanguageExtension()}
                theme={darkMode ? dracula : githubLight}
                onChange={(value) => setCode(value)}
                className="flex-1 rounded-md overflow-auto text-sm"
                style={{ fontSize: `${fontSize}px`, height: "100%" }}
              />
            </div>
          )}
          {activeTab === "output" && (
            <div className="flex flex-col h-full p-2" style={{ backgroundColor: darkMode ? "#111827" : "#f3f4f6" }}>
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-sm font-semibold text-green-400">Output</h2>
                <button onClick={copyOutput} className="bg-green-500 px-2 py-1 text-xs rounded-md">Copy</button>
              </div>
              <div className="flex-1 font-mono overflow-auto whitespace-pre-wrap p-2 rounded-md border border-gray-600" style={{ fontSize: `${fontSize}px`, lineHeight: "1.5" }}>
                {output}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
