import User from '@/model/user';
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient();

export async function addUser(user) {
  const savedDbUser = await prisma.user.create({
    data: {
      username: user.username,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatarPath: user.avatarPath
    }
  });

  return savedDbUser;
}

export async function isUsernameTaken(username) {
  const dbUser = await prisma.user.findFirst({
    where: { username: username }
  });

  return dbUser ? true : false;
}

export async function isEmailTaken(email) {
  const dbUser = await prisma.user.findFirst({
    where: { email: email }
  });

  return dbUser === null ? false : true;
}

export async function isPhoneNumberTaken(phoneNumber) {
  const dbUser = await prisma.user.findFirst({
    where: { phoneNumber: phoneNumber }
  });

  return dbUser ? true : false;
}

export async function getUserByUsername(username) {
  const dbUser = await prisma.user.findFirst({
    where: { username: username }
  });

  return toUser(dbUser);
}

export async function getUserById(id) {
  const dbUser = await prisma.user.findFirst({
    where: { id: id },
    include: {
      codeTemplates: {
        include: {
          tags: true,
        },
      },
    },
  });

  return toUser(dbUser);
}

export async function getUserByIdRaw(id) {
  const dbUser = await prisma.user.findFirst({
    where: { id: id },
    include: {
      codeTemplates: {
        include: {
          tags: true,
        },
      },
    },
  });

  return dbUser;
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

export async function updateAvatarPathById(id, newAvatarPath) {
  await prisma.user.update({
    where: { id: id },
    data: {
      avatarPath: newAvatarPath
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
     dbUser.lastName, dbUser.email, dbUser.phoneNumber, dbUser.avatarPath, dbUser.role);
}

export async function deleteUserById(id) {
  await prisma.user.delete({
      where: {
          id: id
      }
  });
}

// private "logging" util
export async function getAllUsers() {
  const allUsers = await prisma.user.findMany({
    include: {
      blogPosts: {
        include: {
          comments: {
            include: {
              author: false
            }
          },
          codeTemplates: true,
          tags: true
        }
      },
      codeTemplates: {
        include: {
          tags: true,
        },
      },
    },
  });
  return allUsers;
}
