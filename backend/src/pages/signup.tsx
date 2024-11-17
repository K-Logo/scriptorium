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
    async function handleSubmit(formData) {
        const username = formData.get("username");
        const email = formData.get("email");
        const phoneNumber = formData.get("phone-number");
        const password = formData.get("password");
        const firstName = formData.get("first-name");
        const lastName = formData.get("last-name");

        const response = await fetch("", {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                email: email,
                phoneNumber: phoneNumber,
                password: password,
                firstName: firstName,
                lastName: lastName
            })
        })
    }

    return (
        <form action={handleSubmit}>
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

