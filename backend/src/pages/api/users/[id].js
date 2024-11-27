import * as usersDb from '@/service/usersDb';
import { getJWT, verifyAndDecodeJWT } from '@/service/jwt';
import { getCodeTemplateByUserId } from '@/service/codeTemplateDb';
import { deleteUserById, getUserById, getUserByIdRaw } from '@/service/usersDb';
import { searchBlogPostByUserId } from '@/service/blogsDb';
import { paginate } from "@/service/paginate";
import { isEmailTaken, isUsernameTaken, isPhoneNumberTaken } from '../../../service/usersDb';
const bcrypt = require('bcrypt');
const fs = require('fs');
const files = fs.readdirSync('./public/avatars')
                .map((file) => "localhost:3000/avatars/" + file);

// accepts something@something.com, and in particular, prevents multiple @ signs.
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
};

/**
 * Accepts:
 * xxxxxxxxxx
 * xxx-xxx-xxxx
 * (xxx) xxx-xxxx 
 * ... or any 10-digits of any format
 */
const validateAndParsePhoneNumber = (phoneNumber) => {
  var targ = phoneNumber.replace(/[^\d]/g,''); // remove all non-digits
  if (targ && targ.length===10) {           // phone numbers are 10 digits long
    return targ;
  }
  return null;
}

/**
 * Valid passwords have one uppercase, one lowercase, one digit, one special character, and length >= 8
 */
const validatePassword = (password) => {
  return /[A-Z]/       .test(password) &&
          /[a-z]/       .test(password) &&
          /[0-9]/       .test(password) &&
          /[^A-Za-z0-9]/.test(password) &&
          password.length > 7;
}

export default async function handler(req, res) {
  let { id } = req.query;
  id = Number.parseInt(id);
  if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
  }
  let user = null;
  try {
    user = await getUserById(id);
  } catch (e) {
    res.status(400).json({ error: "Please check that your query parameter corresponds to the authenticated user's ID" });
  }
  if (!user) {
      return res.status(404).json({ error: "User not found" });
  }

  if (req.method === "PUT") {
    let { id } = req.query;
    id = Number.parseInt(id);
    const decodedJWT = verifyAndDecodeJWT(req, id);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // the following fields will be null there is no change; otherwise, they will be a string w updated value.
    const { newUsername, newPassword, newFirstName, newLastName, newEmail, newPhoneNumber, newAvatarPath } = req.body;

    if (newPassword && !validatePassword(newPassword)) {
      return res.status(400).json({ error: "Please ensure your password has one uppercase, one lowercase, one digit,"
      +" one special character, and is at least 8 characters long."});
    }

    if (newAvatarPath && !files.includes(newAvatarPath)) {
      return res.status(400).json({ error: `${newAvatarPath} is not a valid avatar.` });
    }
    
    if (newUsername && await isUsernameTaken(newUsername)) {
      return res.status(400).json({ error: `A user with username ${newUsername} already exists.` });
    }

    if (newEmail && !validateEmail(newEmail)) {
      return res.status(400).json({ error: "Please specify a proper email format." });
    }
    if (newEmail && await isEmailTaken(newEmail)) {
      return res.status(400).json({ error: `A user with email ${newEmail} already exists.` });
    }

    let parsedPhoneNumber = "";
    if (newPhoneNumber) {
      parsedPhoneNumber = validateAndParsePhoneNumber(newPhoneNumber);  // returns null if validation failed
      if (!parsedPhoneNumber) {
        return res.status(400).json({ error: "Please specify a 10-digit phone number." });
      }
    }
    if (newPhoneNumber && await isPhoneNumberTaken(newPhoneNumber)) {
      return res.status(400).json({ error: `A user with phone number ${newPhoneNumber} already exists.` });
    }

    try {
      if (newPassword) {
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await usersDb.updatePasswordHashById(id, newPasswordHash);        
      }
      if (newFirstName)   await usersDb.updateFirstNameById(id, newFirstName);
      if (newLastName)    await usersDb.updateLastNameById(id, newLastName);
      if (newAvatarPath)  await usersDb.updateAvatarPathById(id, newAvatarPath);
      if (newUsername)    await usersDb.updateUsernameById(id, newUsername);
      if (newEmail)       await usersDb.updateEmailById(id, newEmail);
      if (newPhoneNumber) await usersDb.updatePhoneNumberById(id, newPhoneNumber);
  
      const nu = await usersDb.getUserById(id);
      const jwt = getJWT(nu, 15);
      return res.status(200).json({ jwtToken: jwt, firstName: nu.firstName, lastName: nu.lastName, email: nu.email, phoneNumber: nu.phoneNumber, username: nu.username, avatarPath: nu.avatarPath, id: nu.id });  // return JWT with updated user details  
    } catch (e) {
      return res.status(400).json({ error: "Please check that your query parameter corresponds to the authenticated user's ID" });
    }
  } else if (req.method === "GET") {
    let { id } = req.query;
    const epp = new URL("https://localhost:3000" + req.url).searchParams.get("epp");
    const pno = new URL("https://localhost:3000" + req.url).searchParams.get("pno");
    id = Number.parseInt(id);
    const { type } = req.query;

    if (type === "user") {
      const user = await getUserByIdRaw(id);
      res.status(200).json(user);
    } else if (type === "code-templates") {
      let codeTemplates = await getCodeTemplateByUserId(id);

      codeTemplates = paginate(epp, pno, codeTemplates);  // if entries per page or page number are null, their defaults are 20 and 1, respectively
      if (!codeTemplates)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
      return res.status(200).json({ codeTemplates: codeTemplates[0], pageNum: codeTemplates[1], numEntries: codeTemplates[2] });  
    } else if (type === "blogs") {
      let blogs = await searchBlogPostByUserId(id);

      blogs = paginate(epp, pno, blogs);  // if entries per page or page number are null, their defaults are 20 and 1, respectively
      if (!blogs)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
      return res.status(200).json({ blogs: blogs[0], pageNum: blogs[1], numEntries: blogs[2] });
      } else {
      return res.status(400).json({ error: "Invalid type. Please select from user, code-templates, and blogs." })
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
