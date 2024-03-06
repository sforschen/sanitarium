import { createOptimizedPicture } from '../../scripts/aem.js';

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
        div.style.width = percentageValue + '%';
        div.style.backgroundColor = getBackgroundColor(percentageValue);
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

// Function to check if the text contains a number followed by a percentage symbol
function containsNumberPercentage(text) {
  const regex = /\d+%/;
  return regex.test(text);
}

// Function to extract the percentage value from the text
function getPercentageValue(text) {
  const regex = /\d+/;
  const match = text.match(regex);
  return match ? parseInt(match[0]) : 0;
}

// Function to get the background color based on the percentage value
function getBackgroundColor(percentageValue) {
  if (percentageValue >= 0 && percentageValue <= 20) {
    return 'var(--clr-blue)';
  } else if (percentageValue > 20 && percentageValue <= 40) {
    return 'var(--clr-red)';
  } else if (percentageValue > 40 && percentageValue <= 60) {
    return 'var(--clr-orange)';
  } else if (percentageValue > 60 && percentageValue <= 80) {
    return 'var(--clr-light-blue)';
  } else {
    return 'var(--clr-green)';
  }
}