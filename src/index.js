import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(list);
    cleanMarkup(info);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name');
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(list);
      cleanMarkup(info);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(list);
    const markupInfo = createInfoMarkup(data);
    info.innerHTML = markupInfo;
  } else {
    cleanMarkup(info);
    const markupList = createListMarkup(data);
    list.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
        name.official
      }</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

// test 12