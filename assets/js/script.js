const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-navigation');
const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
const currentPage = document.body.dataset.page;

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

document.querySelectorAll('[data-nav]').forEach((link) => {
  if (link.dataset.nav === currentPage) {
    link.classList.add('current');
    link.setAttribute('aria-current', 'page');
    const parentDropdown = link.closest('.nav-dropdown');
    if (parentDropdown) {
      parentDropdown.querySelector('.dropdown-toggle').classList.add('current');
    }
  }
});

function closeDropdowns(except = null) {
  dropdowns.forEach((dropdown) => {
    if (dropdown === except) return;
    dropdown.classList.remove('is-open');
    dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
  });
}

dropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector('.dropdown-toggle');
  button.addEventListener('click', () => {
    const shouldOpen = !dropdown.classList.contains('is-open');
    closeDropdowns();
    dropdown.classList.toggle('is-open', shouldOpen);
    button.setAttribute('aria-expanded', String(shouldOpen));
  });
});

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !isOpen);
  if (isOpen) closeDropdowns();
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-dropdown')) closeDropdowns();
  if (!event.target.closest('.nav-wrap') && navigation.classList.contains('is-open')) {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    closeDropdowns();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDropdowns();
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.focus();
  }
});
