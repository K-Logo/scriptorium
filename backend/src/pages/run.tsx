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
            <CodeEditor />
        </div>
      </main>
    </>
  );
}

