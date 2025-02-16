'use strict';
const suggestions = document.querySelector('#suggestions');
export const countryInput = document.querySelector('#country-input');
let countries = {};
fetch('../json/countryCodes.json')
  .then(res => res.json())
  .then(data => {
    countries = data;
    suggestions.innerHTML = Object.entries(data)
      .map(([country, code]) => `<option value=${code}>${country}</option>`)
      .join('');
  });

export const getCountryCode = () => {
  const countryCode = Object.keys(countries).find(
    code => countries[code] === countryInput.value
  );
  return countryCode;
};
