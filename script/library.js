let myLibrary = [];

function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Book.prototype.toggleIsRead = function() {
    this.isRead = !this.isRead;
}

Book.prototype.info = function() {
    const read = "already read";
    const unread = "not read yet"
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? read : unread}`;
}

function addBooksToLibrary() {
  // for now hard coded books....
  myLibrary.push(new Book("Tales from the Loop", "Simon Stålenhag", 128, true));
  myLibrary.push(new Book("Things From the Flood", "Simon Stålenhag", 132, false));
}
function submitBook(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const isRead = document.getElementById("read").checked;
    addBookToLibrary(title, author, pages, isRead);
    hideModal();
}

function addBookToLibrary(title, author, pages, isRead) {
    let book = new Book(title, author, pages, isRead);
    myLibrary.push(book);
    addBookCard(book, myLibrary.length - 1);
}

function removeBook(index) {
    myLibrary.splice(index, 1);
    removeBookCard(index);
}

function displayBooks() {
    myLibrary.forEach((book, index) => {
        addBookCard(book, index);
    });
}

function addBookCard(book, index) {
    const library = document.querySelector('.library');

    let card = createElementWithClass("div", "card");
    card.setAttribute('data-index', index);

    let contents = createElementWithClass("div", "card-content");

    let title = createElementWithClass("h3", "book-title");
    title.textContent = book.title;

    let author = createElementWithClass("p", "book-author");
    author.textContent = `Author: ${book.author}`;

    let pages = createElementWithClass("p", "book-pages");
    pages.textContent = `Number of pages: ${book.pages}`;

    contents.appendChild(title);
    contents.appendChild(author);
    contents.appendChild(pages);

    let footer = createElementWithClass("div", "card-footer");

    let toggle = createElementWithClass("input", "toggle");
    toggle.setAttribute("type", "checkbox");
    toggle.checked = book.isRead;
    toggle.addEventListener('change', handleToggleSwitch);

    card.appendChild(contents);
    card.appendChild(footer);
    footer.appendChild(toggle);
    library.appendChild(card);
}

function removeBookCard(index) {
    const bookCard = document.querySelector(`[data-index="${index}"]`);
    bookCard.remove();
}

function createElementWithClass(tag, ...classNames) {
    let element = document.createElement(tag);
    classNames.forEach(className => element.classList.add(className));
    return element;
}

function handleToggleSwitch(event) {
    const bookIndex = Number(event.target.parentNode.parentNode.dataset.index);
    myLibrary[bookIndex].toggleIsRead();
}

function handleNewBookButton(event) {
    const modal = document.querySelector(".modal");
    modal.classList.remove("hide");
    modal.classList.add("show");
}

function handleClickOutsideModal(event) {
    const modalContent = document.querySelector(".modal-content");
    let target = event.target;
    do {
        if (target == modalContent) {
            return;
        }
        target = target.parentNode;
    } while (target);
    hideModal();
}

function hideModal() {
    const modal = document.querySelector(".modal");
    const form = document.querySelector(".add-book");
    modal.classList.remove("show");
    modal.classList.add("hide");
    form.reset();    
}

document.querySelector(".new-book-btn").addEventListener("click", handleNewBookButton);
document.querySelector(".modal").addEventListener("mousedown", handleClickOutsideModal);
document.querySelector(".add-book").addEventListener("submit", submitBook);

addBooksToLibrary();
displayBooks();
