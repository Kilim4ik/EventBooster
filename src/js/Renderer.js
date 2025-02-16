'use strict';
import { fetchEvents } from './fetch-events-data-with-key.js';
import { getPaginationButtons } from './pagination.js';

export class Renderer {
  constructor() {
    this.eventsLoged = [];
    this.currentPage = 1;
    this.paginationContainer = document.querySelector('.pagination-container');
    this.eventsContainer = document.querySelector('.events-container');
    this.backdrop = document.querySelector('.backdrop');
    this.boundCloseModalWindow = this.closeModalWindow.bind(this);
  }
  renderNewPage(page = 1) {
    this.currentPage = !isNaN(page) ? page : 1;
    fetchEvents({ page: this.currentPage - 1 })
      .then(obj => {
        this.eventsLoged = obj.events;
        this.renderPagination(obj.totalEvents);
        this.renderEvents(obj);
      })
      .catch(err => {
        this.deletePagination();
        this.deleteEvents();
        this.eventsContainer.innerHTML =
          ' <p style="display: grid;grid-column-start: 1;grid-column-end: 20;">An error occurred, the event was not found</p>';
      });
  }
  renderEvents(obj) {
    this.eventsContainer.innerHTML = obj.events
      .map(elem => {
        const venueName =
          elem._embedded?.venues?.[0]?.name || 'The location is not specified';

        return `
        <div class="event-card" id='${elem.id}'>
          <img src="${elem.images[4].url}" alt="${elem.name} poster" class="event-card__image" >
          <h3 class="event-card__title">${elem.name}</h3>
          <p class="event-card__date">${elem.dates.start.localDate}</p>
          <p class="event-card__location">${venueName}</p>
        </div>`;
      })
      .join('');
  }
  renderPagination(totalElements) {
    this.paginationContainer.innerHTML = '';

    const pages = getPaginationButtons(
      this.currentPage,
      Math.ceil(totalElements / 20)
    );

    pages.forEach(page => {
      const button = document.createElement('span');
      button.textContent = page;
      button.className = page === this.currentPage ? 'active' : '';
      if (page !== '...') {
        button.onclick = () => this.renderNewPage(page);
      }
      this.paginationContainer.appendChild(button);
    });
  }
  renderModalWindow(elem) {
    this.backdrop.innerHTML = `
    <div class="event-modal-window">
    <button class="event-modal-window__close-button">x</button>
    <img class='event-modal-window__avatar' src="${elem.images[4].url}" alt="${
      elem.name
    }" />
    <div class="event-modal-window__content">
      <img class='event-modal-window__poster' src="${
        elem.images[4].url
      }" alt="${elem.name}" />
      <div class="event-modal-window__info">
        <h2 class="event-modal-window__title">INFO</h2>
        <p class="event-modal-window__text">${
          elem.description || 'The information has not been provided'
        }</p>
        <h2 class="event-modal-window__title">WHEN</h2>
        <p class="event-modal-window__text">${elem.dates.start.localDate} </p>
        <p class="event-modal-window__text">${elem.dates.start.localTime.slice(
          0,
          5
        )} (${elem.dates.timezone})</p>
        <h2 class="event-modal-window__title">WHERE</h2>
        <p class="event-modal-window__text">${elem.dates.timezone} </p>
        <p class="event-modal-window__text">${
          elem._embedded?.venues?.[0]?.name ||
          elem.place?.address?.line1 ||
          'Unknown location'
        } </p>
        <h2 class="event-modal-window__title">WHO</h2>
        <p class="event-modal-window__text">${elem}</p>
        <h2 class="event-modal-window__title">PRICES</h2>

        ${
          elem.priceRanges
            ? elem.priceRanges
                .map(range => {
                  return range.min === range.max
                    ? `<p class="event-modal-window__text"> ${
                        range.type ? range.type : ''
                      } ${range.min ? range.min : ''} ${range.currency}</p>
                         <a href="${
                           elem.url
                         }" target="_blank" class="event-modal-window__button-for-buy-tickets">Buy Tickets</a>`
                    : `<p class="event-modal-window__text"> ${range.type} ${range.min} ${range.currency} - ${range.max} ${range.currency}</p>
                         <a href="${elem.url}" target="_blank" class="event-modal-window__button-for-buy-tickets">Buy Tickets</a>`;
                })
                .join('')
            : `<a href="${elem.url}" target="_blank" class="event-modal-window__button-for-buy-tickets">Buy Tickets</a>`
        }
      </div>
    </div>
  </div>
    `;

    document
      .querySelector('.event-modal-window__close-button')
      .addEventListener('click', this.boundCloseModalWindow);
    document
      .querySelector('.event-modal-window')
      .addEventListener('click', e => e.stopPropagation());

    this.backdrop.addEventListener('click', this.boundCloseModalWindow);
  }
  deleteModalWindow() {
    this.backdrop.innerHTML = '';
  }
  deleteEvents() {
    this.eventsContainer.innerHTML = '';
  }
  deletePagination() {
    this.paginationContainer.innerHTML = '';
  }
  closeModalWindow() {
    const closeButton = document.querySelector(
      '.event-modal-window__close-button'
    );

    this.deleteModalWindow();
    this.switchBackdrop();
    closeButton.removeEventListener('click', this.boundCloseModalWindow);
    this.backdrop.removeEventListener('click', this.boundCloseModalWindow);
  }

  switchBackdrop() {
    this.backdrop.classList.toggle('is-hidden');
  }
}
