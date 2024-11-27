import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Link from 'next/link';

export default function BlogPosts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("title");
  
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortType, setSortType] = useState("desc");
    const [sortDropdownOpen, setSortDropdown] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);

    async function getAllBlogs() {
        const blogs = await fetch(`/api/blog/sortBlogs?sortType=${sortType}`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return blogs;
    }

    useEffect(() => {
        async function fetchBlogs() {
            const blogs = await getAllBlogs();
            const blogsJson = await blogs.json();
            setBlogs(blogsJson.allPosts);
        }
        fetchBlogs();

        const userJson = window.localStorage.getItem('user');
        const user = JSON.parse(userJson);
        if (user) {
            setUser(user);
        }
    }, [sortType]);
    
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
            <ul className="code-search-type-dropdown ">
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
    
        const response = await fetch(`/api/blogs${params}`, {
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
                            <div className="pb-[2vw] relative p-0">
                                <button className="code-search-type-dropdown-button" onClick={() => toggleDropdown()}>
                                    {typeToDisplayName[searchType]}
                                </button>
                                <Dropdown />
                            </div>
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
                            <div>
                                {user && 
                                    <Link href='/blogs/create'>
                                        <button className="search-button">
                                            Write Blog
                                        </button>
                                    </Link>
                                }
                            </div>
                        </div>
                        <div className="code-templates-results">
                            <div className="relative p-0">
                                <button className="code-search-type-dropdown-button" onClick={() => toggleSortDropdown()}>
                                    {sortToDisplayName[sortType]}
                                </button>
                                <SortDropdown />
                            </div>
                    
                            <div
                                className="space-y-4 px-2 max-w-prose mx-auto"
                                >
                                {blogs.map((blog) => (
                                    <Link
                                    key={blog.id}
                                    className="block p-4 bg-[#3e315c] hover:bg-[#533b8a] transition duration-300 duration-200"
                                    href={`/blogs/${blog.id}`}
                                    >
                                        <div className="flex flex-row items-center justify-between">
                                            <h3 className="text-[20px] font-bold">{blog.title}</h3>
                                            <p className="m-0">Poster: {blog.author.username}</p>
                                        </div>
                                        <div className="flex flex-row items-center justify-between">
                                            <p className="m-0">{blog.description}</p>
                                            <p>Rating: {blog.rating}</p>
                                        </div>
                                        
                                        
                                        
                                        <div className="tag-container">
                                            {blog.tags.map((tag) =>
                                                <div className="tag">{tag.name}</div>
                                            )}
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