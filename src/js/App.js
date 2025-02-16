'use strict';

import { Renderer } from './Renderer.js';
import { getCountryCode } from './chooseCountrie.js';

export class App {
  constructor() {
    this.renderer = new Renderer();
    this.searchCountrySelector = document.querySelector('#country-input');
    this.searchEventButton = document.getElementById('buttonEventCountries');
    this.eventsContainer = document.querySelector('.events-container');
  }
  start() {
    this.renderer.renderNewPage(1);
    this.initEventListeners();
  }
  initEventListeners() {
    this.searchCountrySelector.addEventListener('input', () => {
      if (!getCountryCode()) return;
      this.renderer.renderNewPage();
    });
    this.searchEventButton.addEventListener('click', () => {
      this.renderer.renderNewPage();
    });
    this.eventsContainer.addEventListener('click', e => {
      let eventCard = e.target.closest('.event-card');
      if (!eventCard) return;
      this.renderer.switchBackdrop();
      this.renderer.renderModalWindow(
        this.renderer.eventsLoged.filter(event => event.id === eventCard.id)[0]
      );
    });
  }
}
