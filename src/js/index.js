import logMessage from './logger'
import setupSpeech from './speech'
import '../css/style.scss'
// Log message to console
logMessage('Welcome to AutoPrompt!');

navigator.serviceWorker.register('/lukebaxnet-service-worker.js').then(registration => {
  // firebase.messaging().useServiceWorker(registration)
  console.log(registration)
  if (registration.waiting) {
     registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
})

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept() // eslint-disable-line no-undef  
}

const startButton = document.querySelector('.start');
const fullScreenButton = document.querySelector('.full-screen-btn');
const fullScreenButtonIcon = document.querySelector('#full-screen-icon');
const fontSlider = document.querySelector('#slider');
const input = document.querySelector('#input');
const output = document.querySelector('#output');

let fullScreen = false;

startButton.addEventListener('click', () => {
  output.innerHTML = input.value.replace( /\n/g, "<br>");
  setupSpeech();
  startButton.innerHTML = "Reset"
})

input.addEventListener('input', () => {
  output.innerHTML = input.value.replace( /\n/g, "<br>");
})


fontSlider.addEventListener('input', () => {
  console.log(fontSlider.value);
  output.style.fontSize = `${fontSlider.value}px`;
});

fullScreenButton.addEventListener('click', () => {
  if (fullScreen) {
    output.classList.remove("full-screen");
    fullScreen = false;
    fullScreenButtonIcon.classList.remove("fa-compress-arrows-alt")
    fullScreenButtonIcon.classList.add("fa-expand-arrows-alt")
  } else {
    output.classList.add("full-screen");
    fullScreen = true;
    fullScreenButtonIcon.classList.add("fa-compress-arrows-alt")
    fullScreenButtonIcon.classList.remove("fa-expand-arrows-alt")
  }
})