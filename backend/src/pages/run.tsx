import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import LangDropdown from "@/components/LangDropdown";
import { LanguageContext } from "@/contexts/language";

export default function Run() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  const handleRun = async () => {
    try {
      const requestBody = {
        lang: language, // Default to Python 3 if no language is selected
        code: code,
        data_in: input,
      };

      const response = await fetch("/api/exec/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseBody = await response.json();
      if (responseBody.error) {
        // If there's an error, display the error message and details
        setOutput(`Error: ${responseBody.error}\nDetails: ${responseBody.details}`);
      } else {
        let cleanedOutput = responseBody.output;
        if (cleanedOutput.startsWith('\"') && cleanedOutput.endsWith('\"', cleanedOutput.length - 1)) {
          cleanedOutput = cleanedOutput.slice(1, -2);
        }  
        setOutput(cleanedOutput || "No output received.");
      }
    } catch (error) {
      console.error("Failed to execute code:", error);
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Scriptorium Run Code</title>
      </Head>
      <main>
        <div id="run-container">
          <div id="editor-container">
            <div className="run-headers">
              <LangDropdown />
              <button id="run-button" className="blue-button" onClick={handleRun}>
                Run
              </button>
              <button className="blue-button">Save</button>
            </div>
            <CodeEditor value={code} onChange={(value: string) => setCode(value)} />
            <textarea
              id="input"
              placeholder="Insert input here (each input on its own line)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div id="output-container">
            <div className="run-headers">
              <h2>Output</h2>
              <button className="blue-button" onClick={() => setOutput("")}>
                Clear
              </button>
            </div>
            <div id="output">{output}</div>
          </div>
        </div>
      </main>
    </>
  );
}
