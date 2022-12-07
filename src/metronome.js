// metronome code (most of it courtesy of https://github.com/grantjames/metronome)

let isRunning = false;

let tempo = localStorage.getItem('tempo');
let beatCount = localStorage.getItem('beatCount');

let countInMeasures = document.getElementById('countinmeasures');

let audioContext = null;
let notesInQueue = []; // notes that have been put into the web audio and may or may not have been played yet {note, time}
let currentQuarterNote = 0;
let measureCount = 0;
let lookahead = 20;          // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1;   // How far ahead to schedule audio (sec)
let nextNoteTime = 0.0;  // when the next note is due
let intervalID = null;

// update local storage items (original code)

function updateTempoAndBeat() {
    tempo = localStorage.getItem('tempo');
    beatCount = localStorage.getItem('beatCount');
}

// waiting for metronome count in (original code)

let promiseResolve, promiseReject;

async function awaitCountIn() {

    let mc = new Promise(function(resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
    });

    await mc;
    return measureCount;
}

// metronome functionality

function startStop() {

    if (isRunning) {
        console.log("stopped metronome")
        stopMetronome();
    } else {
        console.log("started metronome")
        startMetronome();
    }
}

async function startMetronome() { 

    if (isRunning) return;

    isRunning = true;

    if (audioContext == null)
    {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    //audioContext.resume();

    isRunning = true;

    measureCount = 0;
    currentQuarterNote = 0;
    nextNoteTime = audioContext.currentTime + 0.05;

    intervalID = setInterval(() => scheduler(), lookahead); //calls scheduler every 20 ms

    return measureCount; //return promise for when to start the recording (if the count in is activated)
}

function stopMetronome() {

    if (!isRunning) return;

    isRunning = false;

    clearInterval(intervalID);
}

function scheduler() {

    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote(currentQuarterNote, nextNoteTime);
        nextNote();
    }
}

function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });

    // create an oscillator
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    
    osc.frequency.value = (beatNumber % beatCount == 0) ? 1000 : 700; //big beat vs small beat

    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.002);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.01); 

    osc.connect(envelope);
    envelope.connect(audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.03); 
}

function nextNote() {

    let secondsPerBeat = 60.0 / tempo; // calculate beat length
    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    currentQuarterNote++; // Advance the beat number, go to zero if reached a measure
    if (currentQuarterNote == parseInt(beatCount) + 1) {
        currentQuarterNote = 1;
    }

    // resolve the promise after metronome count-in value (original code)

    if (currentQuarterNote == 1) { 
        measureCount++;
        console.log(measureCount)
        try {   
            if (measureCount == parseInt(countInMeasures.innerHTML) + 1) { 
                promiseResolve(measureCount);
                console.log('resolved!')
            }
        } catch(error) {
            console.log('no metronome count-in')
        }
    }
}

