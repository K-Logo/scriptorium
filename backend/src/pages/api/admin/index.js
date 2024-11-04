export default async function handler(req, res) {
    if (req.method === "GET") {
        const allPosts = await prisma.blog.findMany({
            orderBy: {
                reports: "desc"
              }
          });

        const allComments = await prisma.comment.findMany({
        orderBy: {
            reports: "desc"
            }
        });

        return res.status(200).json([allPosts, allComments]);
        
    } else if (req.method === "PUT") {
        const { contentType, contentId, hidden } = req.body;
        if (!contentId) {
            return res.status(400).json({ error: "Invalid ID" });
        }
        contentId = Number.parseInt(contentId);

        if (contentType === "post") {
            try {
                await blogsDb.hidePostById(contentId, hidden);
            } catch (e) {
                res.status(404).json({ error: "Blog not found" });
            }
        } else if (contentType === "comment") {
            try {
                await commentsDb.hideCommentById(contentId, hidden);
            } catch (e) {
                res.status(404).json({ error: "Comment not found" });
            }
        } else {
            return res.status(422).json({ error: "Invalid contentType field." });
        }
        return res.status(200).json({ message: "Success" });

    }
}