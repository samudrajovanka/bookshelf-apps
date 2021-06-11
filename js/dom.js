const UNCOMPLETED_LIST_BOOK_ID = 'uncompleteBookshelfListItem';
const COMPLETED_LIST_BOOK_ID = 'completeBookshelfListItem';
const BOOK_ITEMID = 'bookId';

const addBook = () => {
  const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

  const title = document.querySelector('#inputBookTitle').value;
  const author = document.querySelector('#inputBookAuthor').value;
  const year = document.querySelector('#inputBookYear').value;
  const isComplete = document.querySelector('#inputBookIsComplete').checked;
  const id = +new Date();

  const book = makeBook(id, title, author, year, isComplete);

  const bookObject = composeBookObject(id, title, author, year, isComplete);
  
  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  if (isComplete) {
    completedBookList.append(book);
    alert('Book successfull added to complete reading');
  } else {
    uncompletedBookList.append(book);
    alert('Book successfull added to uncomplete reading');
  }

  updateDataToStorage();
};

const makeBook = (id, title, author, year, isComplete) => {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;
  bookTitle.classList.add('book_shelf__book_title');
  bookTitle.setAttribute('id', 'book_title');

  const bookId = document.createElement('p');
  bookId.innerText = id;
  bookId.classList.add('text-mute');
  bookId.setAttribute('id', 'book_id');

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Author: ';
  bookAuthor.setAttribute('id', 'book_author');

  const bookAuthorValue = document.createElement('span');
  bookAuthorValue.innerText = author;
  bookAuthor.append(bookAuthorValue)

  const bookYear = document.createElement('p');
  bookYear.innerText = 'Year: ';
  bookYear.setAttribute('id', 'book_year');

  const bookYearValue = document.createElement('span');
  bookYearValue.innerText = year;
  bookYear.append(bookYearValue)

  let actionButton = '';
  if (isComplete) {
    actionButton = createButtonUncomplete();
  } else {
    actionButton = createButtonComplete();
  }

  const actionContainer = document.createElement('div');
  actionContainer.append(
    actionButton,
    createButtonEdit(),
    createButtonDelete(),
  );
  actionContainer.classList.add('book_shelf__action')

  const container = document.createElement('article');
  container.append(
    bookTitle,
    bookId,
    bookAuthor,
    bookYear,
    actionContainer
  );
  container.classList.add('book_shelf__book_item');

  return container;
};

const makeButton = (btnClass, title, eventListener) => {
  const button = document.createElement('button');
  button.innerText = title;
  button.classList.add(...btnClass);

  button.addEventListener('click', (e) => {
    eventListener(e);
  });

  return button;
};

const addBookToCompleted = (bookElement) => {
  const element = bookElement.parentElement;
  const book = findBook(element[BOOK_ITEMID]);
  const bookTitle = book.title;
  const bookId = book.id;
  const bookAuthor = book.author;
  const bookYear = book.year;

  const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

  const newBook = makeBook(bookId, bookTitle, bookAuthor, bookYear, true);

  book.isComplete = true;
  newBook[BOOK_ITEMID] = book.id

  completedBookList.append(newBook);
  element.remove();

  updateDataToStorage();
};

const addBookToUncompleted = (bookElement) => {
  const element = bookElement.parentElement;
  
  const book = findBook(element[BOOK_ITEMID]);
  const bookTitle = book.title;
  const bookId = book.id;
  const bookAuthor = book.author;
  const bookYear = book.year;

  const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

  const newBook = makeBook(bookId, bookTitle, bookAuthor, bookYear, false);
  
  book.isComplete = false;
  newBook[BOOK_ITEMID] = book.id;

  uncompletedBookList.append(newBook);
  element.remove();

  updateDataToStorage();
};

const deleteBook = (bookElement) => {
  const element = bookElement.parentElement;
  
  const bookPosition = findBookIndex(element[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  element.remove();

  updateDataToStorage();
};

const openOverlayEdit = (bookElement) => {
  const element = bookElement.parentElement;

  const overlay = document.querySelector('.overlay');
  const id = document.querySelector('#editBookId');
  const title = document.querySelector('#inputEditBookTitle');
  const author = document.querySelector('#inputEditBookAuthor');
  const year = document.querySelector('#inputEditBookYear');
  const isComplete = document.querySelector('#inputEditBookIsComplete');

  const book = findBook(element[BOOK_ITEMID]);
  id.innerText = book.id;
  title.value = book.title;
  author.value = book.author;
  year.value = book.year;
  isComplete.checked = book.isComplete;

  overlay.classList.remove('overlay--hidden');

  const formEdit = document.querySelector('#editBook');
  formEdit.addEventListener('submit', (e) => {
    e.preventDefault();
    editBook(bookElement)
  });

  const btnCancelEdit = document.querySelector('#btnCancelUpdate');
  btnCancelEdit.addEventListener('click', () => {
    closeOverlayEdit();
  });
};

const closeOverlayEdit = () => {
  const overlay = document.querySelector('.overlay');
  overlay.classList.add('overlay--hidden');
};

const editBook = (bookElement) => {
  const element = bookElement.parentElement;
  
  const title = document.querySelector('#inputEditBookTitle').value;
  const author = document.querySelector('#inputEditBookAuthor').value;
  const year = document.querySelector('#inputEditBookYear').value;
  const isComplete = document.querySelector('#inputEditBookIsComplete').checked;

  const book = findBook(element[BOOK_ITEMID]);
  
  if (isComplete !== book.isComplete) {
    if (isComplete === true) {
      addBookToCompleted(bookElement)
    } else {
      addBookToUncompleted(bookElement)
    }
  } else {
    book.title = title;
    book.author = author;
    book.year = year;

    element.querySelector('#book_title').innerText = book.title;
    element.querySelector('#book_author > span').innerText = book.author;
    element.querySelector('#book_year > span').innerText = book.year;
    updateDataToStorage();

  }
  closeOverlayEdit()
};

const createButtonComplete = () => {
  return makeButton(['button', 'button--primary'], 'Complete Reading', (e) => {
    addBookToCompleted(e.target.parentElement);
  });
}

const createButtonUncomplete = () => {
  return makeButton(['button', 'button--primary'], 'Uncomplete Reading', (e) => {
    addBookToUncompleted(e.target.parentElement);
  });
};

const createButtonDelete = () => {
  return makeButton(['button', 'button--danger'], 'Delete', (e) => {
    const confirmDelete = confirm('Are you sure to delete this book');
    
    if (confirmDelete) {
      deleteBook(e.target.parentElement);
    }
  });
};

const createButtonEdit = () => {
  return makeButton(['button', 'button--warning'], 'Edit', (e) => {
    openOverlayEdit(e.target.parentElement);
  });
};

const searchBook = () => {
  const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

  const booksFind = []
  const textSearch = document.querySelector('#inputTextSearch').value;
  const patt = new RegExp(textSearch, 'i');

  uncompletedBookList.innerHTML = '';
  completedBookList.innerHTML = ''

  if (textSearch === '') {
    for (book of books) {
      const newBook = makeBook(book.id, book.title, book.author, book.year, book.isComplete);
      newBook[BOOK_ITEMID] = book.id;
  
      if (book.isComplete) {
        completedBookList.append(newBook);
      } else {
        uncompletedBookList.append(newBook);
      }
    }
  } else {
    books.forEach(book => {
      if (patt.test(book.title)) [
        booksFind.push(book)
      ]
    });
  
    for (book of booksFind) {
      const newBook = makeBook(book.id, book.title, book.author, book.year, book.isComplete);
      newBook[BOOK_ITEMID] = book.id;
  
      if (book.isComplete) {
        completedBookList.append(newBook);
      } else {
        uncompletedBookList.append(newBook);
      }
    }
  }
}