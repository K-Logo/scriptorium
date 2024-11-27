import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
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
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userJson = window.localStorage.getItem('user');
        const user = JSON.parse(userJson);
        if (user) {
            router.push("/run");
            setUser(user);
        }
    }, []);

    if (user) {
        return null;
    } else {
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
    }
}
