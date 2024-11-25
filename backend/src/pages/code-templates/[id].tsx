import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../../components/Navbar";

export default function CodeTemplateId() {
    const router = useRouter();
    const { id } = router.query;
    const [title, setTitle] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [parentId, setParentId] = useState<number>(-1);
    const [authorUsername, setAuthorUsername] = useState<string>("");
    const [tags, setTags] = useState([]);


    // Below runs when page is mounted
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            console.log(id)
            const response = await fetch(`http://localhost:3000/api/codetemplates/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const json = await response.json();
            if (response.ok) {
                setTitle(json.title);
                setExplanation(json.explanation);
                setContent(json.content);
                setParentId(json.parentId);
                setTags(json.tags);

                const userResponse = await fetch(`http://localhost:3000/api/users/${json.userId}?type=user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const userJson = await userResponse.json();
                if (response.ok) {
                    setAuthorUsername(userJson.username);
                } else {
                    alert(json.error);
                }

            } else {
                alert(json.error);
            }
        }
        fetchData();
    }, [id]);

    function CodeTemplate() {
        return authorUsername && (
            <div id="code-template-entry">
                <h1>{title}</h1>
                <p>{explanation}</p>
                <p>{content}</p>
                <p>{parentId}</p>
                <p>{authorUsername}</p>
                
                
            </div>
        );
    }

    return (
    <>
        <Head>
        <title>Scriptorium Code Templates</title>
        </Head>
        <main>
        <div id="code-templates-container">
            <div id="middle-column">
                <CodeTemplate/>
            </div>
        </div>
        </main>
    </>
  );
}

