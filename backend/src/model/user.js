export default class User {
  // declare private fields
  #db_id;
  #username;
  #passwordHash;
  #firstName;
  #lastName;
  #email;
  #phoneNumber;
  #avatarPath;
  #role;

  constructor(db_id, username, passwordHash, firstName, lastName, email, phoneNumber, avatarPath, role) {
    if (db_id) {
      this.#db_id = db_id;
    }
    this.#username = username;
    this.#passwordHash = passwordHash;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#email = email;
    this.#phoneNumber = phoneNumber;
    this.#avatarPath = avatarPath;
    if (role) {
      this.#role = role;
    }
  }

  get db_id() {
    return this.#db_id;
  }

  set db_id(db_id) {
    this.#db_id = db_id;
  }

  get username() {
    return this.#username;
  }

  set username(username) {
    this.#username = username;
  }

  get passwordHash() {
    return this.#passwordHash;
  }

  set passwordHash(passwordHash) {
    this.#passwordHash = passwordHash;
  }

  get firstName() {
    return this.#firstName;
  }

  set firstName(firstName) {
    this.#firstName = firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  set lastName(lastName) {
    this.#lastName = lastName;
  }

  get email() {
    return this.#email;
  }

  set email(email) {
    this.#email = email;
  }

  get phoneNumber() {
    return this.#phoneNumber;
  }

  set phoneNumber(phoneNumber) {
    this.#phoneNumber = phoneNumber;
  }

  get avatarPath() {
    return this.#avatarPath;
  }

  set avatarPath(avatarPath) {
    this.#avatarPath = avatarPath;
  }

  get role() {
    return this.#role;
  }

  set role(role) {
    this.#role = role;
  }

  log() {
    console.log(this.#username, this.#passwordHash, this.#firstName, this.#lastName, this.#email, this.#phoneNumber);
  }
}
