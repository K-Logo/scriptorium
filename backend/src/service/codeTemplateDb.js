import CodeTemplate from "@/model/codeTemplate";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function addCodeTemplate(codeTemplate) {
    console.log("3333333")
    console.log(codeTemplate.userId)
    if (codeTemplate.parentId) {
        let parentCodeTemplate = await getCodeTemplateById(codeTemplate.parentId);
        parentCodeTemplate = toCodeTemplate(parentCodeTemplate);
        codeTemplate.title = parentCodeTemplate.title;
        codeTemplate.explanation = parentCodeTemplate.explanation;
        codeTemplate.content = parentCodeTemplate.content;
        codeTemplate.tags = parentCodeTemplate.tags;
        console.log("47592374809321074891327098471238904")
        console.log(parentCodeTemplate.title)
        console.log(parentCodeTemplate.explanation)
        console.log(parentCodeTemplate.content)
        console.log(parentCodeTemplate.tags)
        console.log(parentCodeTemplate.userId)
    }

    const dbTagIds = [];
    console.log(codeTemplate.tags)
    if (codeTemplate.tags) {
        for (const tag of codeTemplate.tags) {
            console.log("fjdkldjfl")
            console.log(tag)
            dbTagIds.push(await createTagAndGetId(tag));
        }
    }
    console.log(dbTagIds);

    console.log("oooooooooo")
    console.log(codeTemplate.userId)

    const savedDbCodeTemplate = await prisma.codeTemplate.create({
        data: {
            title: codeTemplate.title,
            explanation: codeTemplate.explanation,
            content: codeTemplate.content,
            tags: {
                connect: dbTagIds.map(tagId => ({ id: tagId }))
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
    let dbTag = await prisma.tag.findFirst({ 
        where: {name: tag}
    });
    console.log(dbTag)

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
        where: { id: id },
        include: {
            tags: true,
        }
    });

    return dbCodeTemplate;
}

export async function getCodeTemplateByUserId(userId) {
    const codeTemplates = await prisma.codeTemplate.findMany({
        where: {
            userId: userId
        },
        include: {
            tags: true,
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
            }
        },
        include: {
            tags: true,
        }
    });

    console.log(dbCodeTemplates);

    const codeTemplates = [];
    for (const dbCodeTemplate of dbCodeTemplates) {
        codeTemplates.push(dbCodeTemplate);
    }

    console.log(codeTemplates);

    return codeTemplates;
}

export async function getCodeTemplateByTag(substring) {
    const dbCodeTemplates = await prisma.codeTemplate.findMany({
        where: {
            tags: {
                some: {
                    name: {
                        contains: substring,  // Look for code templates containing substring
                    }
                }
            }
        },
        include: {
            tags: true,
        }
    });

    const codeTemplates = [];
    for (const dbCodeTemplate of dbCodeTemplates) {
        codeTemplates.push(dbCodeTemplate);
    }

    return codeTemplates;
}

export async function getCodeTemplateByContent(substring) {
    const dbCodeTemplates = await prisma.codeTemplate.findMany({
        where: {
            content: {
                contains: substring,  // Look for code templates containing substring
            }
        }
    });

    const codeTemplates = [];
    for (const dbCodeTemplate of dbCodeTemplates) {
        codeTemplates.push(dbCodeTemplate);
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
    
    const newTagId = await createTagAndGetId(newTag);

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
    console.log(dbCodeTemplate.tags);//todo:delete
    const stringTags = dbCodeTemplate.tags.map(tag => tag.name);
    console.log(stringTags);
    return new CodeTemplate(dbCodeTemplate.id, dbCodeTemplate.title, dbCodeTemplate.explanation, dbCodeTemplate.content,
        stringTags, dbCodeTemplate.parentId, dbCodeTemplate.userId);
}
