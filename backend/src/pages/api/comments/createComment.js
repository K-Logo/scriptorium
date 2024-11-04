import { addComment } from '@/service/commentsDb';
import { getJWT, verifyAndDecodeBlogJWT } from '@/service/jwt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { content, blogId, parentCommentId } = req.body;

    if (!content) {
      res.status(409).json({ error: "Content is a mandatory field." });
    } 

    const decodedJWT = verifyAndDecodeBlogJWT(req);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const newComment = await addComment(content, decodedJWT.id, blogId, parentCommentId);

    res.status(201).json(newComment);

  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
