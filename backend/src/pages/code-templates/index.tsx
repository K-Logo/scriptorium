import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../../components/Navbar";
import Link from 'next/link';

export default function CodeTemplates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [codeTemplates, setCodeTemplates] = useState([]);
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
          <ul className="code-search-type-dropdown">
              <button onClick={() => {setSearchType("title"); toggleDropdown();}}><li>Title</li></button>
              <button onClick={() => {setSearchType("content"); toggleDropdown();}}><li>Content</li></button>
              <button onClick={() => {setSearchType("tag"); toggleDropdown();}}><li>Tag</li></button>
          </ul>
      )
      
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }

  async function handleSubmit() {
    let params: string = "";
    if (searchType === "title") {
      params = `?title=${searchTerm}`
    } else if (searchType === "content") {
      params = `?content=${searchTerm}`
    } else if (searchType === "tag") {
      params = `?tag=${searchTerm}`
    }

    const response = await fetch(`http://localhost:3000/api/codetemplates${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const json = await response.json();
    if (response.ok) {
        setCodeTemplates(json);
    } else {
        alert(json.error);
    }
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
              <button className="code-search-type-dropdown-button" onClick={() => toggleDropdown()}>{typeToDisplayName[searchType]}</button>
              <input
                type="text"
                id="search-text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-button" onClick={handleSubmit}>
                Search
              </button>
            </div>
            <div className="code-templates-results">
              <Dropdown/>
              <div id="code-templates-grid">
                {codeTemplates.map((item) => (
                  <Link key={item.id} className="code-template-item" href={`/code-templates/${item.id}`}>
                    <h3>{item.title}</h3>
                    <p>{item.explanation}</p>
                    <div className="tag-container">
                      {item.tags.map((tag: any) => (
                        <div className="tag">{tag.name}</div>
                      ))}
                    </div>
                    
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

