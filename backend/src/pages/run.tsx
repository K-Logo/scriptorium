import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import CodeEditor from "@/components/CodeEditor";


export default function Run() {
  return (
    <>
      <Head>
        <title>Scriptorium Run Code</title>
      </Head>
      <main>
        <div id="run-container">
          <div id="editor-container">
              <div className="run-headers">
                <button className="blue-button">
                  Run
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
    </>
  );
}

