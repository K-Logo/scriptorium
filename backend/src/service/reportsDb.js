import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

export async function addReport(content, blogId, commentId) {
    const savedReport = await prisma.report.create({
        data: {
            content: content,
            blog: {
                connect: blogId
            },
            commentId: {
                connect: commentId
            }
        }
    });

    return savedReport;
}

export async function updateBlogReportCounter(id) {
    await prisma.blog.update({
        where: {id: id },
        data: {
            reports: {
                increment: 1
            }
        }
    });
}

export async function updateCommentReportCounter(id) {
    await prisma.comment.update({
        where: {id: id },
        data: {
            reports: {
                increment: 1
            }
        }
    });
}