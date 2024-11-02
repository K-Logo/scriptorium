import CodeTemplate from "@/model/codeTemplate";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function addCodeTemplate(codeTemplate) {
    const savedDbCodeTemplate = await prisma.codeTemplate.create({
        data: {
            title: codeTemplate.title,
            explanation: codeTemplate.explanation,
            content: codeTemplate.content,
            tags: codeTemplate.tags,
            parent: codeTemplate.parent,
            parentId: codeTemplate.parentId,
            children: codeTemplate.children
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

function toCodeTemplate(dbCodeTemplate) {
    return new CodeTemplate(dbCodeTemplate.id, dbCodeTemplate.title, dbCodeTemplate.explanation, dbCodeTemplate.content,
        dbCodeTemplate.tags, dbCodeTemplate.parent, dbCodeTemplate.parentId, dbCodeTemplate.children);
}