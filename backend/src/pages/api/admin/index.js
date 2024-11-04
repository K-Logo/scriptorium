import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
import * as blogsDb from '@/service/blogsDb';
import * as commentsDb from '@/service/commentsDb';
import { verifyAndDecodeJWTNoId } from '@/service/jwt';
import { getUserById } from '@/service/usersDb';

export default async function handler(req, res) {
    const decodedJWT = verifyAndDecodeJWTNoId(req);
    if (decodedJWT.role !== "ADMIN") {
        return res.status(401).json({ error: "User is not an administrator; unauthorized" });
    }

    if (req.method === "GET") {
        const allPosts = await prisma.blog.findMany({
            orderBy: {
                numReports: "desc"
            },
            include: {
                reports: true
            }
          });

        const allComments = await prisma.comment.findMany({
            orderBy: {
                numReports: "desc"
            },
            include: {
                reports: true
            }
        });

        return res.status(200).json([allPosts, allComments]);
        
    } else if (req.method === "PUT") {
        let { contentType, contentId, hidden } = req.body;
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