import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

export async function addComment(commentContent, authorId, blogId, parentId = null) {
    const savedComment = await prisma.comment.create({
        data: {
            authorId: authorId,
            blogId: blogId,
            content: commentContent,
            author: {
                connect: { id: authorId }
            },
            blogPost: {
                connect: { id: blogId } 
            },
            ...(parentId && { // Connects to a parent comment if it's a reply
                parent: {
                    connect: { id: parentId },
                }
            })
        }
    });
    return savedComment;
}

export async function searchCommentById(id) {
    const comment = await prisma.comment.findFirst({
        where: {
            id: id
        }
    });

    return comment;
}

export async function updateRatingById(id) {
    if (action == "upvote") {
        await prisma.comment.update({
            where: {id: id },
            data: {
                rating: {
                    increment: 1
                }
            }
        });
    } else if (action == "downvote") {
        await prisma.comment.update({
            where: {id: id },
            data: {
                rating: {
                    increment: -1
                }
            }
        });
    }
}

export async function getSortedComments() {
    const allComments = await prisma.comment.findMany({
        orderBy: {
            reports: "desc"
            }
        });
    return allComments;
}

export async function hideCommentById(id, hidden) {
    await prisma.comment.update({
        where: { id: id },
        data: {
            hidden: hidden
        }
    });
}