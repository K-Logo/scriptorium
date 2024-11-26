import React, { useState, useEffect } from 'react';
import { Blog, Comment, Report, User, CodeTemplate, Tag } from "@prisma/client";
import { useRouter } from 'next/router';
import Navbar from "../../components/Navbar";
import Link from 'next/link'
import Head from 'next/head';

export default function BlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [authorUsername, setAuthorUsername] = useState<string>("");
  const [codeTemplate, setCodeTemplate] = useState<CodeTemplate>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      console.log(id);
      const response = await fetch(`http://localhost:3000/api/blogs/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });

      const json = await response.json();

      if (response.ok) {
        setTitle(json.title);
        setDescription(json.description);
        setTags(json.tags);
        setCodeTemplate(json.codeTemplates);
        setComments(json.comments);

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
      }  else {
          alert(json.error);
      }
    }
    fetchData();
    }, [id]);

    async function handleReport() {
      const response = await fetch('/api/report/createReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
      });

      const report = await response.json();

      if (response.ok) {
        console.log("Successfully reported");
      } else {
        alert(report.error);
      }
    }

    async function handleUpvote() {
      const response = await fetch('/api/blog/{id}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: "upvote" }) 
      });
      const jsonResponse = await response.json();

      if (response.ok) {
        console.log("Successfully upvoted");
      } else {
        alert(jsonResponse.error);
      }
    }

    function Blog() {
      return (
        authorUsername && (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div className="mb-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="border border-gray-300 px-3 py-1 mb-2 rounded-lg inline-block bg-gray-100 text-gray-800"
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <p className="text-lg mb-4">{description}</p>
            <p className="text-sm text-gray-600 mb-4">Author: {authorUsername}</p>
            {codeTemplate && (
              <Link
                href={`/api/codetemplates/${codeTemplate.id}`}
                className="text-blue-500 hover:underline mb-4 block"
              >
                Open Code Template
              </Link>
            )}
            <button
              onClick={handleReport}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Report
            </button>
          </div>
        )
      );
    }

    return (
      <>
        <Head>
        <title>Scriptorium Blog</title>
        </Head>
        <main>
        <div id="code-templates-container">
            <div id="middle-column">
                <Blog/>
            </div>
        </div>
        </main>
    </>
    )
}
