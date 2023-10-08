import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox'; // Opisany w dokumentacji
import 'simplelightbox/dist/simple-lightbox.min.css'; // Dodatkowy import stylów

import { fetchGallery } from './pixabay-api.js';

const input = document.querySelector('input');
const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loadingButton = document.querySelector('.load-more');

// loadingButton.classList.add('is-hidden');
loadingButton.style.display = 'none';

let query = '';
let page = 1;
const perPage = 40;

const lightbox = new SimpleLightbox('.photo-card a', {});

// funkcja odpowiedzialna za wyczyszczenie zawartości galerii przed wyświetleniem nowych wyników wyszukiwania
function clearGallery() {
  gallery.innerHTML = '';
}

// funcja obsługująca proces wyszukiwania, wyświetlania obrazów i zarządzania przyciskiem "Load more"

async function searchImages(event) {
  if (!query) {
    return;
  }
  event.preventDefault(); // Zapobiega domyślnemu zachowaniu formularza, czyli odświeżeniu strony
  clearGallery(); // Wyczyszczenie zawartości galerii

  const newQuery = input.value.trim(); // Pobranie nowej frazy wyszukiwania z pola tekstowego
  if (newQuery === query) {
    page += 1;
  } else {
    query = newQuery; // Zaktualizowanie frazy wyszukiwania i zresetowanie numeru strony
    page = 1;
  }

  try {
    const images = await fetchGallery(query, page, perPage); // Wywołanie funkcji do pobrania obrazów

    if (images.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createGallery(images);
      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
      if (images.totalHits > perPage) {
        loadingButton.style.display = 'block';
      } else {
        loadingButton.style.display = 'none';
      }
    }
  } catch (error) {
    handleErrors(error);
  }
}

// funkcja używana do generowania i wyświetlania galerii obrazów na stronie internetowej na podstawie dostarczonych danych

function createGallery(images) {
  const markup = images.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"> <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  const displayedHits = document.getElementsByClassName('photo-card').length;
  if (displayedHits >= images.totalHits) {
    loadingButton.style.display = 'none';
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

lightbox.refresh();

// funkcja do obsługi błędów

function handleErrors(error) {
  console.error('An error occured:', error);
  Notiflix.Notify.failure('An error occurred while fetching images.');
}

// obsługa przycisku "Load more"

async function moreImages() {
  if (!query) {
    return;
  }

  try {
    page += 1;
    const images = await fetchGallery(query, page, perPage);
    createGallery(images);
  } catch (error) {
    handleErrors(error);
  }
}

loadingButton.addEventListener('click', moreImages);
form.addEventListener('submit', searchImages);
