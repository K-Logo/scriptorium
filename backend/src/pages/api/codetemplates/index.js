import CodeTemplate from "@/model/codeTemplate";
import { addCodeTemplate, getCodeTemplateByContent, getCodeTemplateByTag, getCodeTemplateByTitle } from "@/service/codeTemplateDb";
import { verifyAndDecodeJWT } from "@/service/jwt";

export default async function handler(req, res) {
    if (req.method == "POST") {
        let { title, explanation, content, tags, parentId, userId, language } = req.body;
        userId = Number.parseInt(userId);
        const decodedJWT = verifyAndDecodeJWT(req, userId);
        if (!decodedJWT) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const codeTemplate = new CodeTemplate(null, title, explanation, content, tags, parentId, userId, language);

        try {
            const savedCodeTemplate = await addCodeTemplate(codeTemplate);
            return res.status(201).json(savedCodeTemplate);
        } catch (e) {
            return res.status(409).json({ error: "Please double check your fields." });
        }

    } else if (req.method == "GET") {
        // Search by only one of the fields
        const { title, content, tag } = req.query;

        let codeTemplate = null;
        if (title) {
            try {
                codeTemplate = await getCodeTemplateByTitle(title);
                return res.status(200).json(codeTemplate);
            } catch (e) {
                res.status(401).json({ error: "Invalid title." });
                return;
            }
        } else if (content) {
            try {
                codeTemplate = await getCodeTemplateByContent(content);
                return res.status(200).json(codeTemplate);
            } catch (e) {
                res.status(401).json({ error: "Invalid content." });
                return;
            }
        } else if (tag) {
            try {
                codeTemplate = await getCodeTemplateByTag(tag);
                return res.status(200).json(codeTemplate);
            } catch (e) {
                res.status(401).json({ error: "Invalid tag." });
                return;
            }
        } else {
            res.status(401).json({ error: "Invalid fields." });
            return;
        }

    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}