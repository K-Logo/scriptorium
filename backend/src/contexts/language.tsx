import React, { createContext, useState } from "react";

interface LanguageContextState {
    language: string;
    setLanguage: (language: string) => void;
}

export const LanguageContext = createContext<LanguageContextState>({
    language: "JavaScript",
    setLanguage: () => {}
})

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState<string>("JavaScript");

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}