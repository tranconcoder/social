var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var domain = "localhost:3000";
var http = "http";

function getFileType(originalFileName) {
  return "." + originalFileName.split(".").pop();
}

function getValueInputRadio(elements) {
  for (let element of elements) {
    if (element.checked) {
      return element.value;
    }
  }
}

function getEverage(arr = [0]) {
  total = 0;

  for (let element of arr) {
    total += element;
  }

  return total / arr.length;
}

function hasSymbol(string) {
  for (let i = 0; i < string.length; ++i) {
    let ASCII = string.charCodeAt(i);

    if (
      !(ASCII >= 48 && ASCII <= 57) &&
      !(ASCII >= 65 && ASCII < 90) &&
      !(ASCII >= 97 && ASCII < 122)
    ) {
      return true;
    }
  }
  return false;
}

function hasLowerCase(string) {
  for (let i = 0; i < string.length; ++i) {
    let ASCII = string.charCodeAt(i);

    if (ASCII > 96 && ASCII < 123) {
      return true;
    }
  }
  return false;
}

function hasUpperCase(string) {
  for (let i = 0; i < string.length; ++i) {
    let ASCII = string.charCodeAt(i);

    if (ASCII > 64 && ASCII < 91) {
      return true;
    }
  }
  return false;
}

function hasNumber(string) {
  for (let i in string) {
    if (string.charCodeAt(i) <= 30 && string.charCodeAt(i) <= 39) {
      return true;
    }
  }
  return false;
}

function convertByteToMegaByte(byte) {
  return (byte / 1024 ** 2).toFixed(1);
}

// Toast message
async function createToastMessage(name, style, title, content, timeout) {
  const container = $(".toast-message-container");
  let promise = await new Promise((resolve) => {
    container.innerHTML += `
    <li class="toast-message toast-message-${name} ${style} show">
      <i class="toast-message__icon"></i>
      <span class="toast-message__content-container">
        <h2 class="toast-message__content-container__title">${title}</h2>
        <p class="toast-message__content-container__content">${content}</p>
      </span>
      <i class="toast-message__icon-cancel"></i>
      <div class="toast-message__timing"></div>
    </li>
    `;
    resolve();
  })
    .then(() => {
      return new Promise((resolve) => {
        const timing = $(`.toast-message-${name} .toast-message__timing`);
        timing.style.animation = `timing linear ${timeout}ms`;
        resolve();
      });
    })

    .then(() => {
      return new Promise((resolve) => {
        const message = $(`.toast-message-${name}`);

        setTimeout(() => {
          message.classList.remove("show");
          message.classList.add("hide");
          setTimeout(() => {
            message.remove();
          }, 500);
        }, timeout);

        resolve();
      });
    })

    //cancel button
    .then(() => {
      return new Promise((resolve) => {
        const message = $(`.toast-message-${name}`);

        $(
          `.toast-message-${name} .toast-message__icon-cancel`
        ).addEventListener("click", (e) => {
          message.classList.remove("show");
          message.classList.add("hide");
          setTimeout(() => {
            message.remove();
          }, 500);
        });
      });
    });
}

function showConfirm(objectOption, resolve, reject) {
  const confirm = $(".confirm");

  // Show confirm form
  confirm.style.display = "flex";

  // Set icon
  const iconElement = $(".confirm__form__footer__icon");
  iconElement.src = objectOption.iconURL;

  // Set header Title
  const headerTitleElement = $(".confirm__form__header__title");
  headerTitleElement.innerHTML = objectOption.headerTitle;

  // Set footer Title
  const footerTitleElement = $(".confirm__form__footer__right__title");
  footerTitleElement.innerHTML = objectOption.footerTitle;

  // Set footer Content
  const footerContentElement = $(".confirm__form__footer__right__content");
  footerContentElement.innerHTML = objectOption.footerContent;

  // Set message Cancel button
  const cancelButtonElement = $(
    ".confirm__form__footer__right__button-container__cancel"
  );
  cancelButtonElement.innerHTML = objectOption.cancelButtonContent;

  // Set message Confirm button
  const confirmButtonElement = $(
    ".confirm__form__footer__right__button-container__confirm"
  );
  confirmButtonElement.innerHTML = objectOption.confirmButtonContent;

  // BUTTON CLICK [Cancel]
  cancelButtonElement.addEventListener("click", (e) => {
    confirm.style.display = "none";
    if (reject) reject();
  });

  // BUTTON CLICK [Confirm]
  confirmButtonElement.addEventListener("click", (e) => {
    confirm.style.display = "none";
    if (resolve) resolve();
  });
}
