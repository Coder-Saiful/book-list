// Get the UI element
let form = document.querySelector('#book-form');
let bookList = document.querySelector('#book-list');

// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class
class UI {
    static addToBookList(book) {
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete text-danger">Remove</a></td>`;
        list.appendChild(row);
    }

    static clearFields() {
        form.reset();
    }

    static showAlert(message, className) {
        this.clearAlert();
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.style.fontWeight = 'bold';
        div.style.paddingTop = '8px';
        div.style.paddingBottom = '8px';
        div.appendChild(document.createTextNode(message));
        document.querySelector('.container').insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static deleteFromBook(target) {
        if (target.hasAttribute('href')) {
            target.parentElement.parentElement.remove();
            Store.removeBook(target.parentElement.previousElementSibling.textContent.trim());
            this.showAlert('Book Removed!', 'alert-success')
        }
    }

    static clearAlert() {
        var currentAlert = document.querySelector('.alert');
        if (currentAlert) {
            currentAlert.remove();
        }
    }
}

// Local Storage Class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBooks(book) {
        let books = this.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        let books = this.getBooks();

        books.forEach(book => {
            UI.addToBookList(book);
        });
    }

    static removeBook(isbn) {
        let books = this.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Add Event Listener
form.addEventListener('submit', newBook);
bookList.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// Define Functions

function newBook(e) {
    let title = document.querySelector('#title').value,
    author = document.querySelector('#author').value,
    isbn = document.querySelector('#isbn').value;

    if (title === '' | author === '' | isbn === '') {
        UI.showAlert('Please fill all the fields!', 'alert-danger');
    } else {
        let book = new Book(title, author, isbn);
    
        UI.addToBookList(book);
    
        UI.clearFields();

        UI.showAlert('Book Added!', 'alert-success');

        Store.addBooks(book);
    }

    e.preventDefault();
}

function removeBook(e) {
    UI.deleteFromBook(e.target);
    e.preventDefault();
}