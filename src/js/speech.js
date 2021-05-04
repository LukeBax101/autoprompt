
const setupSpeech = () => {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    const input = document.querySelector('#input');
    const output = document.querySelector('#output');

    var words = input.value.toLocaleLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()<>\"]/g,"").replace(/\s{2,}/g," ").split(' ');
    var hugeRegexStr = words.reduce((acc, val) => `${acc}(${val.split("").map(val => `[${val.toLocaleUpperCase()}|${val.toLocaleLowerCase()}]`).join('')})([.|\\s\\S]*)`, '([.|\\s\\S]*)');
    var hugeRegex = new RegExp(hugeRegexStr);
    var originalWordsReg = input.value.replace( /\n/g, "<br>").match(hugeRegex);
    var originalWordsArr = originalWordsReg.map((val, idx) => idx != 0 ? val : null).filter(val => val != null);
    var grammar = '#JSGF V1.0; grammar Words; public <word> = ' + words.join(' | ') + ' ;'
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-GB';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.start();

    let visibleWords = words;
    let oldResult = [];
    let matchedIdx = [];
    let estimatedIndex = 0;

    recognition.onresult = function(event) {
        let resultStr = '';
        for (let i = 0; i<event.results.length; i++) {
            if (event.results[i][0].confidence > 0.7) {
                resultStr = `${resultStr}${event.results[i][0].transcript.toLocaleLowerCase()}`
            }
        }
        const newResult = resultStr.split(' ');
        const newWords = newResult.filter((x, idx) => oldResult[idx] != x);
        oldResult = newResult;
        const indexs = newWords.map(val => visibleWords.reduce(function(a, e, i) {
                if (e === val)
                    a.push(i);
                return a;
            }, []).filter(idx => !matchedIdx.includes(idx))).map(idxs => idxs.length > 0 ? idxs[0] : null)
            .filter(val => val != null);
        matchedIdx = [...matchedIdx, ...indexs];
        estimatedIndex = Math.floor(matchedIdx.sort((a,b) => b-a).slice(0,5).reduce((acc, val) => acc + val, 0)/5);
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
        output.scrollTop = topPos;
    }

    recognition.onnomatch = function(event) {
        console.log("I didn't recognise that word.");
    }

    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
    }
}
export default setupSpeech