import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox'; // Opisany w dokumentacji
import 'simplelightbox/dist/simple-lightbox.min.css'; // Dodatkowy import stylów

import { fetchGallery } from './pixabay-api';

const input = document.querySelector('input');
const form = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const loadingButton = document.querySelector('.load-more');

loadingButton.classList.add('is-hidden');
// loadingButton.style.display = 'none';

let query = '';
let page = 1;
const perPage = 40;

// funkcja odpowiedzialna za wyczyszczenie zawartości galerii przed wyświetleniem nowych wyników wyszukiwania
function clearGallery() {
  gallery.innerHTML = '';
}

// funcja obsługująca proces wyszukiwania, wyświetlania obrazów i zarządzania przyciskiem "Load more"

function searchImages(event) {
  event.preventDefault(); // Zapobiega domyślnemu zachowaniu formularza, czyli odświeżeniu strony
  clearGallery(); // Wyczyszczenie zawartości galerii

  const newQuery = input.value;
  query = newQuery; // Zaktualizowanie frazy wyszukiwania i zresetowanie numeru strony
  page = 1;

  fetchGallery(query, page, perPage) // Wywołanie funkcji do pobrania obrazów
    .then(images => {
      console.log(images);
      if (images.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createGallery(images);
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
        if (images.totalHits > perPage) {
          loadingButton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
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
        return `<div class="photo-card"> <a href="${largeImageURL}" class="photo-card__link">
  <img src="${webformatURL}" alt="${tags}" class="photo-card__image" loading="lazy" /></a>
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

  const lightbox = new SimpleLightbox('.photo-card a', {});

  const displayedHits = document.getElementsByClassName('info').length;
  if (displayedHits >= images.totalHits) {
    loadingButton.classList.add('is-hidden');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  lightbox.refresh();
}

// obsługa przycisku "Load more"

function moreImages(images) {
  page += 1;
  fetchGallery(query, page, perPage).then(images => {
    createGallery(images);
  });
}

loadingButton.addEventListener('click', moreImages);
form.addEventListener('submit', searchImages);
