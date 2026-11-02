const cards = [...document.querySelectorAll('.gallery-card')];
const filters = [...document.querySelectorAll('.filter')];
const visibleCount = document.getElementById('visible-count');
const emptyState = document.getElementById('empty-state');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxNumber = document.getElementById('lightbox-number');
let currentItems = cards;
let currentIndex = 0;
let previousFocus = null;

function applyFilter(category) {
  currentItems = cards.filter(card => category === 'all' || card.dataset.category === category);
  cards.forEach(card => {
    card.hidden = !currentItems.includes(card);
  });
  filters.forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  visibleCount.textContent = currentItems.length;
  emptyState.hidden = currentItems.length !== 0;
}

filters.forEach(button => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

function showImage(index) {
  if (!currentItems.length) return;
  currentIndex = (index + currentItems.length) % currentItems.length;
  const card = currentItems[currentIndex];
  const image = card.querySelector('img');
  const title = card.querySelector('.card-overlay b').textContent.replace(' ↗', '');
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = title;
  lightboxNumber.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentItems.length).padStart(2, '0')}`;
}

function openLightbox(card) {
  previousFocus = document.activeElement;
  currentIndex = currentItems.indexOf(card);
  showImage(currentIndex);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('close-lightbox').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (previousFocus) previousFocus.focus();
}

cards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
document.getElementById('prev-image').addEventListener('click', () => showImage(currentIndex - 1));
document.getElementById('next-image').addEventListener('click', () => showImage(currentIndex + 1));

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
  if (event.key === 'ArrowRight') showImage(currentIndex + 1);
});

applyFilter('all');
