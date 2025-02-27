// Add hover effect for background description
const background = document.querySelector('.background');

background.addEventListener('mouseenter', () => {
    background.style.filter = 'brightness(0.8)';
});

background.addEventListener('mouseleave', () => {
    background.style.filter = 'brightness(0.5)';
});