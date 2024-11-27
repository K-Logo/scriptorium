import { addReport, updateBlogReportCounter, updateCommentReportCounter } from '@/service/reportsDb'
import { verifyAndDecodeBlogJWT } from '@/service/jwt';

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

        if (blogId) { // a blog is being reported
            await updateBlogReportCounter(blogId);
        } else if (commentId) {
            await updateCommentReportCounter(commentId);
        } else {
            return res.status(400).json({ error: "Incorrect ipnut. A blogId or commentId is required" });
        }

        const newReport = await addReport(content, blogId, commentId)

        res.status(201).json(newReport);
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}