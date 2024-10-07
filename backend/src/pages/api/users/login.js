import { getUserByUsername } from '@/service/users_db';
import { getJWT } from '@/service/jwt';
const bcrypt = require('bcrypt');

export default async function login(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    let user = null;
    try {
      user = await getUserByUsername(username);
    } catch (e) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    const isPasswordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);
    if (!(user && isPasswordCorrect)) {  // if user is undefined or password is not correct
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    const token = getJWT(user, 15);  // token expires in 15 mins

    // TODO fetch base64 image
    res.status(200).json({ token: token, id: user.db_id });
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
