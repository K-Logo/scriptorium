import * as blogsDb from '@/service/blogsDb';
import { getCodeTemplateById } from '@/service/codeTemplateDb';
import { getJWT, verifyAndDecodeBlogJWT } from '@/service/jwt';
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();


export default async function handler(req, res) {
  let { blogId } = req.query; // get blog's id
  blogId = Number.parseInt(blogId);

  if (req.method === "PUT") {
    const decodedJWT = verifyAndDecodeBlogJWT(req);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(blogId);
    const blog = await blogsDb.searchBlogPostById(blogId, decodedJWT.id);

    if (!blog) {
      return res.status(400).json({ error: "This blog does not exist." });
    }

    if (decodedJWT.id != blog.authorId) {
      return res.status(401).json({ error: "You are not the author of the account. You cannot edit this post." });
    }

    if (blog.hidden) {
      return res.status(401).json({ error: "The post is currently hidden by the administrator. You cannot edit this post." })
    }

    // the following fields will be null there is no change; otherwise, they will be a string w updated value.
    const { newTitle, newDescription, oldTag, newTag, newCodeTemplateId, deleteTag } = req.body;
    if (newTitle)             await blogsDb.updateTitleById(blogId, newTitle);
    if (newDescription)       await blogsDb.updateDescriptionById(blogId, newDescription);
    if (oldTag && newTag) {  // UPDATE a tag
      await blogsDb.deleteTagById(blogId, oldTag);  // oldTag must match exactly
      await blogsDb.addTagById(blogId, newTag);
    }
    if (newTag)             await blogsDb.addTagById(blogId, newTag);
    if (deleteTag)          await blogsDb.deleteTagById(blogId, deleteTag);
    if (newCodeTemplateId)    await blogsDb.updateCodeById(blogId, newCodeTemplateId);

    res.status(200).json({ message: "Blog post edited successfully." });
  } else if (req.method == 'DELETE') {
    const decodedJWT = verifyAndDecodeBlogJWT(req);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    let { blogId } = req.query; // get blog's id
    blogId = Number.parseInt(blogId);
    
    const blog = await blogsDb.searchBlogPostById(blogId, decodedJWT.id);
    if (decodedJWT.id != blog.authorId) {
      return res.status(401).json({ error: "You are not the author of the account. You cannot delete this post." });
    }
    
    try {
      await prisma.blog.delete({
        where: {
          id: blogId
        }
      });

      res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete the blog post" });
    }
  } else if (req.method === 'POST') {
    const decodedJWT = verifyAndDecodeBlogJWT(req);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const blog = await blogsDb.searchBlogPostById(blogId, decodedJWT.id);
    const { action } = req.body;

    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
    }

    if (action == "upvote") {
      await blogsDb.updateRatingById(blogId, action);
      const blog = await blogsDb.searchBlogPostById(blogId, null)
      return res.status(200).json({ rating: blog.rating });
    } else if (action == "downvote") {
      await blogsDb.updateRatingById(blogId, action);
      const blog = await blogsDb.searchBlogPostById(blogId, null)
      return res.status(200).json({ rating: blog.rating });
    } else {
      return res.status(404).json({ error: "Incorrect action" });
    }
  } else if (req.method === "GET") {
    const blog = await blogsDb.searchBlogPostByIdTmp(blogId, null);
    const { codeId } = req.query;

    if (codeId) { // return the code template
      let codeTemplate = getCodeTemplateById(codeId);
      return res.status(200).json([blog, codeTemplate]);
    }
    return res.status(200).json(blog);
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
