import { createOptimizedPicture } from '../../scripts/aem.js';

// Function to check if the text contains a number followed by a percentage symbol
function containsNumberPercentage(text) {
  const regex = /\d+%/;
  return regex.test(text);
}

// Function to extract the percentage value from the text
function getPercentageValue(text) {
  const regex = /\d+/;
  const match = text.match(regex);
  return match ? parseInt(match[0], 10) : 0;
}

// Function to get the background color based on the percentage value
function getBackgroundColor(percentageValue) {
  if (percentageValue >= 0 && percentageValue <= 25) {
    return 'var(--clr-blue)';
  } if (percentageValue > 25 && percentageValue <= 45) {
    return 'var(--clr-red)';
  } if (percentageValue > 45 && percentageValue <= 65) {
    return 'var(--clr-orange)';
  } if (percentageValue > 65 && percentageValue <= 85) {
    return 'var(--clr-light-blue)';
  }
  return 'var(--clr-green)';
}

// Function to animate the width of the element
function animateWidth(element, percentageValue) {
  let start = 0;
  const duration = 1000; // duration of the animation in milliseconds
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const width = Math.min((progress / duration) * percentageValue, percentageValue);
    element.style.width = `${width}%`;
    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Function to observe elements and animate when in view
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const percentageValue = parseInt(element.getAttribute('data-percentage'), 10);
        animateWidth(element, percentageValue);
        observer.unobserve(element); // Stop observing once animated
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skills-container').forEach((element) => {
    observer.observe(element);
  });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (containsNumberPercentage(div.textContent)) {
        const percentageValue = getPercentageValue(div.textContent);
        div.className = 'skills-container';
        div.setAttribute('data-percentage', percentageValue);
        div.style.width = '0%'; // Start with 0% width
        div.style.backgroundColor = getBackgroundColor(percentageValue);
      } else {
        div.className = 'cards-card-body';
      }
      // Make links to images and PDFs open in a new tab
      div.querySelectorAll('a').forEach((a) => {
        if (/\.(pdf|jpe?g|png|gif|webp|svg)$/i.test(a.href)) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        }
      });
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);

  // Observe elements for animation
  observeElements();
}
