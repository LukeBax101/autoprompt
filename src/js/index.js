import logMessage from './logger'
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

const startButton = document.querySelector('#start');
const input = document.querySelector('#input');
const output = document.querySelector('#output');


startButton.addEventListener('click', () => {
  output.innerHTML = input.value;
})

CSS.registerProperty( {
        name: '--pos',
        syntax: '<length-percentage>',
        initialValue: '0%',
        inherits: true
    }
);