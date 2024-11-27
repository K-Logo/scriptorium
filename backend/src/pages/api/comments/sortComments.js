import * as commentsDb from '@/service/commentsDb';
import { paginate } from "@/service/paginate";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { sortType } = req.query;
        const epp = new URL("https://localhost:3000" + req.url).searchParams.get("epp");
        const pno = new URL("https://localhost:3000" + req.url).searchParams.get("pno");

        let sortedComments = paginate(epp, pno, await commentsDb.getSortedComments(sortType));  // if entries per page or page number are null, their defaults are 20 and 1, respectively
        if (!sortedComments)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
        return res.status(200).json({ sortedComments: sortedComments[0], pageNum: sortedComments[1], numEntries: sortedComments[2] });
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}