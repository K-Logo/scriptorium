import * as commentsDb from '@/service/commentsDb';

export default async function handler(req, res) {
    if (req.method === "GET") {
        const sortedComments = commentsDb.getSortedComments();
        return res.status(200).json(sortedComments);
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}