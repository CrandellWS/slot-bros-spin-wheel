import {Wheel} from '../../../dist/spin-wheel-esm.js';
import {loadFonts} from '../../../scripts/util.js';
import {props} from './props.js';

window.onload = async () => {
  await loadFonts(props.map(i => i.itemLabelFont));
  init();
};

function init() {

  const wheel = new Wheel(document.querySelector('.wheel-wrapper'));

  const dropdown = document.querySelector('select');

  // Initalise dropdown with the names of each example:
  for (const p of props) {
    const opt = document.createElement('option');
    opt.textContent = p.name;
    dropdown.append(opt);
  }

  // Handle dropdown change:
  dropdown.onchange = () => {
    wheel.init({
      ...props[dropdown.selectedIndex],
      rotation: wheel.rotation, // Preserve value.
    });
  };

  // Select default:
  dropdown.options[0].selected = 'selected';
  dropdown.onchange();

  // Save object globally for easy debugging.
  window.wheel = wheel;

  // Add click event listener to the wheel container
  wheel.addEventListener('click', () => {
    spinWheel(wheel);
  });

}

// Function to spin the wheel to a random item
function spinWheel(wheel) {
  const duration = 5000; // Duration of the spin in milliseconds
  const winningItemIndex = Math.floor(Math.random() * props[document.querySelector('select').selectedIndex].items.length);
  const easing = t => t; // Linear easing function, you can customize it

  wheel.spinToItem(winningItemIndex, duration, true, 2, 1, easing);
}
