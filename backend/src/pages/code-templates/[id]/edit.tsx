import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Navbar from "../../../components/Navbar";
import { Editor } from "@monaco-editor/react";
import { UserContext, UserProvider } from "../../../contexts/user";
import { LanguageContext, LanguageProvider } from "@/contexts/language";
import LangDropdown from "@/components/LangDropdown";

export default function CodeTemplateId() {
    const router = useRouter();
    const { id } = router.query;
    const [title, setTitle] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const { language, setLanguage } = useContext(LanguageContext);
    const [tags, setTags] = useState([]);
    const [addedTags, setAddedTags] = useState<string[]>([]);
    const [removedTags, setRemovedTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");
    const { user, setUser } = useContext(UserContext);
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

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setAddedTags([...addedTags, tagInput]); // TODO: change this to create a tag
            setTagInput("");
        }
    };

    const handleRemoveAddedTag = (toRemove: string) => {
        setAddedTags(addedTags.filter((tag) => tag !== toRemove));
    }


    function handleRemoveTag(toRemove: string) {
        setRemovedTags([...removedTags, toRemove]);
        setTags(tags.filter((tag) => tag.name !== toRemove));
        console.log(tags);
      }

    const handleEditorChange = (value: string) => {
        setContent(value);
    };

    // Below runs when page is mounted
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            console.log(id)
            const response = await fetch(`http://localhost:3000/api/codetemplates/${id}`, {
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
                setTags(json.tags);
                setLanguage(json.language);

            } else {
                alert(json.error);
            }
        }
        fetchData();
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();
        const body = {};
        

        const response = await fetch(`http://localhost:3000/api/codetemplates/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.jwtToken}`
            },
            body: JSON.stringify({
                newTitle: title,
                newExplanation: explanation,
                newContent: content,
                newLanguage: language
            })
        });
        const json = await response.json();
        if (response.ok) {
            if (removedTags.length !== 0) {
                for (const removedTag of removedTags) {
                    await fetch(`http://localhost:3000/api/codetemplates/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.jwtToken}`
                        },
                        body: JSON.stringify({
                            deleteTag: removedTag
                        })
                            
                    });
                }
                
            }
            if (addedTags.length !== 0) {
                for (const addedTag of addedTags) {
                    await fetch(`http://localhost:3000/api/codetemplates/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.jwtToken}`
                        },
                        body: JSON.stringify({
                            newTag: addedTag
                        })
                            
                    });
                }
                
            }
            alert("Successfully edited code template!")
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

    async function handleDelete(event) {
        event.preventDefault();
        

        const response = await fetch(`http://localhost:3000/api/codetemplates/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.jwtToken}`
            }
        });
        const json = await response.json();
        if (response.ok) {
            alert("Successfully deleted code template.");
        } else {
            alert(json.error);
        }
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
            <div className="code-template-entry-header">
                    <div id="title-container">
                        <h1>Edit code template</h1>
                    </div>
                    <div>
                        <button className="blue-button" id="delete-button" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
                
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
                            key={tag.name}
                            className="flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm mr-2 mb-2"
                            >
                            {tag.name}
                            <button
                                onClick={() => handleRemoveTag(tag.name)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                            </div>
                        ))}
                        {addedTags.map((tag) => (
                            <div
                            key={tag}
                            className="flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm mr-2 mb-2"
                            >
                            {tag}
                            <button
                                onClick={() => handleRemoveAddedTag(tag)}
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

