import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function EditBlog() {
  const router = useRouter();
  type QueryParams = {
    blogId: string;
  }
  const { blogId } = router.query as QueryParams;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState([]);
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [removedTags, setRemovedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [codeTemplateId, setCodeTemplateId] = useState<number | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userJson = window.localStorage.getItem('user');
    const user = JSON.parse(userJson);
    if (!user || !user.jwtToken) {
      router.push("/run");
    } else {
        setUser(user);
    }

    if (!blogId) return;
    const fetchBlogData = async () => {
      const response = await fetch(`/api/blog/${blogId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      if (response.ok) {
        setTitle(json.title);
        setDescription(json.description);
        setTags(json.tags);
        setCodeTemplateId(json.codeTemplateId);
      } else {
        alert(json.error);
      }
    };

    fetchBlogData();
  }, [blogId]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setAddedTags([...addedTags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveAddedTag = (toRemove: string) => {
    setAddedTags(addedTags.filter((tag) => tag !== toRemove));
  };

  const handleRemoveTag = (toRemove: string) => {
    setRemovedTags([...removedTags, toRemove]);
    setTags(tags.filter((tag) => tag.name !== toRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedData = {
      newTitle: title,
      newDescription: description,
      newCodeTemplateId: codeTemplateId,
    };

    const response = await fetch(`/api/blog/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.jwtToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    const json = await response.json();
    if (response.ok) {
      if (removedTags.length !== 0) {
        for (const removedTag of removedTags) {
          await fetch(`/api/blog/${blogId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.jwtToken}`,
            },
            body: JSON.stringify({
              deleteTag: removedTag,
            }),
          });
        }
      }

      if (addedTags.length !== 0) {
        for (const addedTag of addedTags) {
          await fetch(`/api/blog/${blogId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.jwtToken}`,
            },
            body: JSON.stringify({
              newTag: addedTag,
            }),
          });
        }
      }

      alert("Successfully edited blog!");
      router.push(`/blogs/${blogId}`);
    } else {
      alert(json.error);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    const response = await fetch(`/api/blog/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.jwtToken}`,
      },
    });
    
    if (response.ok) {
      alert("Successfully deleted blog.");
      router.push("/blogs");
    } else {
      alert("Error deleting the blog.");
    }
  };

  return (
    <>
      <Head>
        <title>Edit Blog</title>
      </Head>
      <main>
        <div id="code-templates-container">
          <div id="middle-column">
            <div id="code-template-entry">
              <div className="code-template-entry-header">
                <div id="title-container">
                  <h1>Edit Blog</h1>
                </div>
                <div>
                  <button
                    className="blue-button"
                    id="delete-button"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div id="input-fields">
                <label>
                  Title:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#302a3d] w-72 h-8 mx-2 px-2 rounded"
                  />
                </label>
                <label>
                  Description:
                  <input type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-[#302a3d] mx-2 px-2 py-1 rounded resize-none"
                  />
                </label>
                <label>
                  Tags:
                  <div className="flex flex-wrap">
                    {tags.map((tag) => (
                      <div
                        key={tag.name}
                        className="flex items-center px-3 py-1 bg-[#3e315c] text-gray-300 rounded-full text-sm mr-2 mb-2"
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
                        className="flex items-center px-3 py-1 bg-[#3e315c] text-gray-300 rounded-full text-sm mr-2 mb-2"
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
                </label>
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="bg-[#302a3d] flex-1 h-8 mx-2 px-2 rounded"
                    placeholder="Add a new tag"
                  />
                  <button
                    onClick={handleAddTag}
                    className="blue-button"
                  >
                    Add
                  </button>
                </div>
                <label>
                  Code Template ID:
                  <input
                    type="number"
                    value={codeTemplateId || ""}
                    onChange={(e) => setCodeTemplateId(Number(e.target.value))}
                    className="bg-[#302a3d] w-72 h-8 mx-2 px-2 rounded"
                  />
                </label>
                <div className="mt-6">
                  <button className="blue-button" onClick={handleSubmit}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
