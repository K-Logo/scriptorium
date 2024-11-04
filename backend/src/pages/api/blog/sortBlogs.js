import { getSortedBlogs } from '@/service/blogsDb';

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { order } = req.body;

        const allPosts = await getSortedBlogs(order);

        return res.status(200).json(allPosts);
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}