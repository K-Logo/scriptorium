// To search for blog post by a query

import { searchBlogPostByCode, searchBlogPostByDescription, searchBlogPostByTag, searchBlogPostByTitle } from "@/service/blogsDb";

export default function handler(req, res) {
    const { searchContent } = req.body;

    if (!searchContent) {
        return res.status(422).json({ error: "Invalid input. Please search something up." });
    }

    let blogs = [];

    // From one general search bar, return all of the blogs that contain some similarities with the search content
    blogs = blogs.concat(searchBlogPostByTitle(searchContent));
    blogs = blogs.concat(searchBlogPostByDescription(searchContent));
    blogs = blogs.concat(searchBlogPostByCode(searchContent));
    blogs = blogs.concat(searchBlogPostByTag(searchContent));

    return res.status(201).json({ blogs });
}