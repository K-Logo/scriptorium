import { addTagById, getCodeTemplateById, updateContentById, updateExplanationById, updateTitleById } from "@/service/codeTemplateDb";

export default async function handler(req, res) {
    let { id } = req.query;
    id = Number.parseInt(id);
    if (!id) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (req.method == "GET") {
        const codeTemplate = await getCodeTemplateById(id);
        if (!codeTemplate) {
            return res.status(404).json({ error: "Code template note found" })
        }
        return res.status(200).json(codeTemplate);
        
    } else if (req.method == "PUT") {
        const { newTitle, newExplanation, newContent, newTag } = req.body;
        if (newTitle)   await updateTitleById(id, newTitle);
        if (newExplanation) await updateExplanationById(id, newExplanation);
        if (newContent) await updateContentById(id, newContent);
        if (newTag)     await addTagById(id, newTag);
        
        const codeTemplate = await getCodeTemplateById(id);
        if (!codeTemplate) {
            return res.status(404).json({ error: "Code template note found" })
        }
        return res.status(200).json(codeTemplate);
    } else if (req.method == "DELETE") {

    } else {

    }
}