import React, { createContext, useState } from "react";

interface LanguageContextState {
    language: string;
    setLanguage: (language: string) => void;
}

export const LanguageContext = createContext<LanguageContextState>({
    language: "py3",
    setLanguage: () => {}
})

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState<string>("py3");

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}