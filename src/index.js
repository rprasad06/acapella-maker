let audioselect = document.getElementById("audioselect");
let metroSettings = document.getElementById("metronome");
// let toggleMetro = document.getElementById("togglemetro");
let compileAudio = document.getElementById("compileaudio")
let finalAudioBox = document.getElementById("final-audio-box")

let recordIcon = document.getElementById("record-icon")

let audioPlayers = [
    document.getElementById('audioPlay0'),
    document.getElementById('audioPlay1'),
    document.getElementById('audioPlay2'),
]

let finalAudioPlayer = document.getElementById('finalAudio')

// metronome stuff

metroSettings.addEventListener("click", function() { 
    window.myAPI.openMetro(); 
});

// toggleMetro.addEventListener("click", function() {
//     startStop(); 
// });

// get microphones and list them

navigator.mediaDevices.enumerateDevices()
    .then(gotDevices)  //list microphones

function gotDevices(deviceInfos) {
    
    for (let i = 0; i < deviceInfos.length; i++) {

        const deviceInfo = deviceInfos[i]
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;

        if (deviceInfo.kind === "audioinput") {
            option.text = deviceInfo.label || "microphone " + (audioselect.length + 1);
            audioselect.appendChild(option);
        }
    }

    setup(); // run setup when devices are listed
}

audioselect.addEventListener("change", function() {     // when mic changed, reset recorder
    setup();
});

// compile audio

const crunker = new Crunker.default();

compileAudio.addEventListener("click", async function() {

    let sources = [];
    for (let i = 0; i < audioPlayers.length; i++) // adds non-empty audios to the sources array
    {   
        if (Object.keys(audioPlayers[i].src).length > 0) {
            sources.push(audioPlayers[i].src)
        }
    }

    if (sources.length > 0) { // crunker merging script
        crunker.fetchAudio(...sources) 
        .then((buffers) => crunker.mergeAudio(buffers))
        .then((merged) => crunker.export(merged, 'audio/wav'))
        .then((output) => { 
            finalAudioPlayer.src = window.URL.createObjectURL(output.blob);
            finalAudioBox.style.display = "flex"; 
        })
        .catch((error) => {
            throw new Error(error);
        });
    } else {
        console.log('not enough audio tracks');
    }
    
});

// my previous attempt to make the audio compiler: 

// const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// let audioPlays = [document.getElementById('audioPlay0'), document.getElementById('audioPlay1')];

// document.getElementById("compileaudio").addEventListener("click", function() {

//     let buffers = []
//     let finalPlayAudio = document.getElementById('finalAudio');

//     (async () => {

//         for (let i = 0; i < audioPlays.length; i++) {
//             await fetch(audioPlays[i].src)
//                 .then(response => response.arrayBuffer())
//                 //.then(buffer => audioContext.decodeAudioData(buffer))
//                 .then(buffer => {
                
//                     buffers.push(buffer);
//                     console.log(buffers[i])
    
//                     if (i == audioPlays.length - 1) {
//                         console.log('success1')
//                         finalCompile(buffers);
//                     }
//             });
//         }
//     })();

//     function finalCompile(buffers) {

//         (async () => {
            
//             console.log(buffers[0])

//             let b1 = await fetch(audioPlays[0].src).then(r => r.blob())
//             let b2 = await fetch(audioPlays[1].src).then(r => r.blob())

//             let test = await window.myAPI.mergeAudio(
//                 // await new Promise(r => {let a=new FileReader(); a.onload=r; a.readAsDataURL(b1)}).then(e => e.target.result),
//                 // await new Promise(r => {let a=new FileReader(); a.onload=r; a.readAsDataURL(b2)}).then(e => e.target.result)

//                 buffers[0],
//                 buffers[1]
//             )
//             console.log(test);
            

//         })();

//     }   

//     //     const output = audioContext.createBuffer(
//     //         buffers.length, 
//     //         Math.max(buffers[0].length, buffers[1].length), 
//     //         audioContext.sampleRate
//     //     );
    
//     //     buffers.forEach((buffer) => {
//     //         for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber++) {
//     //             const outputData = output.getChannelData(channelNumber);
//     //             const bufferData = buffer.getChannelData(channelNumber);
      
//     //         for (let i = buffer.getChannelData(channelNumber).length - 1; i >= 0; i--) {
//     //             outputData[i] += bufferData[i];
//     //         }
//     //             output.getChannelData(channelNumber).set(outputData);
//     //         }
//     //     });
    
//     //    // now connecting the output buffer to audio elem by turning into a blob

//     //     const recorded = ((output) => {

//     //         const channels = Array.from({ length: input.numberOfChannels }, (_, i) => i);
//     //         const length = channels.reduce((prev, channelIdx) => prev + input.getChannelData(channelIdx).length, 0);
//     //         const result = new Float32Array(length);

//     //         let index = 0;
//     //         let inputIndex = 0;
            
//     //         while (index < length) {

//     //             channels.forEach((channelIdx) => {
//     //                 result[index++] = input.getChannelData(channelIdx)[inputIndex];
//     //             });

//     //             inputIndex++;
//     //         }
//     //         return result;
//     //     });      
        
//     //     const dataview = this._writeHeaders(recorded, buffer.numberOfChannels, buffer.sampleRate);
       
//     //     const audioBlob = new Blob([dataview], { type });
       
//     // } 
// });