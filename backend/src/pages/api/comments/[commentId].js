import * as commentsDb from '@/service/commentsDb';
import { getJWT, verifyAndDecodeBlogJWT } from '@/service/jwt';

export default async function(req, res) {
    if (req.method == "POST") {
        let { commentId } = req.query; // get blog's id
        commentId = Number.parseInt(commentId);
        const { action } = req.body;

        const decodedJWT = verifyAndDecodeBlogJWT(req);
        if (!decodedJWT) {
            return res.status(403).json({ error: "Must be a logged in user to comment." });
        }

        const comment = commentsDb.searchCommentById(commentId);

        if (!comment) {
            res.status(404).json({ error: "Comment not found" });
        }

        if (action == "upvote") {
            await commentsDb.updateRatingById(commentId, action);
            res.status(200).json({ message: "Successfully upvoted the comment" });
        } else if (action == "downvote") {
            await commentsDb.updateRatingById(commentId, action);
            res.status(200).json({ message: "Successfully downvoted the comment" });
        } else if (action == "report") {
            await commentsDb.updateReportCounter(commentId);
            res.status(200).json({ message: "Successfully reported the comment" });
        } else {
            res.status(404).json({ error: "Incorrect action" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}