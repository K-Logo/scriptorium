import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../../components/Navbar";
import Link from 'next/link';
import { UserContext } from '../../contexts/user'

export default function BlogPosts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("title");
  
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortType, setSortType] = useState("desc");
    const [sortDropdownOpen, setSortDropdown] = useState(false);
    const { user } = useContext(UserContext);

    async function getAllBlogs() {
        const blogs = await fetch(`/api/blogs/sortBlogs?sortType=${sortType}`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return blogs
    }

    useEffect(() => {
        async function fetchBlogs() {
            const blogs = await getAllBlogs();
            const blogsJson = await blogs.json();
            setBlogs(blogsJson);
        }
        fetchBlogs();
    })

    const [blogs, setBlogs] = useState([]);

    
    const typeToDisplayName = {
        "title": "Title",
        "content": "Content",
        "tag": "Tag"
    };

    const sortToDisplayName = {
        "asc": "Ascending Ratings",
        "desc": "Descending Ratings",
    }

    function toggleSortDropdown() {
        setSortDropdown(!sortDropdownOpen);
    }

    function SortDropdown() {
        return sortDropdownOpen && (
            <ul id="code-search-type-dropdown">
                <button onClick={() => {setSortType("asc"); toggleSortDropdown();}}><li>Ascending Ratings</li></button>
                <button onClick={() => {setSortType("desc"); toggleSortDropdown();}}><li>Descending Ratings</li></button>
            </ul>
        )
    }

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
                <div id="code-templates-container">
                    <div id="middle-column">
                        <h1>Blogs</h1>
                        <br />
                        <div className="search-bar">
                            <button id="code-search-type-dropdown-button" onClick={() => toggleDropdown()}>
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
                        <div id="code-templates-results">
                            <Dropdown />
                            <div className="pt-[3vw]">
                                <button id="code-search-type-dropdown-button" onClick={() => toggleSortDropdown()}>
                                    {sortToDisplayName[sortType]}
                                </button>
                                <SortDropdown />
                            </div>
                            <div id="code-templates-grid">
                                {blogs.map((blog) => (
                                    <Link key={blog.id} className="code-templates-item" href={`/blogs/${blog.id}`}>
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
                        <div className="mt-6 text-center absolute right-[7vw] bottom-[5vw]">
                            {user.id && 
                                <Link href='/blogs/create'>
                                    <button className="blue-button">
                                        Write Blog
                                    </button>
                                </Link>
                            }
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}