import CodeTemplate from "@/model/codeTemplate";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function addCodeTemplate(codeTemplate) {
    dbTagIds = [];
    for (const tag of codeTemplate.tags) {
        dbTags.push(createTagAndGetId(tag));
    }

    if (parentId) {
        const parentCodeTemplate = await getCodeTemplateById(parentId);
        title = parentCodeTemplate.title;
        explanation = parentCodeTemplate.explanation;
        content = parentCodeTemplate.content;
        tags = parentCodeTemplate.tags;
        userId = codeTemplate.userId;
    }

    const savedDbCodeTemplate = await prisma.codeTemplate.create({
        data: {
            title: codeTemplate.title,
            explanation: codeTemplate.explanation,
            content: codeTemplate.content,
            tags: {
                connect: tagIds.map(tagId => ({ id: tagId }))
            },
            parentId: codeTemplate.parentId,
            userId: codeTemplate.userId
        }
    });

    return savedDbCodeTemplate;
}

/* Attempts to create a tag, and return its id.
   If a tag with the same name already exists,
   return its id. */
export async function createTagAndGetId(tag) {
    // Assume tag is a string
    const dbTag = await prisma.tag.findFirst({ 
        where: {name: tag}
    });

    if (!dbTag) { // If the tag does not exist
        dbTag = await prisma.tag.create({
            data: {
                name: tag
            }
        });
    }

    return dbTag.id;
}

export async function getCodeTemplateById(id) {
    const dbCodeTemplate = await prisma.codeTemplate.findFirst({
        where: { id: id }
    });

    return toCodeTemplate(dbCodeTemplate);
}

export async function getCodeTemplateByUserId(userId) {
    const codeTemplates = await prisma.codeTemplate.findMany({
        where: {
            userId: userId
        }
    });
    return codeTemplates;
}

export async function deleteCodeTemplateById(id) {
    await prisma.codeTemplate.delete({
        where: {
            id: id
        }
    });
}

export async function getCodeTemplateByTitle(substring) {
    const dbCodeTemplates = await prisma.codeTemplate.findMany({
        where: {
            title: {
                contains: substring,  // Look for code templates containing substring
                mode: 'insensitive'   // Case-insensitive
            }
        }
    });

    const codeTemplates = [];
    for (const dbCodeTemplate of dbCodeTemplates) {
        codeTemplates.push(toCodeTemplate(dbCodeTemplate));
    }

    return codeTemplates;
}

export async function getCodeTemplateByTag(substring) {
    const dbCodeTemplates = await prisma.codeTemplate.findMany({
        where: {
            tags: {
                some: {
                    name: {
                        contains: substring,  // Look for code templates containing substring
                        mode: 'insensitive'   // Case-insensitive
                    }
                }
            }
        }
    });

    const codeTemplates = [];
    for (const dbCodeTemplate of dbCodeTemplates) {
        codeTemplates.push(toCodeTemplate(dbCodeTemplate));
    }

    return codeTemplates;
}

export async function getCodeTemplateByContent(substring) {
    const dbCodeTemplates = await prisma.codeTemplate.findMany({
        where: {
            content: {
                contains: substring,  // Look for code templates containing substring
                mode: 'insensitive'   // Case-insensitive
            }
        }
    });

    const codeTemplates = [];
    for (const dbCodeTemplate of dbCodeTemplates) {
        codeTemplates.push(toCodeTemplate(dbCodeTemplate));
    }

    return codeTemplates;
}

export async function updateTitleById(id, newTitle) {
    await prisma.codeTemplate.update({
        where: { id: id },
        data: {
            title: newTitle
        }
    });
}

export async function updateExplanationById(id, newExplanation) {
    await prisma.codeTemplate.update({
        where: { id: id },
        data: {
            explanation: newExplanation
        }
    });
}

export async function updateContentById(id, newContent) {
    await prisma.codeTemplate.update({
        where: { id: id },
        data: {
            content: newContent
        }
    });
}

export async function addTagById(id, newTag) {
    // Assume newTag is a string
    
    const newTagId = createTagAndGetId(newTag);

    await prisma.codeTemplate.update({
        where: { id: id },
        data: {
            tags: {
                connect: { id: newTagId }
            }
        }
    });
}

export async function updateParentById(id, newParentId) {
    await prisma.codeTemplate.update({
        where: { id: id },
        data: {
            parent: {
                connect: {
                    id: newParentId
                }
            }
        }
    });
}

function toCodeTemplate(dbCodeTemplate) {
    if (!dbCodeTemplate) {
        return null;
    }

    // Convert dbCodeTemplate.tags into an array of strings
    const stringTags = dbCodeTemplate.tags.map(tag => tag.name);

    return new CodeTemplate(dbCodeTemplate.id, dbCodeTemplate.title, dbCodeTemplate.explanation, dbCodeTemplate.content,
        stringTags, dbCodeTemplate.parent, dbCodeTemplate.parentId, dbCodeTemplate.children);
}