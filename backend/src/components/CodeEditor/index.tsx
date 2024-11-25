import { Editor } from "@monaco-editor/react";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/contexts/language";

const CodeEditor = () => {
    const [code, setCode] = useState("");
    const { language, setLanguage } = useContext(LanguageContext);

    const handleCodeChange = (value) => {
        setCode(value);
    }

    useEffect(() => {
        console.log(language);
    
      }, [language]) ;

    return (
        <Editor
            theme="vs-dark"
            language={language}
            defaultValue=""
        />
        
    );
}

export default CodeEditor;