import React, { useContext, useState } from "react";
import Link from 'next/link';
import { LanguageContext } from "@/contexts/language";

export default function LangDropdown() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { language, setLanguage } = useContext(LanguageContext);
    const languageToDisplayName = {
        "py3": "Python3",
        "java": "Java 21",
        "cpp": "C++ 14",
        "c": "C",
        "javascript": "JavaScript",
        "r": "R",
        "ruby": "Ruby",
        "go": "Go",
        "php": "PHP",
        "perl": "Perl",
        "racket": "Racket",
    };

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
    }

    function Dropdown() {
        return dropdownOpen && (
            <ul id="language-dropdown">
                <button onClick={() => {setLanguage("py3"); toggleDropdown();}}><li className="user-dropdown-item">Python3</li></button>
                <button onClick={() => {setLanguage("java"); toggleDropdown();}}><li className="user-dropdown-item">Java 21</li></button>
                <button onClick={() => {setLanguage("cpp"); toggleDropdown();}}><li className="user-dropdown-item">C++ 14</li></button>
                <button onClick={() => {setLanguage("c"); toggleDropdown();}}><li className="user-dropdown-item">C</li></button>
                <button onClick={() => {setLanguage("javascript"); toggleDropdown();}}><li className="user-dropdown-item">JavaScript</li></button>
                <button onClick={() => {setLanguage("r"); toggleDropdown();}}><li className="user-dropdown-item">R</li></button>
                <button onClick={() => {setLanguage("ruby"); toggleDropdown();}}><li className="user-dropdown-item">Ruby</li></button>
                <button onClick={() => {setLanguage("go"); toggleDropdown();}}><li className="user-dropdown-item">Go</li></button>
                <button onClick={() => {setLanguage("php"); toggleDropdown();}}><li className="user-dropdown-item">PHP</li></button>
                <button onClick={() => {setLanguage("perl"); toggleDropdown();}}><li className="user-dropdown-item">Perl</li></button>
                <button onClick={() => {setLanguage("racket"); toggleDropdown();}}><li className="user-dropdown-item">Racket</li></button>
            </ul>
        )
        
    }

    function DropdownButton() {
        return (
            <>
                <button id="dropdown-button" onClick={() => toggleDropdown()}>{languageToDisplayName[language]}</button>
                <Dropdown/>
            </>
        )
    }

    return (
        <DropdownButton/>
    )
}