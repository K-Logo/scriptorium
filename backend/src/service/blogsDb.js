import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

export async function addBlogPost(blog){
    const savedDbBlog = await prisma.blog.create({
        data: {
            title: blog.title,
            description: blog.description,
            tag: blog.tag,
            code_template: blog.code_template,
            author: blog.author
        }
    });

    return savedDbBlog;
}

export async function searchBlogPostByTitle(title) {
    const blogs = await prisma.blog.findMany({
        where: {
            title: {
            contains: title,
            mode: 'insensitive' // doesn't matter if there are capitals in the title
            }
        }
        });
    return blogs;
};

export async function searchBlogPostByDescription(content) {
    const blogs = await prisma.blog.findMany({
        where: {
            description: {
            contains: content,
            mode: 'insensitive' // doesn't matter if there are capitals in the title
            }
        }
        });
    return blogs;
}

export async function searchBlogPostByTag(tag) {
    const blogs = await prisma.blog.findMany({
        where: {
            tag: {
            contains: tag,
            mode: 'insensitive' // doesn't matter if there are capitals in the title
            }
        }
        });
    return blogs;
}

export async function searchBlogPostByCode(template) {
    // ManyToMany fields
    // TODO: waiting for the code templates implementation
}

export async function searchBlogPostById(id) {
    const blog = await prisma.blog.findFirst({
        where: {
            id: id
        }
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

export async function updateCodeById(id, code) {
    await prisma.blog.update({
        where: { id: id },
        data: {
            code_template: code
        }
    });
}