'use strict';
import { getCountryCode } from './chooseCountrie.js';
const searchInput = document.getElementById('searchInputCountries');

const getData = () => {
  let data = new Date();
  data = data.toISOString();
  return data;
};

const URL = 'https://app.ticketmaster.com/discovery/v2/events.json?';
export const fetchEvents = ({ page }) => {
  const params = new URLSearchParams(
    Object.entries({
      apikey: 'QcV4xVHAyk410RrmWruoaQyfKz244DeP',
      page,
      keyword: searchInput.value.trim().toLowerCase(),
      locale: getCountryCode(),
    }).filter(([_, value]) => value !== undefined && value !== '')
  );
  const data = getData();
  return fetch(
    `${URL}${params.toString()}&startDateTime=${data.slice(
      0,
      data.length - 5
    )}Z&sort=date,asc`
  )
    .then(res => {
      return res.json();
    })
    .then(data => {
      return {
        totalEvents: data.page.totalElements,
        events: data['_embedded'].events,
      };
    });
};
