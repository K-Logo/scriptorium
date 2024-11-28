import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../../../components/Navbar";
import { Editor } from "@monaco-editor/react";
import Link from 'next/link';

export default function CodeTemplateId() {
    const router = useRouter();
    type QueryParams = {
        id: string;
    }
    const { id } = router.query as QueryParams;
    const [title, setTitle] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [parentId, setParentId] = useState<number | null>(null);
    const [language, setLanguage] = useState<string>("");
    const [authorUsername, setAuthorUsername] = useState<string>("");
    const [authorAvatar, setAuthorAvatar] = useState<string>("");
    const [tags, setTags] = useState([]);
    const [copied, setCopied] = useState(false);
    const [user, setUser] = useState(null);
    const languageToDisplayName = {
        "py3": "Python3",
        "java": "Java 21",
        "cpp": "C++ 14",
        "c": "C",
        "javascript": "JavaScript",
        "r": "R",
        "ruby": "Ruby",
        "go": "Go",
        "php": "PHP",
        "perl": "Perl",
        "racket": "Racket",
    };
    const monacoMap = {
        "py3": "python",
        "java": "java",
        "cpp": "cpp",
        "c": "c",
        "javascript": "javascript",
        "r": "r",
        "ruby": "ruby",
        "go": "go",
        "php": "php",
        "perl": "perl",
        "racket": "racket",
    };    


    // Function generated by ChatGPT
    const handleCopy = () => {
        navigator.clipboard.writeText(id).then(() => {
            setCopied(true);
            // Reset copied status after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };


    // Below runs when page is mounted
    useEffect(() => {
        const userJson = window.localStorage.getItem('user');
        const user = JSON.parse(userJson);
        if (user) {
            setUser(user);
        } else {
            router.push(`/run`);
        }

        if (!id) return;
        const fetchData = async () => {
            console.log(id)
            const response = await fetch(`/api/codetemplates/${id}`, {
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

                const userResponse = await fetch(`/api/users/${json.userId}?type=user`, {
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
                    setAuthorAvatar(userJson.avatarPath);
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
                    <div id="title-container">
                        <h1>{title}</h1>
                        <p>{languageToDisplayName[language]}</p>
                    </div>
                    <div>
                        {user && user.username === authorUsername && <Link href={`/code-templates/${id}/edit`}><button className="blue-button">Edit</button></Link>}
                        {user && <Link href={`/code-templates/create?parentId=${id}`}><button className="blue-button">Fork</button></Link>}
                        <Link href={`/run?prepopulatedCode=${encodeURIComponent(content)}&predefinedLanguage=${language}`}><button className="blue-button">Run</button></Link>
                    </div>
                </div>
                <div className="flex flex-row items-center w-[35%] justify-between">
                    <button onClick={handleCopy} className="hover:underline"><p>ID: {id}</p></button><p className="text-[#9f98b3]">    {copied ? 'Copied!' : 'Click ID to copy'}    </p>{parentId ? <p className="hover:underline"><Link href={`/code-templates/${parentId}`}>Forked from: {parentId}</Link></p> : <p>Forked from: None</p>}
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
                    language={monacoMap[language]}
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

