// main.js
import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  galleryEl,
  loadMoreBtn,
} from './js/render-functions.js';


import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Селектор форми (у твоєму HTML клас form)
const form = document.querySelector('.form');
const searchInput = form?.querySelector('input[name="search-text"]');

let currentQuery = '';
let page = 1;
let totalHits = 0;

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', onLoadMore);
}

if (form) {
  form.addEventListener('submit', onSearch);
}


hideLoadMoreButton();
hideLoader();

async function onSearch(e) {
  e.preventDefault();
  const query = searchInput?.value.trim();

  if (!query) {
    iziToast.warning({ title: 'Warning', message: 'Please enter a word' });
    return;
  }

  currentQuery = query;
  page = 1;
  totalHits = 0;
  clearGallery();
  hideLoadMoreButton();

  try {
    showLoader();
    const data = await getImagesByQuery(currentQuery, page);
    totalHits = data.totalHits ?? 0;
    const hits = Array.isArray(data.hits) ? data.hits : [];

    if (hits.length === 0) {
      iziToast.info({ title: 'No results', message: 'No images found. Try again.' });
      hideLoader();
      return;
    }

    createGallery(hits);

    iziToast.success({
      title: 'Success',
      message: `Wow, there are ${totalHits} images!`,
    });

    const fetchedSoFar = page * PER_PAGE;
    if (fetchedSoFar < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "Sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again.' });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;

  try {
    showLoader();
    const data = await getImagesByQuery(currentQuery, page);
    const hits = Array.isArray(data.hits) ? data.hits : [];
    totalHits = data.totalHits ?? totalHits;

    if (hits.length === 0) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "Sorry, but you've reached the end of search results.",
      });
      return;
    }

    createGallery(hits);
    smoothScrollAfterLoad();

    const fetchedSoFar = page * PER_PAGE;
    if (fetchedSoFar >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "Sorry, but you've reached the end of search results.",
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({ title: 'Error', message: 'Failed to load more images.' });
    page = Math.max(1, page - 1);
  } finally {
    hideLoader();
  }
}

function smoothScrollAfterLoad() {
  const firstCard = galleryEl.querySelector('.photo-card');
  if (!firstCard) return;

  const { height } = firstCard.getBoundingClientRect();
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}