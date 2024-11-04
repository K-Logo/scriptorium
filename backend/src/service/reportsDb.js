import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

export async function addReport(content, blogId, commentId) {
    let savedReport;
    if (blogId) {
        savedReport = await prisma.report.create({
            data: {
                content: content,
                blog: {
                    connect: { id: blogId }
                }
            }
        });
    } else if (commentId) {
        savedReport = await prisma.report.create({
            data: {
                content: content,
                comment: {
                    connect: { id: commentId }
                }
            }
        });
    }

    return savedReport;
}

export async function updateBlogReportCounter(id) {
    await prisma.blog.update({
        where: {id: id },
        data: {
            numReports: {
                increment: 1
            }
        }
    });
}

export async function updateCommentReportCounter(id) {
    await prisma.comment.update({
        where: {id: id },
        data: {
            numReports: {
                increment: 1
            }
        }
    });
}