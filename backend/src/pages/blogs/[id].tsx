import React, { useState, useEffect, useContext } from 'react';
import { Blog, Comment, Report, User, CodeTemplate, Tag } from "@prisma/client";
import { useRouter } from 'next/router';
import Link from 'next/link'
import Head from 'next/head';

export default function BlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);

  // async function getBlog() {
  //   const blog = await fetch(`/api/blog/${id}`, {
  //       method: "GET",
  //       headers: {
  //           "Content-Type": "application/json"
  //       }
  //   });

  //   const jsonBlog = await blog.json();
  //   return jsonBlog;
  // }

  // useEffect(() => {
  //     async function fetchBlog() {
  //         const blogData = await getBlog();
  //         setBlog(blogData);
  //         setRating(blogData.rating)
  //     }
  //     fetchBlog();

  //     const userJson = window.localStorage.getItem('user');
  //     const user = JSON.parse(userJson);
  //     if (user) {
  //       setUser(user);
  //     }
  // }, [id]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [authorUsername, setAuthorUsername] = useState<string>("");
  const [codeTemplate, setCodeTemplate] = useState<CodeTemplate[]>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState<number>(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState<string>("");
  const [showReportBox, setShowReportBox] = useState(false); // Manage visibility of report box
  const [reportReason, setReportReason] = useState(""); // Store the report reason
  const [showCommentReportBox, setShowCommentReportBox] = useState(false);
  const [commentReportReason, setCommentReportReason] = useState("");
  const [sortType, setSortType] = useState("desc");
  const [sortDropdownOpen, setSortDropdown] = useState(false);
  const [replyBoxVisible, setReplyBoxVisible] = useState<number | null>(null); // Tracks which comment's reply box is visible
  const [replyText, setReplyText] = useState("");
  const [repliesVisible, setRepliesVisible] = useState({}); // Tracks which comments have their replies dropdown open
  const [replyingTo, setReplyingTo] = useState(-1);
  const [commentLikeUpdated, setCommentLikeUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // Track the current page
  const [commentsPerPage, setCommentsPerPage] = useState(5);  // Number of comments per page

  useEffect(() => {
    const userJson = window.localStorage.getItem('user');
    const user = JSON.parse(userJson);
    if (user) {
      setUser(user);
    }
    const fetchData = async () => {
      const response = await fetch(`/api/blog/${id}`, {
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
        console.log("djsfkljdaslfkdjsalkfjasklfj")
        console.log(json.comments)
        setComments(json.comments.filter(comment => comment.parentId === null));
        console.log(json)
        // setBlog(blog);
        // setAuthorUsername(json.author);
      }  else {
          alert(json.error);
      }
    }
    fetchData();
  }, [repliesVisible, id]);

  let intId = 0;
  if (Array.isArray(id)) {
    intId = parseInt(id[0], 10);
  } else if (typeof id === 'string') {
    intId = parseInt(id, 10);
  }
  
  async function handleAddComment() {
      const bodyData = {
        content: newComment, 
        blogId: intId, 
        parentCommentId: null
      };

      if (replyingTo !== -1) {
        bodyData.parentCommentId = replyingTo;
      }

      const response = await fetch(`/api/comments/createComment`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.jwtToken}`
        },
        body: JSON.stringify(bodyData)
      });

      setReplyingTo(-1);

      const json = await response.json();

      if (response.ok) {
        
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
            setComments(json.comments.filter(comment => comment.parentId === null));
            console.log(json.comments)
          }  else {
              alert(json.error);
          }
        }
        fetchData();


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
        // setComments((prevComments) =>
        //   prevComments.map((comment) =>
        //     comment.id === id ? jsonResponse : comment
        //   )
        // );
        setCommentLikeUpdated(prevState => !prevState);
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
        setCommentLikeUpdated(prevState => !prevState);
      } else {
        alert(jsonResponse.error);
      }
    }

    function Comment(comment){
      console.log("==============")
      console.log(comment)
      return (
      <>
        <div key={comment.id} className="bg-[#302a3d] p-5 rounded w-full">
          <p>Comment Id: {comment.id}</p>
          {comment.parentId !== null && <p>Replying to Comment {comment.parentId}</p>}
          <p className="break-words">{comment.content}</p>
          <div className="mt-6 flex items-center space-x-4 justify-end">

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
              className="ml-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"                      >
              Report
            </button>

            <button 
              className="ml-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
              onClick={() => {setReplyingTo(comment.id);}}                   >
              Reply
            </button>

            
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && comment.replies.map((comment) => (Comment(comment)))}
      </>
        
      );
    }

    const sortToDisplayName = {
        "asc": "Ascending Ratings",
        "desc": "Descending Ratings",
    }

    useEffect(() => {
      async function fetchComments() {
        const response = await fetch(`/api/comments/sortComments?blogId=${intId}&sortType=${sortType}&epp=${commentsPerPage}&pno=${currentPage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.ok) {
          const commentsJson = await response.json();
          setComments(commentsJson.sortedComments); // Assuming the API returns sorted comments in `sortedComments`.
        } else {
          console.error("Failed to fetch comments");
        }
      }
    
      fetchComments();
    }, [intId, sortType, commentLikeUpdated, currentPage]); // Dependency array includes `sortType` and `commentLikeUpdated`.
    
    function toggleSortDropdown() {
      setSortDropdown((prev) => !prev);
    }
    
    const handlePageChange = (page: number) => {
      if (page >= 1) {
        setCurrentPage(page);
      }
    };  

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
        <div className="p-12 px-48">
          <div id="code-template-entry">
            {/* Blog Title */}
            <h1 className="text-3xl font-bold text-center pb-2">{title}</h1>
            {/* Tags */}
            <div className="tag-container">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-[#271840] py-1 px-3 m-1 rounded"
                >
                  {tag.name}
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="mt-4 text-lg s break-words">{description}</p>

            {codeTemplate && codeTemplate.map((template) => (
              <div className="mt-4" key={template.id}>
                <Link href={`/code-templates/${template.id}`}>
                  <p className="text-blue-500 hover:text-blue-700 text-lg font-medium">
                    Link to Code Template: {template.title}
                  </p>
                </Link>
              </div>
            ))}

            {/* Like/Dislike buttons */}
            <div className="mt-6 flex items-center space-x-4 justify-end">
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
              className="ml-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700">
                Report
              </button>
              {/* Edit Button (only for the author) */}
              {blog && user && blog.authorId === user.id && (
                  <Link href={`/blogs/edit/${id}`}><button className="blue-button">Edit</button></Link>
                )}

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
                      className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
          <br/>
          <h2 className="text-xl font-semibold mb-2 ">Comments</h2>
          {/* New Comment Input */}
          <div className="mt-6">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-[#302a3d] h-20 p-5 rounded w-full"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={handleAddComment}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Comment
                </button>
              </div>
              <div className="pt-6">
              <button
                id="code-search-type-toggle-button"
                onClick={() => setSortType((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
              >
                {sortToDisplayName[sortType]}
              </button>
            </div>

            {/* Comment Section */}
            <div className="mt-8">
              <div className="space-y-4">
                {comments.map((comment) => (Comment(comment)))}
              </div>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="px-4 py-2">{`Page ${currentPage}`}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg ml-2 hover:bg-gray-700"
              >
                Next
              </button>
            </div>
        </div>
      </>
    )
}
