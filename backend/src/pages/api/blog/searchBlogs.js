// To search for blog post by a query

import { searchBlogPostByCode, searchBlogPostByDescription, searchBlogPostByTag, searchBlogPostByTitle } from "@/service/blogsDb";
import { getTokenFromReq } from "@/service/jwt";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const token = getTokenFromReq(req);
        const decodedJWT = jwt.verify(token, process.env.SECRET_KEY);

        const { searchContent, searchBy } = req.body;

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
            blogs = blogs.concat(await searchBlogPostByCode(searchContent, decodedJWT.id));
        } else if (searchBy === "tag") {
            blogs = blogs.concat(await searchBlogPostByTag(searchContent, decodedJWT.id));
        } else {
            return res.status(422).json({ error: "Invalid searchBy field." });
        }

        return res.status(201).json({ blogs });
    } else {
        return res.status(405).json({ error: "Method not allowed." })
    }

}