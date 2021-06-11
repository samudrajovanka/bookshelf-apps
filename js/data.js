const STORAGE_KEY = 'BOOKSHELF_APPS';

let books = [];

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    console.log('Browser kamu tidak mendukung local storage');
    return false;
  }

  return true;
};

const saveData = () => {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  const data = JSON.parse(serializedData);

  if (data !== null)
    books = data;

  document.dispatchEvent(new Event("ondataloaded"));
}

const updateDataToStorage = () => {
  if(isStorageExist())
    saveData();
}

const composeBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

function findBook(bookId) {
  for(book of books){
    if(book.id == bookId)
      return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0
  for (book of books) {
    if(book.id === bookId)
      return index;

    index++;
  }

  return -1;
}

const refreshDataFromBooks = () => {
  const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

  for (book of books) {
    const newBook = makeBook(book.id, book.title, book.author, book.year, book.isComplete);
    newBook[BOOK_ITEMID] = book.id;

    if (book.isComplete) {
      completedBookList.append(newBook);
    } else {
      uncompletedBookList.append(newBook);
    }
  }
};