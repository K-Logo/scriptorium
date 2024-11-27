import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user";
import Link from 'next/link';
import Head from 'next/head';

export default function EditBlog(blogId) {
    async function getBlog() {
        const blog = await fetch(`/api/blog/${blogId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const jsonBlog = await blog.json();
        return jsonBlog;
    }
    
    useEffect(() => {
        async function fetchBlog() {
            const blogData = await getBlog();
            setBlog(blogData);
        }
        fetchBlog();
    }, [blogId]);

    const [blog, setBlog] = useState(null);
    const [title, setTitle] = useState<string>(blog.title);
    const [description, setDescription] = useState<string>(blog.description);
    const [tags, setTags] = useState(blog.tags.name);
    const [tagInput, setTagInput] = useState<string>("");
    const [codeTemplateId, setCodeTemplateId] = useState<number>(blog.codeTemplateId); 
    const { user } = useContext(UserContext)
    const authorId = user.id;

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setTags([...tags, { name: tagInput }]); // TODO: change this to create a tag
            setTagInput("");
        }
    };

    function handleRemoveTag(id) {
        setTags(tags.filter((tag) => tag.id !== id));
      }

    async function handleSave() {
        const updatedData = {
            newTitle: title,
            newDescription: description,
            newTags: tags,
            newCodeTemplateId: codeTemplateId,
        }
        const response = await fetch(`/api/blog/${blogId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Successfully edited blog");
        } else {
            alert(result.errro);
        }
    }

    return (
        <div className="container mx-auto p-6 bg-gray-900 text-gray-300">
            <h1 className="text-3xl font-bold mb-4">Edit Blog</h1>
            <div className="mb-4">
                <label className="block mb-2 font-medium">Title</label>
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-gray-300"
                placeholder="Blog Title"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-gray-300"
                placeholder="Blog Description"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-medium">Tags</label>
                <div className="flex items-center mb-2">
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
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
            </div>
            <div className="mb-4">
                <label className="block mb-2 font-medium">Code Template</label>
                <input
                type="text"
                value={codeTemplateId}
                //onChange={(e) => setCodeTemplateId(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-gray-300"
                placeholder="Code Template ID"
                />
            </div>
            <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded text-white"
            >
                Save Changes
            </button>
            <Link href={`/blogs/${blog.id}`}>
                <a className="ml-4 px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded text-gray-300">Cancel</a>
            </Link>
            </div>
    )
}