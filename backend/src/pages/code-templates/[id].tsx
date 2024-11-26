import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../../components/Navbar";
import { Editor } from "@monaco-editor/react";

export default function CodeTemplateId() {
    const router = useRouter();
    const { id } = router.query;
    const [title, setTitle] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [parentId, setParentId] = useState<number>(-1);
    const [language, setLanguage] = useState<string>("");
    const [authorUsername, setAuthorUsername] = useState<string>("");
    const [authorAvatar, setAuthorAvatar] = useState<string>("");
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
                setLanguage(json.language);

                const userResponse = await fetch(`http://localhost:3000/api/users/${json.userId}?type=user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const userJson = await userResponse.json();
                if (response.ok) {
                    setAuthorUsername(userJson.username);
                    console.log("asdf")
                    console.log(userJson.avatarPath)
                    setAuthorAvatar("http://" + userJson.avatarPath);
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
        console.log(authorAvatar);
        return authorUsername && (
            <div id="code-template-entry">
                <div className="code-template-entry-header">
                    <h1>{title}</h1>
                    <div>
                        <button className="blue-button">Edit</button>
                        <button className="blue-button">Fork</button>
                    </div>
                </div>
                <div className="code-template-entry-header">
                    <p>{explanation}</p>
                    <div id="code-template-entry-user-info">
                        <img className="icon" src={authorAvatar} alt="User Icon"></img>
                        <p>{authorUsername}</p>
                    </div>
                </div>
                <div className="tag-container">
                    {tags.map((tag: any) => (
                    <div className="tag">{tag.name}</div>
                    ))}
                </div>
                
                <Editor
                    theme="vs-dark"
                    language={language}
                    value={content}
                    height="800px"
                    options={{
                        readOnly: true,
                        fontSize: 18,
                        minimap: { enabled: false },
                        scrollbar: {
                            alwaysConsumeMouseWheel: false
                        }
                    }}
                />
                <p>{parentId}</p>
                
                
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

