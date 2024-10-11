import * as users_db from '@/service/users_db';
import { getJWT, verifyAndDecodeJWT } from '@/service/jwt';
const bcrypt = require('bcrypt');

export default async function handler(req, res) {
  if (req.method === "PUT") {
    let { id } = req.query;
    id = Number.parseInt(id);
    const decodedJWT = verifyAndDecodeJWT(req, id);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // the following fields will be null there is no change; otherwise, they will be a string w updated value.
    const { newUsername, newPassword, newFirstName, newLastName, newEmail, newPhoneNumber } = req.body;
    if (newPassword) {
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await users_db.updatePasswordHashById(id, newPasswordHash);        
    }
    if (newFirstName)   await users_db.updateFirstNameById(id, newFirstName);
    if (newLastName)    await users_db.updateLastNameById(id, newLastName);
    
    const errs = [];
    try {
      if (newUsername)    await users_db.updateUsernameById(id, newUsername);
    } catch (e) {
      const err = new Object();
      err[errs.length] = `A user with username ${newUsername} already exists.`;
      errs.push(err);
    }

    try {
      if (newEmail)       await users_db.updateEmailById(id, newEmail);
    } catch (e) {
      const err = new Object();
      err[errs.length] = `A user with email ${newEmail} already exists.`;
      errs.push(err);
    }

    try {
      if (newPhoneNumber) await users_db.updatePhoneNumberById(id, newPhoneNumber);
    } catch (e) {
      const err = new Object();
      err[errs.length] = `A user with phone number ${newPhoneNumber} already exists.`;
      errs.push(err);
    }

    const jwt = getJWT(await users_db.getUserById(id), 15);
    if (errs.length === 0) {
      return res.status(200).json({ token: jwt });  // return JWT with updated user details
    } else {
      return res.status(409).json({ errors: errs, token: jwt });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
