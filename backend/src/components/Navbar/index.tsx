import React from "react";
import Link from 'next/link';

export default function Navbar() {
    function toggleHamburger() {
        const menu = document.getElementById("nav-links-sm");
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block"
        }
    }

    return (
        <>
            <header id="header">
                <Link href="/"><img className="icon" src="https://www.cs.toronto.edu/~kianoosh/courses/csc309/resources/handouts/pp1/logo.jpg" alt="Icon"></img></Link>
                <button className = "icon" id="hamburger-menu" onClick={() => toggleHamburger()}><img src="https://img.icons8.com/m_rounded/512/FFFFFF/menu.png" alt="Hamburger"></img></button>
                <ul id="nav-links">
                    <li><Link href="/run">Run</Link></li>
                    <li><Link href="/code-templates">Code Templates</Link></li>
                    <li><Link href="/blogs">Blogs</Link></li>
                </ul>
            </header>
                <ul id="nav-links-sm">
                    <li><Link href="/run">Run</Link></li>
                    <li><Link href="/code-templates">Code Templates</Link></li>
                    <li><Link href="/blogs">Blogs</Link></li>
                </ul> 
        </>
    )
}