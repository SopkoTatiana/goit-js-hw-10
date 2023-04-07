import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const query = event.target.value.trim();
  const hasValue = query.length > 0;

  clearFields();

  if (hasValue) {
    fetchCountries(query)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }

        data.length === 1
          ? renderCountryInfo(...data)
          : renderCountriesList(data);
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function clearFields() {
  refs.info.innerHTML = '';
  refs.list.innerHTML = '';
}

function renderCountryInfo(data) {
  const {
    name: { official },
    capital,
    population,
    flags: { svg },
    languages,
  } = data;

  const markup = `<div class = 'country-info__head'>
    <img src="${svg}" width = '40'/>
    <h1 class = 'country-name'>${official}</h1>
    </div>
    <p><span class="text--bold">Capital:</span> ${capital}</p>
    <p><span class="text--bold">Population:</span> ${population}</p>
    <p><span class="text--bold">Languages:</span> ${Object.values(
      languages
    ).join(', ')}</p>`;
  refs.info.innerHTML = markup;
}

function renderCountriesList(data) {
  const markup = data
    .map(el => {
      const {
        name: { common },
        flags: { svg },
      } = el;
      return `<li class = 'country-list__item'> <img src="${svg}" width = '40'/><p>${common}</p></li>`;
    })
    .join('');
  refs.list.innerHTML = markup;
}
