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
    const dbBlog = await prisma.blog.findFirst({
        where: { title: title }
    });

    // TODO load the blog to somewhere?
}

export async function searchBlogPostByDescription() {
    // TODO: figure out how to search using parts of the description
    // ManyToMany fields
}

export async function searchBlogPostByTag(tag) {
    const dbBlog = await prisma.blog.findFirst({
        where: { tag: tag }
    });

    // TODO load the blog to somewhere?
}

export async function searchBlogPostByCode(template) {
    const dbBlog = await prisma.blog.findFirst({
        where: { link_to_code: template }
    });

    // TODO load the blog to somewhere?
}