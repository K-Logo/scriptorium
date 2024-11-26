export default class CodeTemplate {
    // declare private fields
    #db_id;
    #title;
    #explanation;
    #content;
    #tags;
    #parentId;
    #userId;
    #language;

    constructor(db_id, title, explanation, content, tags, parentId, userId, language) {
        if (db_id) {
            this.#db_id = db_id;
        }
        this.#title = title;
        this.#explanation = explanation;
        this.#content = content;
        this.#tags = tags;
        if (parentId) {
            this.#parentId = parentId;
        }
        this.#userId = userId;
        this.#language = language;
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

    // Getter and Setter for parentId
    get parentId() {
        return this.#parentId;
    }

    set parentId(parentId) {
        this.#parentId = parentId;
    }

    // Getter and Setter for userId
    get userId() {
        return this.#userId;
    }

    set userId(userId) {
        this.#userId = userId;
    }

    get language() {
        return this.#language;
    }

    set language(language) {
        this.#language = language;
    }

    log() {
        console.log(this.#title, this.#explanation, this.#tags, this.#parentId, this.#userId, this.#language);
    }
}
