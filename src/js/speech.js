var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

let recognition = new SpeechRecognition();
let grammar = null;
let speechRecognitionList = null;

let isRunning = false;
let isActive = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function chunkArray(myArray, chunk_size){
    var results = [];
    var copyArr = [...myArray];
    
    while (copyArr.length) {
        results.push(copyArr.splice(0, chunk_size));
    }
    
    return results;
}

function getLineHeight(element){
    var temp = document.createElement(element.nodeName);
    temp.setAttribute("style","margin:0px;padding:0px;font-family:"+element.style.fontFamily+";font-size:"+element.style.fontSize);
    temp.innerHTML = "test";
    temp = element.parentNode.appendChild(temp);
    var ret = temp.clientHeight;
    temp.parentNode.removeChild(temp);
    return ret;
 }

async function resetVoiceRecog() {
    console.log('reset interval triggered');
    if (isRunning && isActive) {
        console.log('stopping');
        recognition.stop();
        while (isRunning) {
           await sleep(50);
        }
        console.log('starting');
        recognition.start();
    } else if (!isRunning && isActive) {
        recognition.start();
    }
}

setInterval(resetVoiceRecog, 10000);

const setupSpeech = () => {
    isActive = true;
    console.log('start speech');

    const input = document.querySelector('#input');
    const output = document.querySelector('#output');

    var lineHeight = getLineHeight(output);

    var words = input.value.toLocaleLowerCase()
        .replace(/[’]/g,"'").trim()
        .replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()\"\“\”@\+\?><\[\]\+]/g," ").trim()
        .replace(/\s{2,}/g," ").split(' ');
    
    var wordsChunks = chunkArray(words, 100);

    var hugeRegexStrArr = wordsChunks.map(words => words.reduce((acc, val, idx, arr) => `${acc}(${val.split("").map(val => (val === '’' || val === '\'') ? '[\'|\’]' : `[${val.toLocaleUpperCase()}|${val.toLocaleLowerCase()}]`).join('')})([.|\\s\\S]*${(idx !== arr.length - 1) ? '?' : ''})`, '([.|\\s\\S]*?)'));
    var hugeRegexArr = hugeRegexStrArr.map(str => new RegExp(str));
    var inputStr = input.value.replace( /\n/g, "<br>");
    var originalWordsArr = [];
    for (let i = 0; i < hugeRegexArr.length; i++) {

        let matchedWords = inputStr.match(hugeRegexArr[i]).map((val, idx) => idx != 0 ? val : null).filter(val => val != null);
        inputStr = matchedWords[matchedWords.length - 1];
        if (i == hugeRegexArr.length - 1) {
            originalWordsArr = [...originalWordsArr, ...matchedWords];
        } else {
            originalWordsArr = [...originalWordsArr, ...matchedWords.slice(0, -1)];
        }
    }
    grammar = '#JSGF V1.0; grammar Words; public <word> = ' + words.join(' | ') + ' ;'
    
    speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-GB';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let visibleWords = words;
    let oldResult = [];
    let matchedIdx = [];
    let estimatedIndex = 0;
    output.scrollTop = 0;

    recognition.onresult = function(event) {
        let resultStr = '';
        for (let i = 0; i<event.results.length; i++) {
            if (event.results[i][0].confidence > 0.7) {
                resultStr = `${resultStr}${event.results[i][0].transcript.toLocaleLowerCase()}`
            }
        }
        const newResult = resultStr.split(' ');
        const newWords = newResult.filter((x, idx) => oldResult[idx] != x);
        console.log(newWords);
        oldResult = newResult;
        const indexs = newWords.map(val => visibleWords.reduce(function(a, e, i) {
                if (e === val && i < estimatedIndex + 40  && i > estimatedIndex - 40)
                    a.push(i);
                return a;
            }, []).filter(idx => !matchedIdx.includes(idx))).map(idxs => idxs.length > 0 ? idxs[0] : null)
            .filter(val => val != null);
        matchedIdx = [...matchedIdx, ...indexs];
        estimatedIndex = Math.floor(matchedIdx.sort((a,b) => b-a).slice(0,10).reduce((acc, val) => acc + val, 0)/10);
        const inner = originalWordsArr.reduce((acc, val, idx) => {
            if (idx % 2 == 1) {
                const wordIdx = (idx-1) / 2;
                return `${acc} <span class="${matchedIdx.includes(wordIdx) ? 'matched': 'unmatched'}" id="word-${wordIdx}">${val}</span>`
            } else {
                return `${acc}${val}`;
            }
        }, '');
        output.innerHTML = inner;
        var currentWord = document.getElementById(`word-${estimatedIndex}`);
        var topPos = currentWord.offsetTop;
        output.scrollTop = Math.max(0, topPos - lineHeight - 10);
    }

    recognition.onnomatch = function(event) {
        console.log("I didn't recognise that word.");
    }

    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
    }

    recognition.onend = function() {
        console.log('on end fired');
        isRunning = false;
    }

    recognition.onstart = function() { 
        console.log('on start fired')
        isRunning = true;
    };

    recognition.start();
}

const stopSpeech = () => {
    console.log('stop speech');
    isActive = false;
    if (isRunning) {
        recognition.stop();
    }
};

export { setupSpeech, stopSpeech }