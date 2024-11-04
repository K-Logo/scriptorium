import * as blogsDb from '@/service/blogsDb';
import { getJWT, verifyAndDecodeBlogJWT } from '@/service/jwt';

export default async function handler(req, res) {
  if (req.method === "PUT") {
    let { blogId } = req.query; // get blog's id
    blogId = Number.parseInt(blogId);

    const decodedJWT = verifyAndDecodeBlogJWT(req);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const blog = await blogsDb.searchBlogPostById(blogId);

    console.log("jdfkasjfkladsjfkladsjfkladsjfkladsjfkladsjflkadsjf")
    console.log(decodedJWT.id)
    if (decodedJWT.id != blog.authorId) {
      return res.status(401).json({ error: "You are not the author of the account. You cannot edit this post." });
    }

    // the following fields will be null there is no change; otherwise, they will be a string w updated value.
    const { newTitle, newDescription, newTag, newCodeTemplateId } = req.body;
    if (newTitle)   await blogsDb.updateTitleById(blogId, newTitle);
    if (newDescription)    await blogsDb.updateDescriptionById(blogId, newDescription);
    if (newTag)   await blogsDb.updateTagById(blogId, newTag);
    if (newCodeTemplateId)    await blogsDb.updateCodeById(blogId, newCodeTemplateId);

    res.status(200).json({ message: "Blog post edited successfully." });
  } else if (req.method == 'DELETE') {
    let { blogId } = req.query; // get blog's id
    blogId = Number.parseInt(blogId);

    const decodedJWT = verifyAndDecodeBlogJWT(req);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const blog = await blogsDb.searchBlogPostById(blogId);
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
    let { blogId } = req.query; // get blog's id
    blogId = Number.parseInt(blogId);
    const { action } = req.body;

    const blog = blogsDb.searchBlogPostById(blogId);

    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
    }

    if (action == "upvote") {
      await blogsDb.updateRatingById(blogId, action);
      res.status(200).json({ message: "Successfully upvoted the blog" });
    } else if (action == "downvote") {
      await blogsDb.updateRatingById(blogId, action);
      res.status(200).json({ message: "Successfully downvoted the blog" });
    } else if (action == "report") {
      await blogsDb.updateReportCounter(blogId);
      res.status(200).json({ message: "Successfully reported the blog" });
    } else {
      res.status(404).json({ error: "Incorrect action" });
    }
  }
  
  else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}