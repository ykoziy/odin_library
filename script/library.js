let myLibrary = [];

function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Book.prototype.getIsRead = function() {
    return this.isRead;
}

Book.prototype.setIsRead = function(readStatus) {
    this.isRead = readStatus;
}

Book.prototype.info = function() {
    const read = "already read";
    const unread = "not read yet"
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? read : unread}`;
}

function addBookToLibrary() {
  // do stuff here
}