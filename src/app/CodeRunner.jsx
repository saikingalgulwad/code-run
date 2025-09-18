"use client";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";

export default function CodeRunner() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("Output will appear here...");

  // Load Python runtime
  useEffect(() => {
    if (language === "python" && !window.pyodide) {
      (async () => {
        setOutput("Loading Python runtime...");
        window.pyodide = await window.loadPyodide();
        setOutput("Python ready! Write your code and run.");
      })();
    }
  }, [language]);

  const runCode = async () => {
    setOutput("Running...");
    try {
      if (language === "javascript") {
        const result = Function('"use strict";' + code)();
        setOutput(String(result));
      } else if (language === "python") {
        const result = await window.pyodide.runPythonAsync(code);
        setOutput(String(result));
      } else if (language === "c" || language === "cpp" || language === "rust") {
        // Placeholder: WASM execution required
        setOutput(`To run ${language}, precompile to WASM and load module.`);
      } else {
        setOutput("Language not supported yet");
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  const getLanguageExtension = () => {
    if (language === "javascript") return javascript();
    if (language === "python") return python();
    if (language === "cpp" || language === "c") return cpp();
    return javascript();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Online Code Runner
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <select
          className="border rounded-lg p-2 w-full md:w-1/3"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c">C (WASM)</option>
          <option value="cpp">C++ (WASM)</option>
          <option value="rust">Rust (WASM)</option>
        </select>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full md:w-1/4 transition"
          onClick={runCode}
        >
          Run Code
        </button>
      </div>

      <div className="mb-4">
        <CodeMirror
          value={code}
          height="300px"
          extensions={[getLanguageExtension()]}
          onChange={(value) => setCode(value)}
          className="border rounded-lg overflow-auto"
        />
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono min-h-[120px]">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
