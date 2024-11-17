import React, { useContext } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import { UserContext, UserProvider } from "../contexts/user";

function Home() {
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

export default function HomeWithContext() {
    return (
        <UserProvider>
            <Home />
        </UserProvider>
    )
}

