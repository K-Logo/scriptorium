import Blog from '@/model/blog';
import { addBlogPost } from '@/service/blogsDb';
import { getUserById } from '@/service/usersDb';
import { getJWT, verifyAndDecodeBlogJWT } from '@/service/jwt';

// Accepts bodies with *mandatory* title and description. tag and code template is optional
export default async function handler(req, res) {
    if (req.method === "POST") {
      // tags is array of strings, codeTemplateIds is array of ints
        const { title, description, tags, codeTemplateIds, authorId } = req.body;

        if (!title || !description) {
            res.status(409).json({ error: "Title and description are mandatory fields." });
        } 
        const decodedJWT = verifyAndDecodeBlogJWT(req);
        if (!decodedJWT) {
          return res.status(401).json({ error: "Unauthorized" }); // TODO: blog creation is unauthorized
        }
    
         try {
          const savedBlog = await addBlogPost(title, description, tags, codeTemplateIds, authorId);
          return res.status(201).json(savedBlog);
        } catch (e) {
          return res.status(409).json({ error: "An error occurred saving your blog post. Please check your inputs." });
        }
      } else {
        return res.status(405).json({ error: "Method not allowed." })
      }
}