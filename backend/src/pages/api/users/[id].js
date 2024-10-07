import * as users_db from '@/service/users_db';
import { getJWT, verifyAndDecodeJWT } from '@/service/jwt';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export default async function handler(req, res) {
  if (req.method === "PUT") {
    let { id } = req.query;
    id = Number.parseInt(id);
    const decodedJWT = verifyAndDecodeJWT(getTokenFrom(req), id);
    if (!decodedJWT) {
      res.status(401).json({ error: "Unauthorized" });
    }

    // the following fields will be null there is no change; otherwise, they will be a string w updated value.
    const { newUsername, newPassword, newFirstName, newLastName, newEmail, newPhoneNumber } = req.body;
    if (newPassword) {
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      users_db.updatePasswordHashById(id, newPasswordHash);        
    }
    if (newFirstName)   users_db.updateFirstNameById(id, newFirstName);
    if (newLastName)    users_db.updateLastNameById(id, newLastName);

    // the below cannot have duplicates. the UPDATE may fail in DB - error handling required
    if (newUsername)    users_db.updateUsernameById(id, newUsername);
    if (newEmail)       users_db.updateEmailById(id, newEmail);
    if (newPhoneNumber) users_db.updatePhoneNumberById(id, newPhoneNumber);

    const jwt = getJWT(await users_db.getUserById(id), 15);
    res.status(200).json({ token: jwt });  // return JWT with updated user details
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}

function getTokenFrom(req) {
  const authorization = req.headers['authorization'];
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
}
