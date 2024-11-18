import React, { useContext } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import { UserContext, UserProvider } from "../contexts/user";

function SignUp() {
  return (
    <>
      <Head>
        <title>Scriptorium Sign Up</title>
      </Head>
      <main>
        <SignUpForm/>
      </main>
    </>
  );
}

function SignUpForm() {
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const email = formData.get("email");
        const phoneNumber = formData.get("phone-number");
        const password = formData.get("password");
        const firstName = formData.get("first-name");
        const lastName = formData.get("last-name");

        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Phone Number:', phoneNumber);
        console.log('Password:', password); // Be cautious about logging sensitive data like passwords!
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        const response = await fetch("http://localhost:3000/api/users/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
            })
        });
        const json = await response.json();
        if (response.ok) {
            alert(json.message);
        } else {
            alert(json.error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                First name:
                <input name="first-name"/>
            </label>
            <label>
                Last name:
                <input name="last-name"/>
            </label>
            <label>
                Username:
                <input name="username"/>
            </label>
            <label>
                Email:
                <input name="email"/>
            </label>
            <label>
                Phone number:
                <input name="phone-number"/>
            </label>
            <label>
                Password:
                <input name="password"/>
            </label>
            <button type="submit" className="blue-button">Submit</button>
        </form>
    )
}

export default function SignUpWithContext() {
    return (
        <UserProvider>
            <SignUp />
        </UserProvider>
    )
}

