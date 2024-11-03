export default class Blog {
    // Declare fields
    title;
    description;
    tag;
    code_template;
    user; // username that posted the blog
    rating; // upvotes
    reports;

    constructor(blog_id, title, description, tag, code_template, user) {
        if (blog_id) {
            this.blog_id = blog_id;
        }
        this.title = title;
        this.description = description;
        if (tag) {
            this.tag = tag;
        }
        if (code_template){
            this.code_template = code_template;
        }
        this.user = user;
        this.rating = 0;
        this.reports = 0;
    }

    get blog_id() {
        return this.blog_id;
    }

    get title() {
        return this.title;
    }

    set title(new_title) {
        this.title = new_title;
    }

    get description(){
        return this.description;
    }

    set description(new_desc) {
        this.description = new_desc;
    }

    get tag(){
        return this.tag;
    }

    set tag(new_tag) {
        this.tag = new_tag;
    }

    get code_template() {
        return this.code_template;
    }

    set code_template(new_template) {
        this.code_template = new_template;
    }

    get user() {
        return this.user;
    }

    get rating() {
        return this.rating;
    }
}