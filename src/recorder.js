// the actual recording function

let startRec = document.getElementById("startrec");
let stopRec = document.getElementById("stoprec");
let trackNum = document.getElementById("tracknumber");

// monitoring setup and toggle

let monitoringContext = null;
let monitoringCheck = document.getElementById("monitoring");
let monitoring = false;

monitoringCheck.addEventListener("click", function() {       
    monitoring = !monitoring;
    toggleMonitor();     
})
function toggleMonitor() {
    if (monitoring) {
        monitoringContext.resume();
        monitoringCheck.style.color = "black";
        console.log('monitoring active');
    } else {
        monitoringContext.suspend();
        monitoringCheck.style.color = "lightgray";
        console.log('monitoring inactive');
    }
}

// all the recording stuff

function setup() { 

    if (monitoringContext != null) { // audiocontext for monitoring
        monitoringContext.close()
    }
    monitoringContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log(monitoringContext)

    let constraints = {
        audio: { 
            deviceId: { exact: audioselect.value },
            echoCancellation: { exact: false },
            googEchoCancellation: { exact: false },
            googAutoGainControl: { exact: false },
            googNoiseSuppression: { exact: false },
        },
    }

    navigator.mediaDevices.getUserMedia(constraints) 
    .then(function(mediaStreamObj) {
        
        // sets up monitoring with new microphone
         
        let microphone = monitoringContext.createMediaStreamSource(mediaStreamObj);
        let destination = monitoringContext.destination;
        microphone.connect(destination);  
        toggleMonitor();

        // media recording

        let mediaRecorder = new MediaRecorder(mediaStreamObj, {audioBitsPerSecond: 320000});
        
        startRec.addEventListener("click", function() {
            if (mediaRecorder.state == 'inactive') {
                startRecording();   
            } else {
                stopRecording();
                startRec.setAttribute("class", "bi-record-fill");
            }
        });

        stopRec.addEventListener("click", function() {
            try {
                stopRecording();
                startRec.setAttribute("class", "bi-record-fill");
            } catch (error) {
                console.log(error)
                console.log('not recording!')
            }
        });

        function startRecording() {

            if (metroBool) {    // waits for metronome count-in before starting recorder
                (async () => {      
                    startMetronome();
                    await awaitCountIn();
                    mediaRecorder.start();
                    startRec.setAttribute("class", "bi-record2");
                    console.log(mediaRecorder.state);
                })();
            } else {
                mediaRecorder.start();
                startRec.setAttribute("class", "bi-record2");
                console.log(mediaRecorder.state);
            }
        }

        function stopRecording() {
            mediaRecorder.stop();
            stopMetronome();
        }

        // writing audio file segment

        let chunks = [];

        mediaRecorder.ondataavailable = function(ev) {
            chunks.push(ev.data);
        }     

        mediaRecorder.onstop = function () {

            let blob = new Blob(chunks, { 'type' : 'audio/wav;' });
            chunks = [];

            let audioSrc = window.URL.createObjectURL(blob);
            audioPlayers[parseInt(trackNum.innerHTML) - 1].src = audioSrc;

            compileAudio.style.color = "black";
            compileAudio.style.pointerEvents = "auto";
        }      
    });
};