import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../../components/Navbar";
import { Editor } from "@monaco-editor/react";
import { UserContext, UserProvider } from "../../contexts/user";
import { LanguageContext, LanguageProvider } from "@/contexts/language";
import LangDropdown from "@/components/LangDropdown";

export default function CodeTemplateId() {
    const router = useRouter();
    type QueryParams = {
        parentId?: string;
        codeTyped?: string;
        languagePassed?: string; 
      };
    const { parentId, codeTyped, languagePassed } = router.query as QueryParams;
    const parentIdInt: number = parseInt(parentId);
    const [title, setTitle] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");
    let contentDefaultValue: string;
    if (codeTyped) {
        contentDefaultValue = codeTyped;
    } else {
        contentDefaultValue = "";
    }
    
    const [content, setContent] = useState<string>(contentDefaultValue);
    const {language, setLanguage} = useContext(LanguageContext);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");
    const { user, setUser } = useContext(UserContext);

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setTags([...tags, tagInput]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (toRemove: string) => {
        setTags(tags.filter((tag) => tag !== toRemove));
    }


    const handleEditorChange = (value: string) => {
        setContent(value);
    };

    // Below runs when page is mounted
    useEffect(() => {
        if (languagePassed) {
            setLanguage(languagePassed);
        }
        if (!parentIdInt) return;
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/api/codetemplates/${parentIdInt}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            if (response.ok) {
                setTitle(json.title);
                setExplanation(json.explanation);
                setContent(json.content);
                setTags(json.tags.map(tag => tag.name));
                setLanguage(json.language);

            } else {
                alert(json.error);
            }
        }
        fetchData();
    }, [parentIdInt]);


    async function handleSubmit(event) {
        event.preventDefault();
        let body;
        console.log(tags);
        
        if (parentIdInt) {
            body = {
                title: title,
                explanation: explanation,
                content: content,
                tags: tags,
                userId: user.id,
                language: language,
                parentId: parentIdInt
            };
        } else {
            body = {
                title: title,
                explanation: explanation,
                content: content,
                tags: tags,
                userId: user.id,
                language: language
            };
        }
        
        

        const response = await fetch(`http://localhost:3000/api/codetemplates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.jwtToken}`
            },
            body: JSON.stringify(body)
        });
        const json = await response.json();
        if (response.ok) {
            alert("Code template successfully created!")
            router.push(`/code-templates/${json.id}`)
            
        } else {
            alert(json.error);
        }
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const handleExplanationChange = (event) => {
        setExplanation(event.target.value);
    }

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    }

    const handleTagInputChange = (event) => {
        setTagInput(event.target.value);
    }

    return (
    <>
        <Head>
        <title>Scriptorium Code Templates</title>
        </Head>
        <main>
        <div id="code-templates-container">
            <div id="middle-column">
            <div id="code-template-entry">
                <h1>
                    Create code template
                </h1>
                <div id="input-fields">
                    <label>
                        Title:
                        <input type="text" value={title} onChange={handleTitleChange}/>
                    </label>
                        
                    <label>
                        Explanation:
                        <input type="text" value={explanation} onChange={handleExplanationChange}/>
                    </label>

                    <LangDropdown/>

                    <div className="flex flex-wrap">
                        {tags.map((tag) => (
                            <div
                            key={tag}
                            className="flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm mr-2 mb-2"
                            >
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center mb-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={handleTagInputChange}
                            className="flex-1 p-2 rounded bg-gray-800 text-gray-300"
                            placeholder="Add a new tag"
                        />
                        <button
                            onClick={handleAddTag}
                            className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                        >
                            Add
                        </button>
                    </div>

                    <Editor
                        theme="vs-dark"
                        language={language}
                        value={content}
                        height="800px"
                        options={{
                            fontSize: 18,
                            minimap: { enabled: false },
                            scrollbar: {
                                alwaysConsumeMouseWheel: false
                            }
                        }}
                        onChange={handleEditorChange}
                    />

                    
                </div>
                <button className="blue-button" onClick={handleSubmit}>Save</button>
                
            </div>
            </div>
        </div>
        </main>
    </>
  );
}

