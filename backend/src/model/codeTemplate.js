export default class CodeTemplate {
    // declare private fields
    #db_id;
    #title;
    #explanation;
    #content;
    #tags;
    #parent;
    #parentId;
    #children;

    constructor(db_id, title, explanation, content, tags, parent, parentId, children) {
        if (db_id) {
            this.#db_id = db_id;
        }
        this.#title = title;
        this.#explanation = explanation;
        this.#content = content;
        this.#tags = tags;
        if (parent) {
            this.#parent = parent;
        }
        if (parentId) {
            this.#parentId = parentId;
        }
        this.#children = children;
    }

    // Getter and Setter for db_id
    get db_id() {
        return this.#db_id;
    }

    set db_id(db_id) {
        this.#db_id = db_id;
    }

    // Getter and Setter for title
    get title() {
        return this.#title;
    }

    set title(title) {
        this.#title = title;
    }

    // Getter and Setter for explanation
    get explanation() {
        return this.#explanation;
    }

    set explanation(explanation) {
        this.#explanation = explanation;
    }

    // Getter and Setter for content
    get content() {
        return this.#content;
    }

    set content(content) {
        this.#content = content;
    }

    // Getter and Setter for tags
    get tags() {
        return this.#tags;
    }

    set tags(tags) {
        this.#tags = tags;
    }

    // Getter and Setter for parent
    get parent() {
        return this.#parent;
    }

    set parent(parent) {
        this.#parent = parent;
    }

    // Getter and Setter for parentId
    get parentId() {
        return this.#parentId;
    }

    set parentId(parentId) {
        this.#parentId = parentId;
    }

    // Getter and Setter for children
    get children() {
        return this.#children;
    }

    set children(children) {
        this.#children = children;
    }

    log() {
        console.log(this.#title, this.#explanation, this.#tags, this.#parent, this.#parentId, this.#children);
    }
}
