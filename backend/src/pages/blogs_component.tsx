// import React, { useState } from "react";
//
// interface Report {
//   id: number;
//   content: string;
//   blog?: Blog;
//   comment?: Comment;
// }
//
//
//
// const Blog = ({ initTitle, initDescription, initCodeTemplates, initTags}) => {
//   const [title, setTitle] = useState(initTitle);
//   const [description, setDescription] = useState(initDescription);
//   const [codeTemplates, setCodeTempaltes] = useState<CodeTemplate>(initCodeTemplates);
//   const [tags, setTags] = useState<Tag>(initTags);
//
//   const [rating, setRating] = useState(0);
//   const [comments, setComments] = useState<Comment>([]);
//   const [reportData, setReportData] = useState{ reports: Report[]; count: number }({
//     reports: [],
//     count: 0
//   });
//
//   // handle title edit
//
//   // handle desc edit
//
//   // handle codeTemplate edit
//
//   // handle tags edit
//
//   // handle rating upvote
//   const handleUpvote = (good) => setRating((prev) => (good ? prev + 1: prev - 1);
//
//   // handle comment posting
//
//   // handle report creation voting
//
//   return (
//     <div>
//
//     </div>
//   )
// }
//
// export default Blog;

import React, { useState } from 'react';
import { Pencil, Flag, ThumbsUp, MessageCircle } from 'lucide-react';
import { Blog, Comment, Report, User, CodeTemplate, Tag } from "@prisma/client";

// Type definitions
interface CodeTemplateProps extends CodeTemplate {
  id: number;
  language: string;
  code: string;
  description?: string;
}

interface CommentProps extends Comment {
  id: number;
  author: string;
  text: string;
  timestamp: Date;
}

interface ReportProps extends Report{
  id: number;
  content: string;
  blog?: Blog;
  blogId?: number;
  comment?: Comment;
  commentId?: number;
}

interface BlogPostProps extends Blog{
  initialTitle: string;
  initialDescription: string;
  initialCodeTemplates: CodeTemplate[];
  initialTags: Tag[];
  initialUpvotes: number;
  initialComments: Comment[];
}

interface TagProps extends Tag {
    id: number;
    name: string;
    codeTemplates: CodeTemplate[];
    blogs: Blog[];
}

const BlogPost: React.FC<BlogPostProps> = ({
  initialTitle,
  initialDescription,
  initialCodeTemplates,
  initialTags,
  initialUpvotes,
  initialComments
}) => {
  // State management
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [codeTemplates, setCodeTemplates] = useState<CodeTemplate[]>(initialCodeTemplates);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState({
    title: false,
    description: false,
    tags: false,
    codeTemplates: false
  });

  // Edit functions
  const toggleEditMode = (field: keyof typeof editMode) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleTitleEdit = (newTitle: string) => {
    setTitle(newTitle);
    toggleEditMode('title');
  };

  const handleDescriptionEdit = (newDescription: string) => {
    setDescription(newDescription);
    toggleEditMode('description');
  };

  const handleTagsEdit = (newTags: Tag[]) => {
    setTags(newTags);
    toggleEditMode('tags');
  };

  const handleCodeTemplateEdit = (updatedTemplate: CodeTemplate) => {
    setCodeTemplates(prev =>
      prev.map(template =>
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    );
    toggleEditMode('codeTemplates');
  };

  // Comment handling
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const commentToAdd: Comment = {
        id: `comment_${Date.now()}`,
        author: 'Current User', // In a real app, this would come from authentication
        text: newComment,
        timestamp: new Date()
      };
      setComments(prev => [...prev, commentToAdd]);
      setNewComment('');
    }
  };

  // TODO: Report handling. Where should the report be created? Should I call the function right here, or on the page?
  const handleReport = (report: Report) => {
    // const reportToSubmit: Report = {
    //   id: `report_${Date.now()}`,
    //   content: 'Inappropriate Content', // This would typically be selected by the user
    //   blog:
    //   blogId: 
    // };

    // In a real application, this would be sent to a backend
    console.log('Report submitted:', reportToSubmit);
  };

  // Upvote handling
  const handleUpvote = (isUpvote: boolean) => {
    setUpvotes((prev) => (isUpvote ? prev + 1 : prev - 1));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Title Section */}
      <div className="flex items-center mb-4">
        {editMode.title ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold w-full mr-2 p-1 border rounded"
          />
        ) : (
          <h1 className="text-2xl font-bold flex-grow">{title}</h1>
        )}
        <button
          onClick={() => toggleEditMode('title')}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <Pencil size={20} />
        </button>
      </div>

      {/* Description Section */}
      <div className="flex items-center mb-4">
        {editMode.description ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mr-2 p-1 border rounded"
            rows={3}
          />
        ) : (
          <p className="flex-grow">{description}</p>
        )}
        <button
          onClick={() => toggleEditMode('description')}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <Pencil size={20} />
        </button>
      </div>

      {/* Code Templates */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Code Templates</h2>
        {codeTemplates.map((template, index) => (
          <div key={template.id} className="mb-3">
            <div className="flex items-center">
              <pre className="bg-gray-100 p-3 rounded-lg w-full overflow-x-auto">
                <code>{template.code}</code>
              </pre>
              <button
                onClick={() => toggleEditMode('codeTemplates')}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <Pencil size={20} />
              </button>
            </div>
            {template.description && (
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => toggleEditMode('tags')}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <Pencil size={20} />
        </button>
      </div>

      {/* Interaction Section */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleUpvote}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
        >
          <ThumbsUp size={20} />
          <span>{upvotes}</span>
        </button>
        <button
          onClick={handleReport}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
        >
          <Flag size={20} />
          <span>Report</span>
        </button>
      </div>

      {/* Comments Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <MessageCircle className="mr-2" /> Comments ({comments.length})
        </h2>

        {/* Comment Input */}
        <div className="mb-4 flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow mr-2 p-2 border rounded"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>

        {/* Comments List */}
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-100 p-3 rounded-lg mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-xs text-gray-500">
                {comment.timestamp.toLocaleString()}
              </span>
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;
