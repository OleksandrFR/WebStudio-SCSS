// Мобільне меню: відкриття/закриття
const menuButton = document.querySelector('.menu-button');
const menuClose = document.querySelector('.menu-close');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuButton && menuClose && mobileMenu) {
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.add('is-open');
    });

    menuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
    });
}
