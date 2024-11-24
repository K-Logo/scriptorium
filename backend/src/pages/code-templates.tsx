import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";

export default function CodeTemplates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const typeToDisplayName = {
      "title": "Title",
      "content": "Content",
      "tag": "Tag"
  };

  function toggleDropdown() {
      setDropdownOpen(!dropdownOpen);
  }

  function Dropdown() {
      return dropdownOpen && (
          <ul id="code-search-type-dropdown">
              <button onClick={() => {setSearchType("title"); toggleDropdown();}}><li>Title</li></button>
              <button onClick={() => {setSearchType("content"); toggleDropdown();}}><li>Content</li></button>
              <button onClick={() => {setSearchType("tag"); toggleDropdown();}}><li>Tag</li></button>
          </ul>
      )
      
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }


  return (
    <>
      <Head>
        <title>Scriptorium Code Templates</title>
      </Head>
      <main>
        <div id="code-templates-container">
          <div id="middle-column">
            <h1>
                Code templates
            </h1>
            <br/>
            <div className="search-bar">
              <button id="code-search-type-dropdown-button" onClick={() => toggleDropdown()}>{typeToDisplayName[searchType]}</button>
              <input
                type="text"
                id="search-text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-button">
                Search
              </button>
            </div>
            <div id="code-templates-results">
              <Dropdown/>
              <div id="code-templates-grid">

              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

