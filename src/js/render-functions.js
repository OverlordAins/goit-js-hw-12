import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


export const galleryEl = document.querySelector('.gallery');
export const loadMoreBtn = document.querySelector('.btn-more');
const loaderBox = document.querySelector('.box-loader');


let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


export function createGallery(images) {
  const markup = images
    .map(
      image => `
      <li class="photo-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p><b>Likes:</b> ${image.likes}</p>
          <p><b>Views:</b> ${image.views}</p>
          <p><b>Comments:</b> ${image.comments}</p>
          <p><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </li>
    `
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh(); // оновлюємо lightbox після вставки
}


export function clearGallery() {
  galleryEl.innerHTML = '';
}

// Loader
export function showLoader() {
  loaderBox.classList.remove('is-hidden');
}
export function hideLoader() {
  loaderBox.classList.add('is-hidden');
}


export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}
export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}