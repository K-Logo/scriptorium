import User from '@/model/user';
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

/**
 *  TODO: ERROR HANDLING
 * */

export async function addUser(user) {
  const savedDbUser = await prisma.user.create({
    data: {
      username: user.username,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber
    }
  });

  return savedDbUser;
}

export async function getUserByUsername(username) {
  const dbUser = await prisma.user.findFirst({
    where: { username: username }
  });

  return toUser(dbUser);
}

export async function getUserById(id) {
  const dbUser = await prisma.user.findFirst({
    where: { id: id }
  });

  return toUser(dbUser);
}

// id as int.
export async function updateUsernameById(id, newUsername) {
  await prisma.user.update({
    where: { id: id },
    data: {
      username: newUsername
    }
  });
}

export async function updateEmailById(id, newEmail) {
  await prisma.user.update({
    where: { id: id },
    data: {
      email: newEmail
    }
  });
}

export async function updatePhoneNumberById(id, newPhoneNumber) {
  await prisma.user.update({
    where: { id: id },
    data: {
      phoneNumber: newPhoneNumber
    }
  });
}

export async function updateFirstNameById(id, newFirstName) {
  await prisma.user.update({
    where: { id: id },
    data: {
      firstName: newFirstName
    }
  });
}

export async function updateLastNameById(id, newLastName) {
  await prisma.user.update({
    where: { id: id },
    data: {
      lastName: newLastName
    }
  });
}

export async function updatePasswordHashById(id, newPasswordHash) {
  await prisma.user.update({
    where: { id: id },
    data: {
      passwordHash: newPasswordHash
    }
  });
}


function toUser(dbUser) {
  return new User(dbUser.id, dbUser.username, dbUser.passwordHash, dbUser.firstName,
     dbUser.lastName, dbUser.email, dbUser.phoneNumber, dbUser.role);
}

// private "logging" util
export async function getAllUsers() {
  const allUsers = await prisma.user.findMany();
  return allUsers;
}
