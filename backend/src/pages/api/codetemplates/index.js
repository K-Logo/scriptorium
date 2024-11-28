import CodeTemplate from "@/model/codeTemplate";
import { addCodeTemplate, getCodeTemplateByContent, getCodeTemplateByTag, getCodeTemplateByTitle } from "@/service/codeTemplateDb";
import { verifyAndDecodeJWT } from "@/service/jwt";
import { paginate } from "@/service/paginate";

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
            console.log(e)
            return res.status(409).json({ error: "Please double check your fields." });
        }

    } else if (req.method == "GET") {
        // Search by only one of the fields
        const { title, content, tag } = req.query;

        // localhost here to match URL validation regex. DO NOT RM
        const epp = new URL("https://localhost:3000" + req.url).searchParams.get("epp");
        const pno = new URL("https://localhost:3000" + req.url).searchParams.get("pno");

        let codeTemplate = null;
        if (title) {
            try {
                codeTemplate = paginate(epp, pno, await getCodeTemplateByTitle(title));  // if entries per page or page number are null, their defaults are 20 and 1, respectively
                if (!codeTemplate)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
                return res.status(200).json({ codeTemplate: codeTemplate[0], pageNum: codeTemplate[1], numEntries: codeTemplate[2] });        
            } catch (e) {
                res.status(401).json({ error: "Invalid title." });
                return;
            }
        } else if (content) {
            try {
                codeTemplate = paginate(epp, pno, await getCodeTemplateByContent(content));  // if entries per page or page number are null, their defaults are 20 and 1, respectively
                if (!codeTemplate)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
                return res.status(200).json({ codeTemplate: codeTemplate[0], pageNum: codeTemplate[1], numEntries: codeTemplate[2] });        
            } catch (e) {
                res.status(401).json({ error: "Invalid content." });
                return;
            }
        } else if (tag) {
            try {
                codeTemplate = paginate(epp, pno, await getCodeTemplateByTag(tag));  // if entries per page or page number are null, their defaults are 20 and 1, respectively
                if (!codeTemplate)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
                return res.status(200).json({ codeTemplate: codeTemplate[0], pageNum: codeTemplate[1], numEntries: codeTemplate[2] });        
            } catch (e) {
                res.status(401).json({ error: "Invalid tag." });
                return;
            }
        } else {
            // If no fields are specified, fetch every code template
            codeTemplate = paginate(epp, pno, await getCodeTemplateByTitle(""));  // if entries per page or page number are null, their defaults are 20 and 1, respectively
            if (!codeTemplate)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
            return res.status(200).json({ codeTemplate: codeTemplate[0], pageNum: codeTemplate[1], numEntries: codeTemplate[2] });
            return;
        }

    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}