import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Post {
  id: number;
  title: string;
  description: string;
  authorId: number;
  rating: number;
  numReports: number;
  hidden: boolean;
  reports: any[];
  author: {
    id: number;
    username: string;
    avatarPath: string;
    role: string;
  };
}

interface Comment {
  id: number;
  content: string;
  authorId: number;
  blogPostId: number;
  parentId: number | null;
  rating: number;
  numReports: number;
  hidden: boolean;
  reports: any[];
  author: {
    id: number;
    username: string;
    avatarPath: string;
    role: string;
  };
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postPageNum, setPostPageNum] = useState<number>(1);
  const [commentPageNum, setCommentPageNum] = useState<number>(1);
  const [postsPerPage, setPostsPerPage] = useState<number>(20);
  const [commentsPerPage, setCommentsPerPage] = useState<number>(20);
  const [expandedPost, setExpandedPost] = useState<Set<number>>(new Set());
  const [expandedComment, setExpandedComment] = useState<Set<number>>(new Set());
  const [expandedReportsPost, setExpandedReportsPost] = useState<Set<number>>(new Set());
  const [expandedReportsComment, setExpandedReportsComment] = useState<Set<number>>(new Set());
  
  // State for modal
  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const truncateText = (text: string, charLimit: number) => {
    const chars = text.split('');
    if (chars.length <= charLimit) return text;
    return chars.slice(0, charLimit).join('') + '...';
  };

  useEffect(() => {
    const userJson = window.localStorage.getItem('user');
    const user = JSON.parse(userJson);
    if (!user || !user.jwtToken) {
      router.push("/login");
    } else if (user.role !== "ADMIN") {
      router.push("/run");
    } else {
      setUser(user);
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/admin?epp1=${postsPerPage}&pno1=${postPageNum}&epp2=${commentsPerPage}&pno2=${commentPageNum}`, {
            headers: {
              "Authorization": `Bearer ${user.jwtToken}`,
            },
          });
        if (response.ok) {
          const data = await response.json();
          setPosts(data.allPosts);
          setComments(data.allComments);    
        } else {
          console.log("Unexpected error");
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [postsPerPage, postPageNum, commentsPerPage, commentPageNum]);

  // prevent rendering if user not authenticated
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const togglePostDescription = (id: number) => {
    setExpandedPost(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const toggleCommentContent = (id: number) => {
    setExpandedComment(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const toggleVisibility = async (id: number, type: 'post' | 'comment') => {
    try {
      // Update the state first
      if (type === 'post') {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === id
              ? { ...post, hidden: !post.hidden }
              : post
          )
        );
      } else {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === id
              ? { ...comment, hidden: !comment.hidden }
              : comment
          )
        );
      }
  
      const body = {
        contentType: type,
        contentId: id,
        hidden: type === 'post' ? !posts.find(post => post.id === id)?.hidden : !comments.find(comment => comment.id === id)?.hidden
      };
  
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.jwtToken}`,
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update visibility');
      }
  
      console.log('Visibility updated successfully');
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };  

  const toggleReports = (id: number, type: 'post' | 'comment') => {
    if (type === 'post') {
      setExpandedReportsPost(prev => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(id)) {
          newExpanded.delete(id);
        } else {
          newExpanded.add(id);
        }
        return newExpanded;
      });
    } else {
      setExpandedReportsComment(prev => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(id)) {
          newExpanded.delete(id);
        } else {
          newExpanded.add(id);
        }
        return newExpanded;
      });
    }
  };

  const openModal = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    setModalPost(post || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#1e1b24] p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      {/* Dropdown for Posts per Page */}
      <div className="mb-6">
        <label htmlFor="postsPerPage" className="block text-lg font-semibold mb-2">Blogs per Page:</label>
        <select
          id="postsPerPage"
          value={postsPerPage}
          onChange={(e) => setPostsPerPage(Number(e.target.value))}
          className="w-24 px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#2d2b34] text-white"
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Blogs Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Blogs</h2>
        <div className="overflow-x-auto bg-[#2d2b34] shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#14111a] text-gray-400">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-center">Reports</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b hover:bg-[#333040]">
                  <td className="px-4 py-2">{post.title}</td>
                  <td className="px-4 py-2">
                    <div className="relative max-w-[65vw] overflow-hidden">
                      <p className={`overflow-auto ${expandedPost.has(post.id) ? 'whitespace-normal' : 'text-ellipsis'}`}>
                        {expandedPost.has(post.id) ? post.description : truncateText(post.description, 50)}
                      </p>
                      <button
                        className="absolute bottom-0 right-0 text-blue-500"
                        onClick={() => togglePostDescription(post.id)}
                      >
                        {expandedPost.has(post.id) ? "Show less" : "Show more"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <img
                      src={`http://${post.author.avatarPath}`}
                      alt={post.author.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{post.author.username}</span>
                  </td>
                  <td className="px-4 py-2 text-center">{post.numReports}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggleVisibility(post.id, 'post')}
                      className={`text-white py-1 px-3 rounded ${
                        post.hidden ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
                      }`}
                    >
                      {post.hidden ? 'Unhide' : 'Hide'}
                    </button>
                    <button
                      onClick={() => toggleReports(post.id, 'post')}
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                    >
                      {expandedReportsPost.has(post.id) ? 'Hide Reports' : 'View Reports'}
                    </button>
                    {expandedReportsPost.has(post.id) && (
                      <div className="mt-2 bg-[#333040] p-4 rounded">
                        <h3 className="text-lg font-semibold">Reports</h3>
                        <ul>
                          {post.reports.map((report: any) => (
                            <li key={report.id} className="text-sm">
                              <strong>{report.content}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4">
            <button className="px-4 py-2 bg-[#ffffff] text-black rounded-md hover:bg-[#eeeeee]" onClick={() => setPostPageNum(prev => Math.max(prev - 1, 1))}>Previous</button>
            <span className="text-white">Page {postPageNum}</span>
            <button className="px-4 py-2 bg-[#ffffff] text-black rounded-md hover:bg-[#eeeeee]" onClick={() => setPostPageNum(prev => prev + 1)}>Next</button>
          </div>
        </div>
      </div>
      <br />
      <br />
      
      {/* Dropdown for Comments per Page */}
      <div className="mb-6">
        <label htmlFor="commentsPerPage" className="block text-lg font-semibold mb-2">Comments per Page:</label>
        <select
          id="commentsPerPage"
          value={commentsPerPage}
          onChange={(e) => setCommentsPerPage(Number(e.target.value))}
          className="w-24 px-3 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#2d2b34] text-white"
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Comments Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <div className="overflow-x-auto bg-[#2d2b34] shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#14111a] text-gray-400">
                <th className="px-4 py-2 text-left">Content</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-center">Reports</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <tr key={comment.id} className="border-b hover:bg-[#333040]">
                  <td className="px-4 py-2">
                    <div className="relative max-w-[65vw] overflow-hidden">
                      <p className={`overflow-auto ${expandedComment.has(comment.id) ? 'whitespace-normal' : 'text-ellipsis'}`}>
                        {expandedComment.has(comment.id) ? comment.content : truncateText(comment.content, 50)}
                      </p>
                      <button
                        className="absolute bottom-0 right-0 text-blue-500"
                        onClick={() => toggleCommentContent(comment.id)}
                      >
                        {expandedComment.has(comment.id) ? "Show less" : "Show more"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <img
                      src={`http://${comment.author.avatarPath}`}
                      alt={comment.author.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{comment.author.username}</span>
                  </td>
                  <td className="px-4 py-2 text-center">{comment.numReports}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggleVisibility(comment.id, 'comment')}
                      className={`bg-${comment.hidden ? 'green' : 'yellow'}-500 hover:bg-${comment.hidden ? 'green' : 'yellow'}-600 text-white py-1 px-3 rounded`}
                    >
                      {comment.hidden ? 'Unhide' : 'Hide'}
                    </button>
                    <button
                      onClick={() => toggleReports(comment.id, 'comment')}
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                    >
                      {expandedReportsComment.has(comment.id) ? 'Hide Reports' : 'View Reports'}
                    </button>
                    <button
                      onClick={() => openModal(comment.blogPostId)}
                      className="ml-2 bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded"
                    >
                      View Post
                    </button>
                    {expandedReportsComment.has(comment.id) && (
                      <div className="mt-2 bg-[#333040] p-4 rounded">
                        <h3 className="text-lg font-semibold">Reports</h3>
                        <ul>
                          {comment.reports.map((report: any) => (
                            <li key={report.id} className="text-sm">
                              <strong>{report.content}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4">
            <button className="px-4 py-2 bg-[#ffffff] text-black rounded-md hover:bg-[#eeeeee]" onClick={() => setCommentPageNum(prev => Math.max(prev - 1, 1))}>Previous</button>
            <span className="text-white">Page {commentPageNum}</span>
            <button className="px-4 py-2 bg-[#ffffff] text-black rounded-md hover:bg-[#eeeeee]" onClick={() => setCommentPageNum(prev => prev + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Blog Post */}
      {isModalOpen && modalPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#2d2b34] p-8 rounded-lg w-3/4 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">{modalPost.title}</h2>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={`http://${modalPost.author.avatarPath}`}
                alt={modalPost.author.username}
                className="w-8 h-8 rounded-full"
              />
              <span>{modalPost.author.username}</span>
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <p className="whitespace-pre-wrap break-words text-base">{modalPost.description}</p>
            </div>

            <h3 className="mt-4 text-lg font-semibold">Reports</h3>
            <ul className="space-y-2">
              {modalPost.reports.map((report, index) => (
                <li key={index} className="text-sm">
                  <strong>{report.content}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
