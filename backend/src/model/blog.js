export default class Blog {
    // Declare fields
    title;
    description;
    tag;
    link_to_code;
    user; // username that posted the blog
    rating; // upvotes

    constructor(title, description, tag, link_to_code, user) {
        this.title = title;
        this.description = description;
        if (tag) {
            this.tag = tag;
        }
        if (link_to_code){
            this.link_to_code = link_to_code;
        }
        this.user = user;
        this.rating = 0;
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

    get link_to_code() {
        return this.link_to_code;
    }

    set link_to_code(new_link) {
        this.link_to_code = new_link;
    }

    get user() {
        return this.user;
    }

    get rating() {
        return this.rating;
    }
}