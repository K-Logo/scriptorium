import * as usersDb from '@/service/usersDb';
import { getJWT, verifyAndDecodeJWT } from '@/service/jwt';
import { getCodeTemplateByUserId } from '@/service/codeTemplateDb';
import { deleteUserById, getUserById } from '@/service/usersDb';
const bcrypt = require('bcrypt');
const fs = require('fs');
const files = fs.readdirSync('./public/avatars')
                .map((file) => "localhost:3000/avatars/" + file);;

export default async function handler(req, res) {
  let { id } = req.query;
  id = Number.parseInt(id);
  if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
  }
  let user = await getUserById(id);
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
    if (newPassword) {
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await usersDb.updatePasswordHashById(id, newPasswordHash);        
    }
    if (newFirstName)   await usersDb.updateFirstNameById(id, newFirstName);
    if (newLastName)    await usersDb.updateLastNameById(id, newLastName);

    const errs = [];
    if (newAvatarPath) {
      if (files.includes(newAvatarPath)) {
        await usersDb.updateAvatarPathById(id, newAvatarPath);
      } else {
        const err = new Object();
        err[errs.length] = `${newAvatarPath} is not a valid avatar.`
        errs.push(err);
      }
    }
    
    try {
      if (newUsername)    await usersDb.updateUsernameById(id, newUsername);
    } catch (e) {
      const err = new Object();
      err[errs.length] = `A user with username ${newUsername} already exists.`;
      errs.push(err);
    }

    try {
      if (newEmail)       await usersDb.updateEmailById(id, newEmail);
    } catch (e) {
      const err = new Object();
      err[errs.length] = `A user with email ${newEmail} already exists.`;
      errs.push(err);
    }

    try {
      if (newPhoneNumber) await usersDb.updatePhoneNumberById(id, newPhoneNumber);
    } catch (e) {
      const err = new Object();
      err[errs.length] = `A user with phone number ${newPhoneNumber} already exists.`;
      errs.push(err);
    }

    const jwt = getJWT(await usersDb.getUserById(id), 15);
    if (errs.length === 0) {
      return res.status(200).json({ token: jwt });  // return JWT with updated user details
    } else {
      return res.status(409).json({ errors: errs, token: jwt });
    }
  } else if (req.method === "GET") {
    let { id } = req.query;
    id = Number.parseInt(id);
    const decodedJWT = verifyAndDecodeJWT(req, id);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const codeTemplates = await getCodeTemplateByUserId(id);
    res.status(200).json(codeTemplates);

  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
