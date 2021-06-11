document.addEventListener('DOMContentLoaded', () => {
  const formInput = document.querySelector('#inputBook');
  const inputElms = document.querySelectorAll('.input_section__input > input');
  const formSearch = document.querySelector('#searchBook');

  inputElms.forEach(elm => {
    elm.addEventListener('focus', () => {
      elm.parentElement.classList.add('input_section__input--primary');
    });

    elm.addEventListener('blur', () => {
      elm.parentElement.classList.remove('input_section__input--primary');
    });
    
  })

  formInput.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
    formInput.reset();
  });

  formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    searchBook();
  })
  
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil disimpan.");
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
});