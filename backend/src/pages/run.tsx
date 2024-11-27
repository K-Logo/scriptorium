import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import { LanguageProvider } from "@/contexts/language";
import LangDropdown from "@/components/LangDropdown";
import { LanguageContext } from "@/contexts/language";
import { UserContext } from "@/contexts/user";

import Link from 'next/link';
import { Editor } from "@monaco-editor/react";



export default function Run() {
  const router = useRouter();
  const { language, setLanguage } = useContext(LanguageContext);
  const { user } = useContext(UserContext);
  type QueryParams = {
    prepopulatedCode?: string;
    predefinedLanguage?: string;
  };
  const { prepopulatedCode, predefinedLanguage } = router.query as QueryParams;
  let codeDefaultValue;
  if (prepopulatedCode) {
    codeDefaultValue = prepopulatedCode;
  } else {
    codeDefaultValue = ""
  }
  const [code, setCode] = useState(codeDefaultValue);

  // Below runs when page is mounted
  useEffect(() => {
    if (predefinedLanguage) {
      setLanguage(predefinedLanguage);
    }
}, []);
  

  const handleCodeChange = (value) => {
    setCode(value);
    console.log(value);
}



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
                {user.id &&
                <Link href={`/code-templates/create?codeTyped=${encodeURIComponent(code)}&languagePassed=${language}`}>
                  <button className="blue-button">
                    Save
                  </button>
                </Link>
                }
                
              </div>
              <Editor
                  theme="vs-dark"
                  language={language}
                  value={code}
                  onChange={handleCodeChange}
              />
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

