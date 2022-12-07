// backend code for the metronome settings window

// close metronome settings

document.getElementById("closemetro").addEventListener('click', function() {
    window.myAPI.closeMetro(); 
});

// toggle metronome

document.getElementById('togglemetro').addEventListener('click', function() {
    startStop();
});

// tempo and beat stuff

let temposlider = document.getElementById('temposlider');
let tempotext = document.getElementById('tempotext');
let beatslider = document.getElementById('beatslider');
let beattext = document.getElementById('beattext');

temposlider.value = localStorage.getItem('tempo');
tempotext.innerText = localStorage.getItem('tempo');
beatslider.value = localStorage.getItem('beatCount');
beattext.innerHTML = localStorage.getItem('beatCount');

temposlider.oninput = function() {
    localStorage.setItem('tempo', temposlider.value)
    tempotext.innerHTML = temposlider.value;
    updateTempoAndBeat();
}

beatslider.oninput = function() {
    localStorage.setItem('beatCount', beatslider.value)
    beattext.innerHTML = beatslider.value;
    updateTempoAndBeat();
}

tempotext.addEventListener('keydown', (evt) => {
    if (evt.key === "Enter") {
        tempotext.blur();
    }
});

tempotext.addEventListener('focusout', function() {

    console.log('unfocused')
    if (tempotext.innerHTML.length > 3) {
      tempotext.innerHTML = tempotext.innerHTML.substring(0,3);
    }      

    if (tempotext.innerHTML < 20) {
      console.log("too low")
      tempotext.innerHTML = 20;     
    }

    if (isNaN(tempotext.innerHTML)) {
      tempotext.innerHTML = 120;   
    }

    localStorage.setItem('tempo', tempotext.innerHTML);
    temposlider.value = localStorage.getItem('tempo');
    updateTempoAndBeat();
});