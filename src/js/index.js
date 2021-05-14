import logMessage from './logger'
import { setupSpeech, stopSpeech } from './speech'
import { startStream, startRecording, stopRecording } from './video'
import '../css/style.scss'
// Log message to console
logMessage('Welcome to AutoPrompt!');

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept() // eslint-disable-line no-undef  
}

const startButton = document.querySelector('.start');
const videoPanel = document.querySelector('.video');
const videoButton = document.querySelector('.video-btn');
const videoButtonIcon = document.querySelector('#video-icon');
const fullScreenButton = document.querySelector('.full-screen-btn');
const fullScreenButtonIcon = document.querySelector('#full-screen-icon');
const fontSlider = document.querySelector('#slider');
const input = document.querySelector('#input');
const output = document.querySelector('#output');

let fullScreen = false;
let videoOpen = true;

let listening = false;
let recording = false;

startButton.addEventListener('click', () => {
  if (listening) {
    output.innerHTML = input.value.replace( /\n/g, "<br>");
    stopSpeech();
    if (recording) {
      stopRecording();
      recording = false;
    }
    if (videoOpen) {
      startButton.innerHTML = "Start Listening / Recording";
    } else {
      startButton.innerHTML = "Start Listening";
    }
    listening = false;
  } else {
    setupSpeech();
    if (videoOpen) {
      startRecording();
      recording = true;
      startButton.innerHTML = "Reset / Stop / Download"
    } else {
      startButton.innerHTML = "Reset / Stop"
    }
    listening = true;
  }
})

input.addEventListener('input', () => {
  output.innerHTML = input.value.replace( /\n/g, "<br>");
  stopSpeech();
  if (videoOpen) {
    startButton.innerHTML = "Start Listening / Recording"
  } else {
    startButton.innerHTML = "Start Listening"
  }
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

videoButton.addEventListener('click', () => {
  if (videoOpen) {
    videoPanel.classList.add("hide-video");
    videoOpen = false;
    videoButtonIcon.classList.remove("fa-video-slash")
    videoButtonIcon.classList.add("fa-video")
    if (!listening) {
      startButton.innerHTML = "Start Listening";
    }
  } else {
    videoPanel.classList.remove("hide-video");
    videoOpen = true;
    videoButtonIcon.classList.add("fa-video-slash")
    videoButtonIcon.classList.remove("fa-video")
    if (!listening) {
      startButton.innerHTML = "Start Listening / Recording";
    }
  }
})

startStream();