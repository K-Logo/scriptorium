import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

export async function addBlogPost(blog){
    const savedDbBlog = await prisma.blog.create({
        data: {
            authorId: blog.authorId,
            title: blog.title,
            description: blog.description,
            tag: {
                connect: blog.tagId
            },
            codeTemplate: {
                connect: blog.codeTemplateId
            },
            author: {
                connect: { id: blog.authorId }
            }
        }
    });

    return savedDbBlog;
}

export async function searchBlogPostByTitle(title, userId) {
    const blogs = await prisma.blog.findMany({
        where: {
            title: {
            contains: title
            },
            OR: [
                { isHidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
            ]
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { isHidden: true },  // Show hidden comments
                        { authorId: userId } // Show comments made by the author
                    ]
                },
                include: {
                    author: true, // Include the author of each comment
                },
            },
        },
    });
    return blogs;
};

export async function searchBlogPostByDescription(content, userId) {
    const blogs = await prisma.blog.findMany({
        where: {
            description: {
            contains: content
            },
            OR: [
                { isHidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
            ]
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { isHidden: true },  // Show hidden comments
                        { authorId: userId } // Show comments made by the author
                    ]
                },
                include: {
                    author: true, // Include the author of each comment
                },
            },
        },
        });
    return blogs;
}

export async function searchBlogPostByTag(tag, userId) {
    const blogs = await prisma.blog.findMany({
        where: {
            tag: {
            contains: tag
            },
            OR: [
                { isHidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
            ]
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { isHidden: true },  // Show hidden comments
                        { authorId: userId } // Show comments made by the author
                    ]
                },
                include: {
                    author: true, // Include the author of each comment
                },
            },
        },
    });
    return blogs;
}

export async function searchBlogPostByCode(template) {
    const blogs = await prisma.blog.findMany({
        where: {
            code_template: template
        }
    })

    return blogs;
}

export async function searchBlogPostById(id, userId) {
    const blog = await prisma.blog.findFirst({
        where: {
            id: id,
            OR: [
                { isHidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
            ]
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { isHidden: true },  // Show hidden comments
                        { authorId: userId } // Show comments made by the author
                    ]
                },
                include: {
                    author: true, // Include the author of each comment
                },
            },
        },
    });

    return blog;
}

export async function updateTitleById(id, title) {
    await prisma.blog.update({
        where: { id: id },
        data: {
            title: title
        }
    });
}

export async function updateDescriptionById(id, desc) {
    await prisma.blog.update({
        where: { id: id },
        data: {
            description: desc
        }
    });
}

export async function updateTagById(id, tag) {
    await prisma.blog.update({
        where: { id: id },
        data: {
            tag: tag
        }
    });
}

export async function updateCodeById(id, codeTemplateId) {
    await prisma.blog.update({
        where: { id: id },
        data: {
            code_template: {
                connect: {id: codeTemplateId}
            }
        }
    });
}

export async function updateRatingById(id, action) {
    if (action == "upvote") {
        await prisma.blog.update({
            where: {id: id },
            data: {
                rating: {
                    increment: 1
                }
            }
        });
    } else if (action == "downvote") {
        await prisma.blog.update({
            where: {id: id },
            data: {
                rating: {
                    increment: -1
                }
            }
        });
    }
} 

export async function updateReportCounter(id) {
    await prisma.blog.update({
        where: {id: id },
        data: {
            reports: {
                increment: 1
            }
        }
    });
}

export async function getSortedBlogs() {
    const allBlogs = await prisma.blog.findMany({
        orderBy: {
            reports: "desc"
          }
    });
    return allBlogs;
  
export async function hidePostById(id, hidden) {
    await prisma.blog.update({
        where: { id: id },
        data: {
            hidden: hidden
        }
    });
}