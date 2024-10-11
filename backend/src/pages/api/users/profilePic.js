import { verifyAndDecodeJWT } from '@/service/jwt';
const formidable = require("formidable");

// ref: https://gist.github.com/agmm/da47a027f3d73870020a5102388dd820 - ref for frontend
// too lazy to test this... to test we need partially implemented frontend
export default async function handler(req, res) {
  if (req.method === "POST") {
    let { id } = req.query;
    id = Number.parseInt(id);
    const decodedJWT = verifyAndDecodeJWT(req, id);
    if (!decodedJWT) {
      res.status(401).json({ error: "Unauthorized" });
    }

    return uploadfilePOST(req, res);
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }

  async function uploadfilePOST(req, res) {
    const form = new formidable.IncomingForm()
    form.uploadDir = "../../public/pfps"
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
      if (err) res.status(500).send(err)
      res.status(200).json({ fields, files })
    })
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}
