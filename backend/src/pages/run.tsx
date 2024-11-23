import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import { LanguageProvider } from "@/contexts/language";
import LangDropdown from "@/components/LangDropdown";


export default function Run() {
  return (
    <LanguageProvider>
      <Head>
        <title>Scriptorium Run Code</title>
      </Head>
      <main>
        <div id="run-container">
          <div id="editor-container">
              <div className="run-headers">
              <LangDropdown/>
                <button id="run-button" className="blue-button">
                  Run
                </button>
                <button className="blue-button">
                  Save
                </button>
              </div>
              <CodeEditor />
          </div>
          <div id="output-container">
            <div className="run-headers">
              <h2>
                Output
              </h2>
              <button className="blue-button">
                Clear
              </button>
            </div>
            <div id="output">
              Hello world!
            </div>
          </div>
          
        </div>
        
      </main>
    </LanguageProvider>
  );
}

