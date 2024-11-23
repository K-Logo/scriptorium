import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import { LanguageProvider } from "@/contexts/language";
import LangDropdown from "@/components/LangDropdown";
import { LanguageContext } from "@/contexts/language";


export default function Run() {
  const { language, setLanguage } = useContext(LanguageContext);



  return (
    <>
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
              <textarea id="input" placeholder="Insert input here (each input on its own line)...">
                
              </textarea>
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
    </>

  );
}

