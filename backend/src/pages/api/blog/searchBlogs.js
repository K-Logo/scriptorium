// To search for blog post by a query
const jwt = require('jsonwebtoken')
import { searchBlogPostByCodeTemplateId, searchBlogPostByDescription, searchBlogPostByTag, searchBlogPostByTitle } from "@/service/blogsDb";
import { getTokenFromReq } from "@/service/jwt";
import { paginate } from "@/service/paginate";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const token = getTokenFromReq(req);
        const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);

        const { searchContent, searchBy } = req.body;
        const epp = new URL("https://localhost:3000" + req.url).searchParams.get("epp");
        const pno = new URL("https://localhost:3000" + req.url).searchParams.get("pno");

        if (!searchContent) {
            return res.status(422).json({ error: "Invalid input. Please search something up." });
        }

        let blogs = [];

        // From one general search bar, return all of the blogs that contain some similarities with the search content
        if (searchBy === "title") {
            blogs = blogs.concat(await searchBlogPostByTitle(searchContent, decodedJWT.id));
        } else if (searchBy === "description") {
            blogs = blogs.concat(await searchBlogPostByDescription(searchContent, decodedJWT.id));
        } else if (searchBy === "code") {
            blogs = blogs.concat(await searchBlogPostByCodeTemplateId(searchContent, decodedJWT.id));
        } else if (searchBy === "tag") {
            blogs = blogs.concat(await searchBlogPostByTag(searchContent, decodedJWT.id));
        } else {
            return res.status(422).json({ error: "Invalid searchBy field." });
        }
        
        blogs = paginate(epp, pno, blogs);  // if entries per page or page number are null, their defaults are 20 and 1, respectively
        if (!blogs)    return res.status(400).json({ error: "Page size must be between 1 and 30, and page numbers must be at least 1." });
        return res.status(200).json({ blogs: blogs[0], pageNum: blogs[1], numEntries: blogs[2] });
    } else {
        return res.status(405).json({ error: "Method not allowed." })
    }

}