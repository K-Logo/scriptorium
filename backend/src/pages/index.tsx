import React from "react";
import Head from "next/head";
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
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
      <Head>
        <title>Scriptorium</title>
        <meta name="description" content="The new way of writing code!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header id="header">
            <img className="icon" src="https://www.cs.toronto.edu/~kianoosh/courses/csc309/resources/handouts/pp1/logo.jpg" alt="Icon"></img>
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

      <main>
        <section>
          <div className="container">
            <h1>
              Welcome to Scriptorium!
            </h1>
            <p>
            Scriptorium is an innovative online platform where you can write, execute, and share code in multiple programming languages.
            </p>
            <button className="blue-button">
              Login
            </button>
            <button className="blue-button">
              Sign Up
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

