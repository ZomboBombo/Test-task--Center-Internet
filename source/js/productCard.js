'use strict';

/*
===============================================
--- МОДУЛЬ ДЛЯ УПРАВЛЕНИЯ КАРТОЧКАМИ ТОВАРА ---
===============================================
*/
window.productCard = (function () {
  // ----------- КОНСТАНТЫ ----------
  const SCROLL_DISABLED = 'overflow: hidden';
  const SCROLL_ENABLED = 'overflow: normal';
  const ADDITIONAL_VALUE = 1; // --- Данное константное значение необходимо для отображения "ожидаемого" порядкового номера элемента коллекции Карточек товара


  // --------- DOM-элементы ---------
  const body = document.querySelector('body');

  const productCards = body.querySelectorAll('.cards-list__item');

  const modals = body.querySelectorAll('.modal');
  const modalWindow = body.querySelector('.modal--window');
  const modalCardNumber = modalWindow.querySelector('.modal__card-number');
  const modalCardImage = modalWindow.querySelector('.modal__card-image');
  const modalCloseButton = modalWindow.querySelector('#modal-close-button');


  /*
  -----------------------------------------------------------------------
  =========================== ОСНОВНАЯ ЛОГИКА ===========================
  -----------------------------------------------------------------------
  */
  // *** Функция для обработчика события клика по карточке товара ***
  function onProductCardClick (evt, currentCard, iterationNumber) {
    evt.preventDefault();

    const currentCardImage = currentCard.querySelector('.picture-card__image');

    for (let modal of modals) {
      modal.classList.add('modal--open');
      modalCloseButton.focus(); // --- Автоматическая фокусировка на кнопке Закрытия при открытии модального окна (для удобства взаимодействия с сайтом посредством клавиатуры)
    }

    body.style = SCROLL_DISABLED; // --- ОТКЛЮЧЕНИЕ прокрутки страницы, пока открыто модальное окно

    modalCardNumber.textContent = iterationNumber + ADDITIONAL_VALUE;
    modalCardImage.src = currentCardImage.src;
  };


  // *** ДОБАВЛЕНИЕ обработчиков события клика по Карточке товара ***
  productCards.forEach((card, iterator) => {
    card.addEventListener('click', function (cardEvt) {
      onProductCardClick(cardEvt, card, iterator);
    });
  });


  // *** Обработчик события ЗАКРЫТИЯ модальных окон ***
  modalCloseButton.onclick = function (closeEvt) {
    closeEvt.preventDefault();

    for (let modal of modals) {
      modal.classList.remove('modal--open');
    }

    body.style = SCROLL_ENABLED; // --- ВКЛЮЧЕНИЕ прокрутки страницы
  };

})();