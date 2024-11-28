import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();
import { createTagAndGetId } from './codeTemplateDb';

export async function addBlogPost(title, description, tags, codeTemplateId, authorId){
    const dbTagIds = [];
    if (tags) {
        for (const tag of tags) {
            dbTagIds.push(await createTagAndGetId(tag));
        }
    }

    if (codeTemplateId){
        const savedDbBlog = await prisma.blog.create({
            data: {
                title: title,
                description: description,
                tags: {
                    connect: dbTagIds.map(tagId => ({ id: tagId }))
                },
                codeTemplates: {
                    connect: { id: codeTemplateId }
                },
                author: {
                    connect: { id: authorId }
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarPath: true,
                        role: true
                    }
                }
            },
        });
        return savedDbBlog;
    } else {
        const savedDbBlog = await prisma.blog.create({
            data: {
                title: title,
                description: description,
                tags: {
                    connect: dbTagIds.map(tagId => ({ id: tagId }))
                },
                author: {
                    connect: { id: authorId }
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarPath: true,
                        role: true
                    }
                }
            },
        });
        return savedDbBlog;
    }
}

export async function searchBlogPostByTitle(title, userId) {
    const blogs = await prisma.blog.findMany({
        where: {
            title: {
            contains: title
            },
            OR: [
                { hidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
            ]
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { hidden: true },  // Show hidden comments
                        { authorId: userId } // Show comments made by the author
                    ]
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatarPath: true,
                            role: true
                        }
                    }
                },
            },
        },
    });
    return blogs;
};

export async function searchBlogPostByUserId(userId) {
    const blogs = await prisma.blog.findMany({
        where: {
            authorId: userId,
            OR: [
                { hidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
            ]
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { hidden: true },  // Show hidden comments
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
                { hidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
            ]
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { hidden: true },  // Show hidden comments
                        { authorId: userId } // Show comments made by the author
                    ]
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatarPath: true,
                            role: true
                        }
                    }
                },
            },
        },
        });
    return blogs;
}

export async function searchBlogPostByTag(tag, userId) {
    const blogs = await prisma.blog.findMany({
        where: {
            tags: {
                some: {
                    name: {
                        contains: tag
                    }
                }
            },
            OR: [
                { hidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
            ]
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { hidden: true },  // Show hidden comments
                        { authorId: userId } // Show comments made by the author
                    ]
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatarPath: true,
                            role: true
                        }
                    }
                },
            },
        },
    });
    return blogs;
}

export async function searchBlogPostByCodeTemplateId(templateId, userId) {
    const blogs = await prisma.blog.findMany({
        where: {
            codeTemplates: {
                some: {
                    id: templateId
                }
            }
        },
        include: {
            comments: {
                where: {
                    OR: [
                        { hidden: true },  // Show hidden comments
                        { authorId: userId } // Show comments made by the author
                    ]
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatarPath: true,
                            role: true
                        }
                    }
                },
            },
        },
    })

    return blogs;
}

export async function searchBlogPostById(id, userId) {
    if (userId == null) {
        const blog = await prisma.blog.findFirst({
            where: {
                id: id
            },
            include: {
                comments: {
                    where: {
                        hidden: false
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatarPath: true,
                                role: true
                            }
                        },
                        replies: {
                            where: {
                                hidden: false
                            },
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        username: true,
                                        avatarPath: true,
                                        role: true
                                    }
                                },
                                replies: {where: {
                                    hidden: false
                                },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            username: true,
                                            avatarPath: true,
                                            role: true
                                        }
                                    },
                                    replies: {
                                        where: {
                                            hidden: false
                                        },
                                        include: {
                                            author: {
                                                select: {
                                                    id: true,
                                                    username: true,
                                                    avatarPath: true,
                                                    role: true
                                                }
                                            },
                                            replies: {
                                                where: {
                                                    hidden: false
                                                },
                                                include: {
                                                    author: {
                                                        select: {
                                                            id: true,
                                                            username: true,
                                                            avatarPath: true,
                                                            role: true
                                                        }
                                                    },
                                                    replies: {
                                                        where: {
                                                            hidden: false
                                                        },
                                                        include: {
                                                            author: {
                                                                select: {
                                                                    id: true,
                                                                    username: true,
                                                                    avatarPath: true,
                                                                    role: true
                                                                }
                                                            },
                                                            replies: {
                                                                where: {
                                                                    hidden: false
                                                                },
                                                                include: {
                                                                    author: {
                                                                        select: {
                                                                            id: true,
                                                                            username: true,
                                                                            avatarPath: true,
                                                                            role: true
                                                                        }
                                                                    },
                                                                    replies: true
                                                                },
                                                            }
                                                        },
                                                    }
                                                },
                                            }
                                        },
                                    }
                                },}
                            },
                        }
                    },
                },
                tags: true
            }
        });
        return blog;
    } else {
        const blog = await prisma.blog.findFirst({
            where: {
              id: id,
              OR: [
                { hidden: false }, // Show public posts
                { authorId: userId } // Show hidden posts for the author
              ]
            },
            include: {
              comments: {
                where: {
                  OR: [
                    { hidden: false }, // Show public comments
                    { authorId: userId } // Show comments made by the author
                  ]
                },
                include: {
                  author: {
                    select: {
                      id: true,
                      username: true,
                      avatarPath: true,
                      role: true
                    }
                  },
                  replies: { // Correctly include the replies relation
                    include: {
                      author: {
                        select: {
                          id: true,
                          username: true,
                          avatarPath: true
                        }
                      }
                    }
                  }
                }
              },
              tags: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  avatarPath: true,
                  role: true
                }
              }
            }
          });
          return blog;
    }  
}

export async function searchBlogPostByIdTmp(id, userId) {
    if (userId == null) {
        const blog = await prisma.blog.findFirst({
            where: {
                id: id
            },
            include: {
                comments: {
                    where: {
                        hidden: false
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatarPath: true,
                                role: true
                            }
                        }
                    },
                },
                tags: true,
                codeTemplates: true,
            }
        });
        return blog;
    } else {
        const blog = await prisma.blog.findFirst({
            where: {
                id: id,
                OR: [
                    { hidden: false }, // Show public posts
                    { authorId: userId } // Show hidden posts for the author
                ]
            },
            include: {
                comments: {
                    where: {
                        OR: [
                            { hidden: false },  // Show public comments
                            { authorId: userId } // Show comments made by the author
                        ]
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatarPath: true,
                                role: true
                            }
                        }
                    },
                },
                tags: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarPath: true,
                        role: true
                    }
                },
                codeTemplates: true,
            },
        
        });
        return blog;
    }  
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

export async function addTagById(id, newTag) {

    const newTagId = await createTagAndGetId(newTag);

    await prisma.blog.update({
        where: { id: id },
        data: {
            tags: {
                connect: { id: newTagId }
            }
        }
    });
}

export async function deleteTagById(id, oldTag) {
    console.log(oldTag);
    await prisma.blog.update({
        where: { id: id },
        data: {
            tags: {
                disconnect: {
                    name: oldTag
                }
            }
        }
    })
}

export async function updateTags(blogId, tags) {
    await prisma.blog.update({
        where: {id: blogId},
        data: {
            tags: {
                set: newTags.map(tag => ({ name: tag }))
            }
        }
    })
}

export async function updateCodeById(id, codeTemplateId) {
    await prisma.blog.update({
        where: { id: id },
        data: {
            codeTemplates: {
                connect: { id: codeTemplateId }
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
            numReports: {
                increment: 1
            }
        }
    });
}

export async function getSortedBlogs(order) {
    // order is asc or desc
    const allBlogs = await prisma.blog.findMany({
        orderBy: {
            rating: order
        },
        where: {
            hidden: false
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    avatarPath: true,
                    role: true
                }
            },
            tags: true
        }
    });
    return allBlogs;
  
}

export async function hidePostById(id, hidden) {
    await prisma.blog.update({
        where: { id: id },
        data: {
            hidden: hidden
        }
    });
}