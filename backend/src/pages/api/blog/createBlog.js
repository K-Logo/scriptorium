import Blog from '@/model/blog';
import { addBlogPost } from '@/service/blogsDb';
import { getUserById } from '@/service/usersDb';
import { getJWT, verifyAndDecodeBlogJWT } from '@/service/jwt';

// Accepts bodies with *mandatory* title and description. tag and code template is optional
export default async function handler(req, res) {
    if (req.method === "POST") {
        const { title, description, tag, code_template, authorId } = req.body;

        if (!title || !description) {
            res.status(409).json({ error: "Title and description are mandatory fields." });
        } 
        const decodedJWT = verifyAndDecodeBlogJWT(req);
        if (!decodedJWT) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const blog = new Blog(null, title, description, tag, code_template, authorId);
    
        try {
          const savedBlog = await addBlogPost(blog);
          return res.status(201).json(savedBlog);
        } catch (e) {
          return res.status(409).json({ error: "An error occurred saving your blog post. Please check your inputs." });
        }
      } else {
        return res.status(405).json({ error: "Method not allowed." })
      }
}