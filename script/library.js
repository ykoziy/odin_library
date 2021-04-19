let myLibrary = [];

class Book {
    constructor(title, author, pages, isRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }

    toggleIsRead() {
        this.isRead = !this.isRead;       
    }

    info() {
        const read = "already read";
        const unread = "not read yet"
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? read : unread}`;        
    }
}

class LocalStorage {
    static toLocalStorage() {
        localStorage.setItem('books', JSON.stringify(myLibrary));
    }
    
    static fromLocalStorage() {
        let jsonLibrary = JSON.parse(localStorage.getItem('books'));
        if (jsonLibrary == null) {
            myLibrary = [];
        } else {
            myLibrary = jsonLibrary.map(book => {
                return Object.assign(new Book(), book);  
            })
        }
    }
}

class LibraryDisplay {
    constructor() {
        this.newBookBtn = document.querySelector(".new-book-btn");
        this.addBookModal = document.querySelector(".modal");
        this.submitBookBtn = document.querySelector(".add-book");
        this.bookFiltedSel = document.getElementById("filter-by");

        this.newBookBtn.addEventListener("click", this.handleNewBookButton);
        this.addBookModal.addEventListener("mousedown", this.handleClickOutsideModal.bind(this));
        this.submitBookBtn.addEventListener("submit", this.submitBook.bind(this));
        this.bookFiltedSel.addEventListener("change", this.filterBooks);     
    }

    handleNewBookButton(event) {
        const modal = document.querySelector(".modal");
        modal.classList.remove("hide");
        modal.classList.add("show");
    }
    
    handleClickOutsideModal(event) {
        const modalContent = document.querySelector(".modal-content");
        let target = event.target;
        do {
            if (target == modalContent) {
                return;
            }
            target = target.parentNode;
        } while (target);
        this.hideModal();
    }

    hideModal() {
        const modal = document.querySelector(".modal");
        const form = document.querySelector(".add-book");
        modal.classList.remove("show");
        modal.classList.add("hide");
        form.reset();    
    }

    submitBook(event) {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const pages = document.getElementById("pages").value;
        const isRead = document.getElementById("read").checked;
        this.addBookToLibrary(title, author, pages, isRead);
        this.hideModal();
    }    
    
    addBookToLibrary(title, author, pages, isRead) {
        let book = new Book(title, author, pages, isRead);
        myLibrary.push(book);
        LocalStorage.toLocalStorage();
        this.addBookCard(book, myLibrary.length - 1);
    }

    filterBooks() {
        let filter = this.value;
        const books = Array.from(document.querySelectorAll(".card"));
        books.forEach(book => {
            let isRead = book.children[2].children[0].checked;
            if (filter === "read" && !isRead) {
                book.classList.add("filtered");
            } else if (filter === "unread" && isRead) {
                book.classList.add("filtered");
            } else {
                book.classList.remove("filtered");
            }        
        });
    }
    
    displayBooks() {
        myLibrary.forEach((book, index) => {
            this.addBookCard(book, index);
        });
    }

    addBookCard(book, index) {
        const library = document.querySelector('.library');
    
        let card = this.createElementWithClass("div", "card");
        card.setAttribute('data-index', index);
    
        let header = this.createElementWithClass("div", "card-header");
        let remove = this.createElementWithClass("span", "remove-book");
        remove.addEventListener("click", this.handleRemoveBook.bind(this))
        header.appendChild(remove);
    
        let contents = this.createElementWithClass("div", "card-content");
    
        let title = this.createElementWithClass("h3", "book-title");
        title.textContent = book.title;
    
        let author = this.createElementWithClass("p", "book-author");
        author.textContent = `Author: ${book.author}`;
    
        let pages = this.createElementWithClass("p", "book-pages");
        pages.textContent = `Number of pages: ${book.pages}`;
    
        contents.appendChild(title);
        contents.appendChild(author);
        contents.appendChild(pages);
    
        let footer = this.createElementWithClass("div", "card-footer");
    
        let toggle = this.createElementWithClass("input", "toggle");
        toggle.setAttribute("type", "checkbox");
        toggle.checked = book.isRead;
        toggle.addEventListener('change', this.handleToggleSwitch);
    
        card.appendChild(header);
        card.appendChild(contents);
        card.appendChild(footer);
        footer.appendChild(toggle);
        library.appendChild(card);
    }
    
    createElementWithClass(tag, ...classNames) {
        let element = document.createElement(tag);
        classNames.forEach(className => element.classList.add(className));
        return element;
    }

    handleToggleSwitch(event) {
        const bookIndex = Number(event.target.parentNode.parentNode.dataset.index);
        myLibrary[bookIndex].toggleIsRead();
        LocalStorage.toLocalStorage();
    }   
    
    handleRemoveBook(event) {
        const bookIndex = Number(event.target.parentNode.parentNode.dataset.index);
        this.removeBook(bookIndex);
    }

    removeBookCard(index) {
        const bookCard = document.querySelector(`[data-index="${index}"]`);
        bookCard.classList.add("removed");
        bookCard.addEventListener("transitionend", () => {
            bookCard.remove();
        });
    }

    removeBook(index) {
        myLibrary.splice(index, 1);
        LocalStorage.toLocalStorage();
        this.removeBookCard(index);
    }    
}

function addBooksToLibrary() {
    // for now hard coded books....
    myLibrary.push(new Book("Tales from the Loop", "Simon Stålenhag", 128, true));
    myLibrary.push(new Book("Things From the Flood", "Simon Stålenhag", 132, false));
}


const libraryDisplay = new LibraryDisplay();
LocalStorage.fromLocalStorage();
libraryDisplay.displayBooks();
