import { Editor } from "@monaco-editor/react";
import React, { useContext, useEffect } from "react";
import { LanguageContext } from "@/contexts/language";

interface CodeEditorProps {
  onChange: (value: string) => void;
  value: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, value }) => {
  const { language } = useContext(LanguageContext);
  const monacoMap = {
    "py3": "python",
    "java": "java",
    "cpp": "cpp",
    "c": "c",
    "javascript": "javascript",
    "r": "r",
    "ruby": "ruby",
    "go": "go",
    "php": "php",
    "perl": "perl",
    "racket": "racket",
};



  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  useEffect(() => {
    console.log("Current language:", language);
  }, [language]);

  return (
    <Editor
      theme="vs-dark"
      language={monacoMap[language]}
      value={value}
      onChange={handleCodeChange}
    />
  );
};

export default CodeEditor;
