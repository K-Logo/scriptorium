import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router"

export default function CreateBlog() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [codeTemplate, setCodeTemplate] = useState(null); 
  const [user, setUser] = useState(null);
  const [authorId, setAuthorId] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    const userJson = window.localStorage.getItem('user');
    const user = JSON.parse(userJson);
    if (!user || !user.jwtToken) {
      router.push("/login");
    } else {
      setUser(user);
      setAuthorId(user.id);
    }
  }, [])

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  async function handleSubmit() {
    const blogData = {
      title,
      description,
      tags, 
      codeTemplate, // Optional
      authorId
    };

    // Send the blog data to an API endpoint
    const response = await fetch("/api/blog/createBlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.jwtToken}`
      },
      body: JSON.stringify(blogData),
    });

    if (response.ok) {
      alert("Blog created successfully!");
      // Redirect or reset form
      setTitle("");
      setDescription("");
      setTags([]);
      setCodeTemplate("");
    } else {
      alert("Failed to create the blog.");
    }
  };

  function handleRemoveTag(deleteTag) {
    setTags(tags.filter((tag) => tag !== deleteTag));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-left mb-4 justify-center">
        <Link href='/blogs'>
          <button
            className="absolute left-[4.5vw] px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            Back
          </button>
        </Link>

        <h1 className="text-2xl font-bold text-center">Create a New Blog</h1>

      </div>      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          placeholder="Enter the blog title"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          placeholder="Enter the blog description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            placeholder="Enter a tag"
          />
          <button
            onClick={handleAddTag}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Tag
          </button>
        </div>
        <div>
            {tags.map((tag) => (
                <div
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-sm mr-2"
                >
                    {tag}
                    <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                    >
                    ✖
                    </button>
                </div>
                ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Code Template (optional)</label>
        <input
          type="text"
          value={codeTemplate?.id || ""}
          onChange={(e) => setCodeTemplate({ id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          placeholder="Enter Code Template ID"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Create Blog
      </button>
    </div>
  );
}
