#!/usr/bin/env bash

cd backend

npm i
npm i prisma @prisma/client @prisma/studio
npx prisma generate
npx prisma migrate dev --name init

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addUser() {
  const savedDbUser = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: '$2b$10$78dr.tiwU7.nYIxvySDMqOzoNpFlg23sASqipKOjif2jFs0IO5H8y',
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin',
      phoneNumber: 'admin',
      avatarPath: 'localhost:3000/avatars/amongus.jpg',
      role: 'ADMIN'
    }
  });
} 
  addUser();"
