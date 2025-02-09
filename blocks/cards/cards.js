import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const picture = div.querySelector('picture');
      if (div.children.length === 1 && picture) {
        if (picture.children.length === 0) {
          div.remove();
        } else {
          div.className = 'cards-card-image';
          // Add overlay text
          const overlayText = document.createElement('div');
          overlayText.className = 'overlay-text';
          overlayText.textContent = 'EXPAND';
          div.appendChild(overlayText);

          // Function to handle click event
          const handleClick = () => {
            div.classList.toggle('expanded');
            overlayText.textContent = div.classList.contains('expanded') ? 'CLOSE' : 'EXPAND';
          };

          // Add or remove event listeners based on screen size
          const updateEventListeners = () => {
            if (window.innerWidth > 640) {
              div.addEventListener('click', handleClick);
            } else {
              div.removeEventListener('click', handleClick);
              div.classList.add('expanded'); // Ensure expanded on mobile
              overlayText.style.display = 'none'; // Hide overlay text on mobile
            }
          };

          // Initial check
          updateEventListeners();

          // Update event listeners on window resize
          window.addEventListener('resize', updateEventListeners);
        }
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
