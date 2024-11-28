#!/usr/bin/env bash

cd backend

echo "DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
SECRET_KEY=SECRETKEY
SALTROUNDS=10" > .env

cd src/pages/api/exec/sandbox
docker build -t sandbox .

cd ../../../../..

npm i
npm i prisma @prisma/client @prisma/studio
npx prisma generate
npx prisma migrate dev --name init

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAdmin() {
  await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: '\$2b\$10\$78dr.tiwU7.nYIxvySDMqOzoNpFlg23sASqipKOjif2jFs0IO5H8y',
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin',
      phoneNumber: 'admin',
      avatarPath: '/avatars/amongus.jpg',
      role: 'ADMIN'
    }
  });
}

async function addUser(username, firstName, lastName, email, phoneNumber) {
  await prisma.user.create({
    data: {
      username: username,
      passwordHash: '\$2\$10\$78dr.tiwU7.nYIxvySDMqOzoNpFlg23sASqipKOjif2jFs0IO5H8y',
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      avatarPath: '/avatars/amongus.jpg',
      role: 'USER'
    }
  });
}

async function createUsers() {
  // Create 5 regular users
  await addUser('user1', 'John', 'Doe', 'user1@example.com', '1234567890');
  await addUser('user2', 'Jane', 'Smith', 'user2@example.com', '1234567891');
  await addUser('user3', 'Alice', 'Johnson', 'user3@example.com', '1234567892');
  await addUser('user4', 'Bob', 'Brown', 'user4@example.com', '1234567893');
  await addUser('user5', 'Charlie', 'Davis', 'user5@example.com', '1234567894');
}

async function generateCodeTemplates(users) {
  const codeTemplates = [];

  for (let i = 0; i < 40; i++) {
    const user = users[i % users.length]; // Distribute code templates evenly across users
    const codeTemplate = await prisma.codeTemplate.create({
      data: {
        title: 'Code Template ' + (i + 1),
        explanation: 'Explanation of Code Template ' + (i + 1),
        content: 'Code content for template ' + (i + 1),
        language: 'javascript',  // You can modify this based on your requirements
        userId: user.id,  // Assign to the selected user
      }
    });
    codeTemplates.push(codeTemplate);
  }

  return codeTemplates;
}

async function generateBlogs(users, codeTemplates) {
  const blogs = [];

  for (let i = 0; i < 40; i++) {
    const user = users[i % users.length]; // Distribute blogs evenly across users
    const blog = await prisma.blog.create({
      data: {
        title: 'Blog ' + (i + 1),
        description: 'Description for blog ' + (i + 1),
        authorId: user.id,  // Assign to the selected user
        rating: 0,
        numReports: 0,
        hidden: false,
      }
    });
    blogs.push(blog);
  }

  return blogs;
}

async function generateComments(users, blogs) {
  const comments = [];

  for (let i = 0; i < 40; i++) {
    const blog = blogs[i % blogs.length];  // Distribute comments evenly across blogs
    const user = users[i % users.length];  // Distribute comments evenly across users
    const comment = await prisma.comment.create({
      data: {
        content: 'This is a comment for ' + blog.title + ' by ' + user.username,
        authorId: user.id, // Assign to the selected user
        blogPostId: blog.id,  // Assign to the selected blog
        rating: 0,
        numReports: 0,
        hidden: false,
      }
    });
    comments.push(comment);
  }

  return comments;
}

async function main() {
  await addAdmin();
  await createUsers();

  // Fetch all users
  const users = await prisma.user.findMany({
    where: {
      role: 'USER'
    }
  });

  // Generate Code Templates and Blogs
  const codeTemplates = await generateCodeTemplates(users);
  const blogs = await generateBlogs(users, codeTemplates);

  // Generate Comments
  await generateComments(users, blogs);
}

main();
"
