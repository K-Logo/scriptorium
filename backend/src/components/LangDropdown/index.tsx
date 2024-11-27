import React, { useContext, useState } from "react";
import Link from 'next/link';
import { LanguageContext } from "@/contexts/language";

export default function LangDropdown() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { language, setLanguage } = useContext(LanguageContext);
    const languageToDisplayName = {
        "javascript": "JavaScript",
        "python": "Python",
        "cpp": "C++",
        "java": "Java"
    };

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
    }

    function Dropdown() {
        return dropdownOpen && (
            <ul id="language-dropdown">
                <button onClick={() => {setLanguage("javascript"); toggleDropdown();}}><li className="user-dropdown-item">JavaScript</li></button>
                <button onClick={() => {setLanguage("python"); toggleDropdown();}}><li className="user-dropdown-item">Python</li></button>
                <button onClick={() => {setLanguage("cpp"); toggleDropdown();}}><li className="user-dropdown-item">C++</li></button>
                <button onClick={() => {setLanguage("java"); toggleDropdown();}}><li className="user-dropdown-item">Java</li></button>
            </ul>
        )
        
    }

    function DropdownButton() {
        return (
            <div id="lang-dropdown-container">
                <button id="dropdown-button" onClick={() => toggleDropdown()}>{languageToDisplayName[language]}</button>
                <Dropdown/>
            </div>
        )
    }

    return (
        <DropdownButton/>
    )
}