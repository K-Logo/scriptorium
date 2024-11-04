export default class Blog {
    // Declare fields
    #blog_id;
    #title;
    #description;
    #tag;
    #code_template;
    // #author; // username that posted the blog
    #author_id;
    #rating; // upvotes
    #reports;
    #comments;

    constructor(blog_id, title, description, tag, code_template, authorId) {
        if (blog_id) {
            this.#blog_id = blog_id;
        }
        this.#title = title;
        this.#description = description;
        if (tag) {
            this.#tag = tag;
        }
        if (code_template){
            this.#code_template = code_template;
        }
        this.#author_id = authorId;
        this.#rating = 0;
        this.#reports = 0;
        this.#comments = []; // empty array
    }

    get blog_id() {
        return this.#blog_id;
    }

    get title() {
        return this.#title;
    }

    set title(new_title) {
        this.#title = new_title;
    }

    get description(){
        return this.#description;
    }

    set description(new_desc) {
        this.#description = new_desc;
    }

    get tag(){
        return this.#tag;
    }

    set tag(new_tag) {
        this.#tag = new_tag;
    }

    get code_template() {
        return this.#code_template;
    }

    set code_template(new_template) {
        this.#code_template = new_template;
    }

    get authorId() {
        return this.#author_id;
    }

    set authorId(id) {
        this.#author_id = id;
    }

    get rating() {
        return this.#rating;
    }

    get comments(){
        return this.#comments;
    }

    get reports() {
        return this.#reports;
    }

    set reports(reports) {
        this.#reports = reports;
    }
}