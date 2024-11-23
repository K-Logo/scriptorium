import { Editor } from "@monaco-editor/react";
import React, { useState } from 'react';  // Ensure this line is present at the top

const CodeEditor = () => {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");

    const handleCodeChange = (value) => {
        setCode(value);
    }

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    }

    return (
        <Editor
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue="// some comment"
        />
        
    );
}

export default CodeEditor;