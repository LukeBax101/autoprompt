import logMessage from './logger'
import { setupSpeech, stopSpeech } from './speech'
import '../css/style.scss'
// Log message to console
logMessage('Welcome to AutoPrompt!');

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

let listening = false;

startButton.addEventListener('click', () => {
  if (listening) {
    output.innerHTML = input.value.replace( /\n/g, "<br>");
    stopSpeech();
    startButton.innerHTML = "Start Listening";
    listening = false;
  } else {
    setupSpeech();
    startButton.innerHTML = "Reset / Stop"
    listening = true;
  }
})

input.addEventListener('input', () => {
  output.innerHTML = input.value.replace( /\n/g, "<br>");
  stopSpeech();
  startButton.innerHTML = "Start Listening"
  listening = false
})


fontSlider.addEventListener('input', () => {
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