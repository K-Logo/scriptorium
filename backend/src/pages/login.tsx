import React, { useContext, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import { UserContext, UserProvider } from "../contexts/user";

export default function LogIn() {
  return (
    <>
      <Head>
        <title>Scriptorium Log in</title>
      </Head>
      <main>
        <LogInForm/>
      </main>
    </>
  );
}

function LogInForm() {
    const router = useRouter();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        console.log(user);
    }, [user]);

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const response = await fetch("http://localhost:3000/api/users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });
        const json = await response.json();
        if (response.ok) {
            alert("Log in successful!");

            // Fetch user info
            const userResponse = await fetch(`http://localhost:3000/api/users/${json.id}?type=user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const userJson = await userResponse.json();
            if (response.ok) {
                setUser({
                    id: userJson.id,
                    username: userJson.username,
                    firstName: userJson.firstName,
                    lastName: userJson.lastName,
                    email: userJson.email,
                    phoneNumber: userJson.phoneNumber,
                    avatarPath: userJson.avatarPath,
                    role: userJson.role,
                    jwtToken: json.token
                });
                router.push("/run")
            } else {
                alert(userJson.error);
            }
        } else {
            alert(json.error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>
                Log in
            </h1>
            <div id="input-fields">
                <label>
                    Username:
                    <input name="username"/>
                </label>
                <label>
                    Password:
                    <input type="password" name="password"/>
                </label>
            </div>
            <button type="submit" className="blue-button">Submit</button>
            <br/><br/><br/><br/><br/>
        </form>
    )
}

