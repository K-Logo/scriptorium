import User from '@/model/user';
import { addUser } from '@/service/users_db';
const bcrypt = require('bcrypt');

/*
* Accepts bodies with *mandatory* username, password, firstName, lastName, email and phoneNumber fields.
* The user may upload an avatar after signing up, in the edit profile flow.
*/
export default async function signup(req, res) {
  if (req.method === "POST") {
    const { username, password, firstName, lastName, email, phoneNumber } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User(null, username, passwordHash, firstName, lastName, email, phoneNumber, "USER");

    try {
      const savedUser = await addUser(user);
      res.status(201).json(savedUser);
    } catch (e) {
      res.status(409).json({ error: "Username, email or phone number already taken." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." })
  }
}
