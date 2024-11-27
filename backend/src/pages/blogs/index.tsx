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
    const [blogs, setBlogs] = useState([]);

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
    }, []);
    
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
                                    className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition duration-200"
                                    href={`/blogs/${blog.id}`}
                                    >
                                    <h3 className="text-xl font-semibold">{blog.title}</h3>
                                    <p className="text-blue-700 mt-2">{blog.description}</p>
                                    <p>{blog.author.username}</p>
                                    {blog.tags.map((tag) =>
                                        <div className="tag">{tag.name}</div>
                                    )}
                                    <p>{blog.rating}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 text-center absolute right-[7vw] top-[20vw]">
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