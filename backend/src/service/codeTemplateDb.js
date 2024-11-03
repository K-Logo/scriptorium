import CodeTemplate from "@/model/codeTemplate";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function addCodeTemplate(codeTemplate) {
    // todo: create tags (assume codeTemplate.tags is array of stings)

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
            tags: codeTemplate.tags,
            parentId: codeTemplate.parentId,
            userId: codeTemplate.userId
        }
    });

    return savedDbCodeTemplate;
}

export async function getCodeTemplateById(id) {
    const dbCodeTemplate = await prisma.codeTemplate.findFirst({
        where: { id: id }
    });

    return toCodeTemplate(dbCodeTemplate);
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
    await prisma.codeTemplate.update({
        where: { id: id },
        data: {
            tags: {
                connect: { id: newTag.id }
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

    return new CodeTemplate(dbCodeTemplate.id, dbCodeTemplate.title, dbCodeTemplate.explanation, dbCodeTemplate.content,
        dbCodeTemplate.tags, dbCodeTemplate.parent, dbCodeTemplate.parentId, dbCodeTemplate.children);
}