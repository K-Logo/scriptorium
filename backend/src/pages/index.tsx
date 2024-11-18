import React, { useContext } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import { UserContext } from "../contexts/user";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        <section>
          <Welcome/>
        </section>
      </main>
    </>
  );
}

function Welcome() {
    const { user, setUser } = useContext(UserContext);
    if (user.id === undefined) {
        return (
            <div className="container">
                <img className="big-icon" src="https://www.cs.toronto.edu/~kianoosh/courses/csc309/resources/handouts/pp1/logo.jpg" alt="Icon"></img>
                <h1>
                Welcome to Scriptorium!
                </h1>
                <p>
                Scriptorium is an innovative online platform where you can write, <br/>execute, and share code in multiple programming languages.
                </p>
                <div className="button-container">
                    <Link href="/login">
                        <button className="blue-button">
                            Login
                        </button>
                    </Link>
                    <Link href="/signup">
                        <button className="blue-button">
                            Sign Up
                        </button>
                    </Link>
                </div>
                <br/><br/><br/><br/><br/>
            </div>
        );
    } else {
        return (
            <div className="container">
                <h1>
                Welcome to Scriptorium, {user.firstName}!
                </h1>
                <p>
                Let's get started...
                </p>
            </div>
        );
    }
}

