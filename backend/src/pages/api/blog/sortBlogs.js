import { getSortedBlogs } from '@/service/blogsDb';
import { paginate } from "@/service/paginate";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { order } = req.body;

        // localhost here to match URL validation regex. DO NOT RM
        const epp = new URL("https://localhost:3000" + req.url).searchParams.get("epp");
        const pno = new URL("https://localhost:3000" + req.url).searchParams.get("pno");

        let allPosts = await getSortedBlogs(order);

        allPosts = paginate(epp, pno, allPosts);  // if entries per page or page number are null, their defaults are 20 and 1, respectively
        if (!allPosts)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
        return res.status(200).json({ allPosts: allPosts[0], pageNum: allPosts[1], numEntries: allPosts[2] });
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}