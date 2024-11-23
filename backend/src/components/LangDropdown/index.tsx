import React, { useContext, useState } from "react";
import Link from 'next/link';
import { LanguageContext } from "@/contexts/language";

export default function LangDropdown() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { language, setLanguage } = useContext(LanguageContext);

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
    }

    function Dropdown() {
        return dropdownOpen && (
            <ul id="language-dropdown">
                <button onClick={() => {setLanguage("JavaScript"); toggleDropdown();}}><li className="user-dropdown-item">JavaScript</li></button>
                <button onClick={() => {setLanguage("Python"); toggleDropdown();}}><li className="user-dropdown-item">Python</li></button>
                <button onClick={() => {setLanguage("C++"); toggleDropdown();}}><li className="user-dropdown-item">C++</li></button>
                <button onClick={() => {setLanguage("Java"); toggleDropdown();}}><li className="user-dropdown-item">Java</li></button>
                <button onClick={() => {setLanguage("C"); toggleDropdown();}}><li className="user-dropdown-item">C</li></button>
                <button onClick={() => {setLanguage("Ruby"); toggleDropdown();}}><li className="user-dropdown-item">Ruby</li></button>
                <button onClick={() => {setLanguage("Go"); toggleDropdown();}}><li className="user-dropdown-item">Go</li></button>
                <button onClick={() => {setLanguage("Rust"); toggleDropdown();}}><li className="user-dropdown-item">Rust</li></button>
                <button onClick={() => {setLanguage("Swift"); toggleDropdown();}}><li className="user-dropdown-item">Swift</li></button>
                <button onClick={() => {setLanguage("Kotlin"); toggleDropdown();}}><li className="user-dropdown-item">Kotlin</li></button>

            </ul>
        )
        
    }

    function DropdownButton() {
        return (
            <>
                <button id="dropdown-button" onClick={() => toggleDropdown()}>{language}</button>
                <Dropdown/>
            </>
        )
    }

    return (
        <DropdownButton/>
    )
}