import './css/styles.css';
import ImagesApiService from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import OnlyScroll from 'only-scrollbar';

// code for button-load-more in comments

const refs = {
  form: document.querySelector('.search-form'),
  list: document.querySelector('.gallery'),
  //   loadMore: document.querySelector('.load-more'),
};
// refs.loadMore.classList.add('is-hidden');
const imagesApiService = new ImagesApiService();
const gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSearchForm);
// refs.loadMore.addEventListener('click', onLoadMore);

function onSearchForm(e) {
  e.preventDefault();
  clearMarkup();
  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imagesApiService.resetPage();
  imagesApiService.getImages().then(onCheck);
  imagesApiService.getImages().then(createGallery);
  gallery.refresh();
  const scroll = new OnlyScroll(refs.list);
}

function onCheck(object) {
  if (object.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    // refs.loadMore.classList.add('is-hidden');
  } else {
    Notiflix.Notify.info(`Hooray! We found ${object.totalHits} images.`);
    // refs.loadMore.classList.remove('is-hidden');
  }
}
function reachTheEnd(object) {
  const photo = document.querySelectorAll('.photo-card');
  if (photo.length === object.totalHits) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    // refs.loadMore.classList.add('is-hidden');
  }
}
// function onLoadMore() {
//   imagesApiService.getImages().then(createGallery);
//   imagesApiService.getImages().then(reachTheEnd);
// }
function clearMarkup() {
  refs.list.innerHTML = '';
  //   refs.loadMore.classList.add('is-hidden');
}
function createGallery(images) {
  const galleryOfImages = images.hits
    .map(
      card => `<a href="${card.largeImageURL}" class='card'>
      <div class="photo-card">
        <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${card.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${card.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${card.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${card.downloads}
          </p>
        </div>
       </div>
      </a>`
    )
    .join('');
  refs.list.insertAdjacentHTML('beforeend', galleryOfImages);

  const lastCard = document.querySelector('.card:last-child');
  const amountOfCards = document.querySelectorAll('.card');

  if (lastCard && amountOfCards.length !== images.totalHits) {
    infiniteObserver.observe(lastCard);
  } else if (images.totalHits !== 0) {
    imagesApiService.getImages().then(reachTheEnd);
    imagesApiService.getImages().catch(console.error);
  }

  const lightbox = new SimpleLightbox('.gallery a', {
    overlayOpacity: 0.87,
    animationSpeed: 200,
  });
}

const infiniteObserver = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      imagesApiService.getImages().then(createGallery);
    }
  },
  { threshold: 0.1, rootMargin: '500px' }
);
