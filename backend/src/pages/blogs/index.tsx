import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../../components/Navbar";
import Link from 'next/link';

export default function BlogPosts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("title");
  
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);

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

    async function handleSubmit() {
        let params: string = "";
        if (searchType === "title") {
          params = `?title=${searchTerm}`
        } else if (searchType === "content") {
          params = `?content=${searchTerm}`
        } else if (searchType === "tag") {
          params = `?tag=${searchTerm}`
        }
    
        const response = await fetch(`http://localhost:3000/api/blogs${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();
        if (response.ok) {
            setBlogs(json);
        } else {
            alert(json.error);
        }
    }
    
    return (
        <>
            <Head>
                <title>Scriptorium Blogs</title>
            </Head>
            <main>
                <div id="blogs-container">
                <div id="middle-column">
                    <h1>Blogs</h1>
                    <br />
                    <div className="search-bar">
                    <button id="blog-search-type-dropdown-button" onClick={() => toggleDropdown()}>
                        {typeToDisplayName[searchType]}
                    </button>
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
                    <div id="blogs-results">
                    <Dropdown />
                    <div id="blogs-grid">
                        {blogs.map((blog) => (
                        <Link key={blog.id} className="blog-item" href={`/blogs/${blog.id}`}>
                            <h3>{blog.title}</h3>
                            <p>{blog.description}</p>
                            <div className="tag-container">
                            {blog.tags.map((tag) => (
                                <div key={tag.id} className="tag">{tag.name}</div>
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
    )
}