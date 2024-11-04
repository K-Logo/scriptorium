
export default async function handler(req, res) {
    if (req.method === "GET") {
        const allPosts = await prisma.blog.findMany({
            orderBy: {
                reports: "desc"
              }
          });
          return res.status(200).json(allPosts);
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}