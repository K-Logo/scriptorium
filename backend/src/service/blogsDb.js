import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

export async function addBlogPost(blog){
    const savedDbBlog = await prisma.blog.create({
        data: {
            title: blog.title,
            description: blog.description,
            tag: blog.tag,
            link_to_code: blog.link_to_code,
            user: blog.user
        }
    });

    return savedDbBlog;
}

export async function searchBlogPostByTitle(title) {
    const blogs = await prisma.blog.findMany({
        where: {
            title: {
            contains: title,
            mode: 'insensitive', // doesn't matter if there are capitals in the title
            },
        },
        });
    return blogs;
};

export async function searchBlogPostByDescription(content) {
    const blogs = await prisma.blog.findMany({
        where: {
            description: {
            contains: content,
            mode: 'insensitive', // doesn't matter if there are capitals in the title
            },
        },
        });
    return blogs;
}

export async function searchBlogPostByTag(tag) {
    const blogs = await prisma.blog.findMany({
        where: {
            tag: {
            contains: tag,
            mode: 'insensitive', // doesn't matter if there are capitals in the title
            },
        },
        });
    return blogs;
}

export async function searchBlogPostByCode(template) {
    // ManyToMany fields
    // TODO: waiting for the code templates implementation
}