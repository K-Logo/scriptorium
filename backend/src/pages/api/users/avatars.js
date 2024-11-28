import { verifyAndDecodeJWTNoId } from '@/service/jwt';
const fs = require('fs');

export default async function getAvatars(req, res) {
  if (req.method === "GET") {
    const decodedJWT = verifyAndDecodeJWTNoId(req);
    if (!decodedJWT) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const files = fs.readdirSync('./public/avatars')
                    .map((file) => "/avatars/" + file);
    res.status(200).json(files);
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}