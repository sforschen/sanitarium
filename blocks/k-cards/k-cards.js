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
        div.style.width = `${percentageValue}%`;
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
