const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

const generateId = function () {
  return +new Date();
};

const generateBookObject = function (id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

const isStorageExist = function () {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }

  return true;
};

const saveData = function () {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const loadDataStorage = function () {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let datas = JSON.parse(serializedData);

  if (datas !== null) {
    for (const data of datas) {
      books.push(data);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const makeBook = function (bookObjek) {
  const { id, title, author, year, isCompleted } = bookObjek;
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${author}`;
  const yearBook = document.createElement("p");
  yearBook.innerText = `Tahun: ${year}`;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, yearBook);

  if (isCompleted) {
    const bucket = document.createElement("div");
    const btnUndo = document.createElement("button");
    bucket.classList.add("action");
    btnUndo.innerText = "Belum Selesai dibaca";
    btnUndo.classList.add("green");
    btnUndo.setAttribute("id", `book-${id}`);
    btnUndo.addEventListener("click", () => {
      undoBookFromCompleted(id);
    });

    const btnTrash = document.createElement("button");
    btnTrash.classList.add("red");
    btnTrash.innerText = "Hapus Buku";
    btnTrash.setAttribute("id", `book-${id}`);
    btnTrash.addEventListener("click", () => {
      removeBookFromCompleted(id);
    });

    bucket.append(btnUndo, btnTrash);
    container.append(bucket);
    // console.log(container);
    return container;
  } else {
    const listBucket = document.createElement("div");
    const btnNotFinished = document.createElement("button");
    const btnDelete = document.createElement("button");

    listBucket.classList.add("action");
    btnNotFinished.innerText = "Selesai dibaca";
    btnNotFinished.classList.add("green");
    btnNotFinished.setAttribute("id", `book-${id}`);
    btnNotFinished.addEventListener("click", () => {
      taskBookCompleted(id);
    });

    btnDelete.innerText = "Hapus Buku";
    btnDelete.classList.add("red");
    btnDelete.setAttribute("id", `book-${id}`);
    btnDelete.addEventListener("click", () => {
      removeBookFromCompleted(id);
    });

    listBucket.append(btnNotFinished, btnDelete);
    container.append(listBucket);
    // console.log(container);
  }

  return container;
};

const addBook = function () {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;
  const id = generateId();
  const bookObjek = generateBookObject(id, title, author, year, isCompleted);

  books.push(bookObjek);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
};

const taskBookCompleted = function (bookId) {
  const bookTarget = findBook(bookId);

  bookTarget || "Not Found";
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
};

const findBook = function (bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }

  return null;
};

const findBookIndex = function (id) {
  for (const bookItem of books) {
    if (bookItem.id === id) {
      return bookItem;
    }
  }

  return null;
};

const undoBookFromCompleted = function (bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const removeBookFromCompleted = function (id) {
  const bookId = findBookIndex(id);
  if (bookId === -1) return;

  books.splice(bookId, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
};

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    clearInput();
  });

  if (isStorageExist()) {
    loadDataStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  // console.log(localStorage.getItem(STORAGE_KEY));
  const key = localStorage.getItem(STORAGE_KEY);
  const btnAdd = document.getElementById("bookSubmit");

  btnAdd.addEventListener("click", () => {
    alert("Data berhasil ditambahkan");
  });
});

document.addEventListener(RENDER_EVENT, () => {
  //   console.log(books);
  const inCompletedBook = document.getElementById("incompleteBookshelfList");
  const iscompletedBook = document.getElementById("completeBookshelfList");
  inCompletedBook.innerHTML = "";
  iscompletedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      iscompletedBook.classList.add("book_list");
      iscompletedBook.append(bookElement);
    } else {
      inCompletedBook.classList.add("book_list");
      inCompletedBook.append(bookElement);
    }
  }
});

const clearInput = function () {
  const title = document.getElementById("inputBookTitle");
  const author = document.getElementById("inputBookAuthor");
  const year = document.getElementById("inputBookYear");
  const bookIsComplete = document.getElementById("inputBookIsComplete");

  title.value = "";
  author.value = "";
  year.value = "";
  bookIsComplete.checked = "";
};

const searchBook = function (e) {
  e.preventDefault();
  const inputSearch = document.getElementById("searchBookTitle").value.toLowerCase();
  const listBook = document.querySelectorAll(".book_item > h3");

  for (const book of listBook) {
    if (inputSearch === book.innerText.toLowerCase()) {
      book.parentElement.style.display = "block";
    } else {
      book.parentElement.style.display = "none";
    }
    // console.log(book);
  }
};

const searchSubmit = document.getElementById("searchSubmit");
searchSubmit.addEventListener("click", searchBook);
