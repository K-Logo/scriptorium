import { addReport, updateBlogReportCounter, updateCommentReportCounter } from '@/service/reportsDb'
import { verifyAndDecodeBlogJWT } from '@/service/jwt';
import { parse } from 'path';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { content, blogId, commentId } = req.body;

        if (!content) {
            return res.status(409).json({ error: "Content is a mandatory field." });
        }

        const decodedJWT = verifyAndDecodeBlogJWT(req);
        if (!decodedJWT) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        let intBlog = 0;
        let intComment = 0;

        if (blogId) { // a blog is being reported
            intBlog = parseInt(blogId);
            await updateBlogReportCounter(intBlog);
        } else if (commentId) {
            intComment = parseInt(commentId)
            await updateCommentReportCounter(intComment);
        } else {
            return res.status(400).json({ error: "Incorrect ipnut. A blogId or commentId is required" });
        }

        const newReport = await addReport(content, intBlog, intComment)

        return res.status(201).json(newReport);
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}