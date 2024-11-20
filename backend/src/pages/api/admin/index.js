import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
import * as blogsDb from '@/service/blogsDb';
import * as commentsDb from '@/service/commentsDb';
import { verifyAndDecodeJWTNoId } from '@/service/jwt';
import { getUserById } from '@/service/usersDb';
import { paginate } from "@/service/paginate";

export default async function handler(req, res) {
    const decodedJWT = verifyAndDecodeJWTNoId(req);
    if (!decodedJWT || decodedJWT.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "GET") {
        let allPosts = await prisma.blog.findMany({
            orderBy: {
                numReports: "desc"
            },
            include: {
                reports: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarPath: true,
                        role: true
                    }
                }
            }
          });

        let allComments = await prisma.comment.findMany({
            orderBy: {
                numReports: "desc"
            },
            include: {
                reports: true,
                author: {
                        select: {
                            id: true,
                            username: true,
                            avatarPath: true,
                            role: true
                        }
                    }
            }
        });

        const epp1 = new URL("https://localhost:3000" + req.url).searchParams.get("epp1");
        const pno1 = new URL("https://localhost:3000" + req.url).searchParams.get("pno1");
        const epp2 = new URL("https://localhost:3000" + req.url).searchParams.get("epp2");
        const pno2 = new URL("https://localhost:3000" + req.url).searchParams.get("pno2");

        allPosts = paginate(epp1, pno1, allPosts);  // if entries per page or page number are null, their defaults are 20 and 1, respectively
        allComments = paginate(epp2, pno2, allComments);
        if (!allPosts)    return res.status(400).json({ error: "Post page size must be between 1 and 30, and page numbers must be at least 1." });
        if (!allComments)    return res.status(400).json({ error: "Comment page size must be between 1 and 30, and page numbers must be at least 1." });
        return res.status(200).json({ 
            allPosts: allPosts[0],
            postPageNum: allPosts[1],
            postNumEntries: allPosts[2],
            allComments: allComments[0],
            commentPageNum: allComments[1],
            commentNumEntries: allComments[2]
        });        
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