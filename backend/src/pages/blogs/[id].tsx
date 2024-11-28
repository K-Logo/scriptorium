import React, { useState, useEffect, useContext } from 'react';
import { Blog, Comment, Report, User, CodeTemplate, Tag } from "@prisma/client";
import { useRouter } from 'next/router';
import Link from 'next/link'
import Head from 'next/head';

export default function BlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);

  async function getBlog() {
    const blog = await fetch(`/api/blog/${id}`, {
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
          setRating(blogData.rating)
      }
      fetchBlog();

      const userJson = window.localStorage.getItem('user');
      const user = JSON.parse(userJson);
      if (user) {
        setUser(user);
      }
  }, [id]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [authorUsername, setAuthorUsername] = useState<string>("");
  const [codeTemplate, setCodeTemplate] = useState<CodeTemplate>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState<number>(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState<string>("");
  const [user, setUser] = useState(null);
  const [showReportBox, setShowReportBox] = useState(false); // Manage visibility of report box
  const [reportReason, setReportReason] = useState(""); // Store the report reason
  const [showCommentReportBox, setShowCommentReportBox] = useState(false);
  const [commentReportReason, setCommentReportReason] = useState("");
  const [sortType, setSortType] = useState("desc");
  const [sortDropdownOpen, setSortDropdown] = useState(false);
  const [replyBoxVisible, setReplyBoxVisible] = useState<number | null>(null); // Tracks which comment's reply box is visible
  const [replyText, setReplyText] = useState("");
  const [repliesVisible, setRepliesVisible] = useState({}); // Tracks which comments have their replies dropdown open

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });

      const json = await response.json();
      console.log(json);

      if (response.ok) {
        setTitle(json.title);
        setDescription(json.description);
        setTags(json.tags);
        setCodeTemplate(json.codeTemplates);
        setComments(json.comments);
        // setAuthorUsername(json.author);
      }  else {
          alert(json.error);
      }
    }
    fetchData();
  }, [repliesVisible]);

  let intId = 0;
  if (Array.isArray(id)) {
    intId = parseInt(id[0], 10);
  } else if (typeof id === 'string') {
    intId = parseInt(id, 10);
  }

  // async function getAllComments() {
  //   const comments = await fetch(`/api/comments/sortComments?sortType=${sortType}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     }
  //   });

  //   return comments;
  // }

  // useEffect(() => {
  //   async function fetchComments() {
  //     const comments = await getAllComments();
  //     const commentsJson = await comments.json();
      
  //     setComments(commentsJson.sortedComments);
  //   }
  //   fetchComments();
  // }, [comments]);

  async function handleAddComment() {
      console.log("New Comment:", newComment);
      const bodyData = {
        content: newComment, 
        blogId: intId, 
        parentCommentId: null
      };

      const response = await fetch(`/api/comments/createComment`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.jwtToken}`
        },
        body: JSON.stringify(bodyData)
      });

      const json = await response.json();

      if (response.ok) {
        setComments([...comments, json]);
        setNewComment("");
        setShowCommentBox(false); // Hide the input box after submission
      } else {
        alert(json.error);
      }
  };

  async function handleReport(blogId, commentId) {
    try {
      let jsonBody = {};
      if (blogId) {
        jsonBody = {
          content: reportReason,
          blogId: blogId,
          commentId: commentId
        }
      } else {
        jsonBody = {
          content: commentReportReason,
          blogId: blogId,
          commentId: commentId
        }
      }
      const response = await fetch(`/api/report/createReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.jwtToken}`
        },
        body: JSON.stringify(jsonBody)
      });

      if (response.ok) {
        alert("Your report has been submitted successfully.");
        setShowReportBox(false); // Hide the report box
        setReportReason(""); // Clear the text box
        setShowCommentBox(false);
        setCommentReportReason("");
      } else {
        const errorData = await response.json();
        alert(`Failed to submit report: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Something went wrong. Please try again later.");
    }
  }

  const handleReportClick = () => {
    setShowReportBox(true); // Show the report text box
  };

  function handleCloseReportBox() {
    setReportReason("");
    setShowReportBox(false);
  }

  function handleCommentReportClick() {
    setShowCommentReportBox(true);
  }

  function handleCloseCommentReportBox() {
    setCommentReportReason("");
    setShowCommentReportBox(false);
  }

    async function handleUpvote() {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.jwtToken}`
        },
        body: JSON.stringify({ action: "upvote" }) 
      });
      const jsonResponse = await response.json();

      if (response.ok) {
        console.log("Successfully upvoted");
        setRating(jsonResponse.rating);
      } else {
        alert(jsonResponse.error);
      }
    }

    async function handleDownvote() {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.jwtToken}`
        },
        body: JSON.stringify({ action: "downvote" }) 
      });
      const jsonResponse = await response.json();

      if (response.ok) {
        console.log("Successfully downvoted");
        setRating(jsonResponse.rating);
      } else {
        alert(jsonResponse.error);
      }
    }

    async function handleCommentLike(id) {
      const response = await fetch(`/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.jwtToken}`
        },
        body: JSON.stringify({ action: "upvote", commentId: id})
      })
      const jsonResponse = await response.json();

      if (response.ok) {
        console.log("Successfully upvoted");
        console.log(jsonResponse);
        // setComments((prevComments) =>
        //   prevComments.map((comment) =>
        //     comment.id === id ? jsonResponse : comment
        //   )
        // );
        
      } else {
        alert(jsonResponse.error);
      }
    }

    async function handleCommentDislike(id) {
      const response = await fetch(`/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.jwtToken}`
        },
        body: JSON.stringify({ action: "downvote", commentId: id})
      })
      const jsonResponse = await response.json();

      if (response.ok) {
        console.log("Successfully downvoted");
        // setComments((prevComments) =>
        //   prevComments.map((comment) =>
        //     comment.id === id ? jsonResponse : comment
        //   )
        // );
      } else {
        alert(jsonResponse.error);
      }
    }

    const sortToDisplayName = {
        "asc": "Ascending Ratings",
        "desc": "Descending Ratings",
    }

    function toggleSortDropdown() {
        setSortDropdown(!sortDropdownOpen);
    }

    function SortDropdown() {
        return sortDropdownOpen && (
            <ul id="code-search-type-dropdown">
                <button onClick={() => {setSortType("asc"); toggleSortDropdown();}}><li>Ascending Ratings</li></button>
                <button onClick={() => {setSortType("desc"); toggleSortDropdown();}}><li>Descending Ratings</li></button>
            </ul>
        )
    }

    async function handleReplySubmit(parentId: number) {
      try {
        const response = await fetch("/api/comments/createComment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.jwtToken}`
          },
          body: JSON.stringify({
            content: replyText,
            blogId: intId,
            parentCommentId: parentId,
          }),
        });
  
        if (response.ok) {
          const newComment = await response.json();
          // setComments((prev) => [...prev, newComment]); // Add new comment to the list
          setReplyText(""); // Clear the text box
          setReplyBoxVisible(null); // Hide the reply box
        } else {
          console.error("Failed to create reply:", await response.text());
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    }

    const toggleRepliesDropdown = (commentId) => {
      setRepliesVisible((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
    };

    return (
      <>
        <Head>
          <title>Scriptorium Blog</title>
        </Head>
        <div className="max-w-2xl  mx-auto px-4 py-8">
          {/* Blog Title */}
          <h1 className="text-3xl font-bold text-center pb-2">{title}</h1>

          {/* Tags */}
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="border border-gray-300 px-3 py-1 mb-2 rounded-lg inline-block bg-gray-100 text-gray-800"
            >
              {tag.name}
            </div>
          ))}

          {/* Description */}
          <p className="mt-4 text-lg s">{description}</p>

          { codeTemplate && <div className="mt-4">
            <Link href={`/code-templates/${codeTemplate.id}`}>
              <p className="text-blue-500 hover:text-blue-700 text-lg font-medium">
                Link to Code Template
              </p>
            </Link>
          </div>}

          {/* Like/Dislike buttons */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              onClick={handleUpvote}
            >
              👍
            </button>
            
            <div className="text-center">
              <span>{rating}</span>
            </div>

            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              onClick={handleDownvote}
            >
              👎
            </button>

            {/* Report button */}
            <button 
            className="ml-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
            onClick={handleReportClick}>
              Report
            </button>

            {/* Report Text Box */}
            {showReportBox && (
              <div className="mt-4">
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Explain why you are reporting this..."
                  className="w-full p-2 border border-blue-300 rounded-lg bg-gray-800"
                ></textarea>
                <div className="flex mt-2">
                  <button
                    onClick={() => handleReport(intId, null)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
                  >
                    Submit Report
                  </button>
                  <button
                    onClick={handleCloseReportBox}
                    className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Edit Button (only for the author) */}
          {blog && blog.authorId === user.id && (
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                onClick={() => console.log(`Edit blog with ID: ${blog.id}`)}
              >
                Edit
              </button>
            )}

          {/* New Comment Input */}
          <div className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-4 border rounded-lg shadow-sm bg-gray-800 text-blue-100"
                rows={4}
                placeholder="Add a comment..."
              />
              <button
                onClick={handleAddComment}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              >
                Add Comment
              </button>
            </div>
            <div className="pt-[3vw]">
              <button id="code-search-type-dropdown-button" onClick={() => toggleSortDropdown()}>
                  {sortToDisplayName[sortType]}
              </button>
              <SortDropdown />
          </div>

          {/* Comment Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg shadow-sm bg-gray-800">
                  <p>{comment.content}</p>
                  <div className="mt-6 flex items-center space-x-4">

                    <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => handleCommentLike(comment.id)}
                    >
                    👍
                    </button>
                    <div className="text-center">
                    <span>{comment.rating}</span>
                    </div>
                    <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                    onClick={() => handleCommentDislike(comment.id)}
                    >
                    👎
                    </button>

                    {/* Report button */}
                    <button 
                      className="ml-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                      onClick={handleCommentReportClick} // Pass the comment ID to handle this specific comment's report
                    >
                      Report
                    </button>

                    {/* Report Text Box for this specific comment */}
                    {showCommentReportBox && (
                      <div className="mt-2 ml-4 w-80">
                        <textarea
                          value={commentReportReason}
                          onChange={(e) => setCommentReportReason(e.target.value)}
                          placeholder="Explain why you are reporting this..."
                          className="w-full p-2 border border-blue-300 rounded-lg bg-gray-800 text-white"
                        ></textarea>
                        <div className="flex mt-2">
                          <button
                            onClick={() => handleReport(null, comment.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
                          >
                            Submit Report
                          </button>
                          <button
                            onClick={handleCloseCommentReportBox}
                            className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reply Button */}
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                      onClick={() =>
                        setReplyBoxVisible((prev) => (prev === comment.id ? null : comment.id))
                      }
                    >
                      Reply
                    </button>

                    {/* Reply Text Box */}
                    {replyBoxVisible === comment.id && (
                      <div className="mt-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply here..."
                          className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                        ></textarea>
                        <button
                          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                          onClick={() => handleReplySubmit(comment.id)}
                        >
                          Submit Reply
                        </button>
                      </div>
                    )}

                    <div className="mt-2 flex space-x-4">
                    <details>
                          <summary onClick={toggleRepliesDropdown}>View Replies</summary>
                          <div>
                            {comment.replies.map((reply) => (
                              <p key={reply.id}>{reply.content}</p>
                            ))}
                          </div>
                        </details>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
}
