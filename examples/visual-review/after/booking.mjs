import { selectDay } from './rules.mjs';

const form = document.querySelector('#book');
form.addEventListener('submit', event => {
  event.preventDefault();
  const selection = selectDay(new FormData(form).get('day'));
  document.querySelector('#booking-status').textContent =
    `${selection.label} selected for this demo.`;
});
