import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';

export default function Report() {
    const router = useRouter()
    const [description, setDescription] = useState();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userJson = window.localStorage.getItem('user');
        const user = JSON.parse(userJson);
        if (user) {
            setUser(user);
        } else {
            router.push('/login');
        }
    }, [])

    const { blogId, commentId } = router.query;

    async function handleSubmit() {
        const response = await fetch(`/api/report/createReport`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${user.jwtToken}`
            },
            body: JSON.stringify({content: description, blogId: blogId, commentId: commentId})
        });
        
        const json = await response.json();

        if (response.ok) {
            console.log("test1")
            alert("Successfully submitted report");

            setDescription("");
        } else {
            console.log("test2")
            alert(json.error);
        }
    }

    return (
        <>
            <Head>
                <title>Scriptorium Report</title>
            </Head>
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-8 w-full max-w-2xl">
                <h1 className="text-2xl font-semibold mb-4">Report Issue</h1>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="6"
                        className="w-full max-w-4xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#302b3c]"
                        placeholder="Enter a description of the issue"
                    />
                    <div className="flex justify-end">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                        onClick={handleSubmit}
                    >
                        Submit Report
                    </button>
                    </div>
                </div>
            </div>

        </>
    )
}
