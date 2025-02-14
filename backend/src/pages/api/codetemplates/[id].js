import { searchBlogPostByCodeTemplateId } from "@/service/blogsDb";
import { addTagById,deleteTagById, deleteCodeTemplateById, getCodeTemplateById, updateContentById, updateExplanationById, updateTitleById } from "@/service/codeTemplateDb";
import { verifyAndDecodeJWT } from '@/service/jwt';
import { updateLanguageById } from "../../../service/codeTemplateDb";

export default async function handler(req, res) {
    let { id } = req.query;
    id = Number.parseInt(id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    let codeTemplate = await getCodeTemplateById(id);
    if (!codeTemplate) {
        return res.status(404).json({ error: "Code template not found" });
    }
    if (req.method == "GET") {
        return res.status(200).json(codeTemplate);
        
    } else 
    if (req.method == "PUT") {
        const decodedJWT = verifyAndDecodeJWT(req, codeTemplate.userId);
        if (!decodedJWT) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { newTitle, newExplanation, newContent, oldTag, newTag, deleteTag, newLanguage } = req.body;
        if (newTitle)           await updateTitleById(id, newTitle);
        if (newExplanation)     await updateExplanationById(id, newExplanation);
        if (newContent)         await updateContentById(id, newContent);
        if (newLanguage)        await updateLanguageById(id, newLanguage);
        if (oldTag && newTag) {  // UPDATE a tag
            await deleteTagById(id, oldTag);  // oldTag must match exactly
            await addTagById(id, newTag);
        }
        if (newTag)             await addTagById(id, newTag);
        if (deleteTag)          await deleteTagById(id, deleteTag);
        
        codeTemplate = await getCodeTemplateById(id);
        if (!codeTemplate) {
            return res.status(404).json({ error: "Code template not found" });
        }
        return res.status(200).json(codeTemplate);
    } else if (req.method == "DELETE") {
        const decodedJWT = verifyAndDecodeJWT(req, codeTemplate.userId);
        if (!decodedJWT) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            await deleteCodeTemplateById(id);
        } catch (e) {
            return res.status(404).json({ error: "Code template not found" });
        }
        res.status(200).json({ message: "Code template deleted." });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}