// track number

let numUp = document.getElementById("track-num-up")
let numDown = document.getElementById("track-num-down")

numUp.addEventListener("click", () => {
    trackNum.innerHTML = parseInt(trackNum.innerHTML) + 1;
    checkTrackNum();
});

numDown.addEventListener("click", () => {
    trackNum.innerHTML = parseInt(trackNum.innerHTML) - 1;
    checkTrackNum();
});

function checkTrackNum() {
    if (trackNum.innerHTML == 1) {
    numDown.style.color = 'lightgray';
    numDown.style.pointerEvents = 'none';
    } else if (trackNum.innerHTML == 3) {
    numUp.style.color = 'lightgray';
    numUp.style.pointerEvents = 'none';
    } else {
    numUp.style.color = 'black';
    numDown.style.color = 'black';
    numDown.style.pointerEvents = 'auto';
    numUp.style.pointerEvents = 'auto';
    }
}

// countin measures

let countInUp = document.getElementById("count-in-up")
let countInDown = document.getElementById("count-in-down")
let countInText = document.getElementById("count-in-text")

countInUp.addEventListener("click", () => {
    countInMeasures.innerHTML = parseInt(countInMeasures.innerHTML) + 1;
    checkCountInNum();
});

countInDown.addEventListener("click", () => {
    countInMeasures.innerHTML = parseInt(countInMeasures.innerHTML) - 1;
    checkCountInNum();
});

function checkCountInNum() {
    if (countInMeasures.innerHTML == 0) {
    countInUp.style.color = 'black';
    countInDown.style.pointerEvents = 'auto';
    countInDown.style.color = 'lightgray';
    countInDown.style.pointerEvents = 'none';
    } else if (countInMeasures.innerHTML == 2) {
    countInUp.style.color = 'lightgray';
    countInUp.style.pointerEvents = 'none';
    countInDown.style.color = 'black';
    countInDown.style.pointerEvents = 'auto';
    } else {
    countInUp.style.color = 'black';
    countInDown.style.color = 'black';
    countInDown.style.pointerEvents = 'auto';
    countInUp.style.pointerEvents = 'auto';
    }
}

// toggles metronome count-in html element

let metroRec = document.getElementById("metro-record-toggle")
let metroBool = true;

metroRec.addEventListener("click", () => {
    if (metroBool) {
        metroBool = false;
        metroRec.style.color = "lightgray";

        countInUp.style.color = 'lightgray';
        countInUp.style.pointerEvents = 'none';
        countInDown.style.color = 'lightgray';
        countInDown.style.pointerEvents = 'none';
        countInText.style.color = 'lightgray';
        countInMeasures.style.color = 'lightgray';
    } else {
        metroBool = true;
        metroRec.style.color = "black";

        checkCountInNum();
        countInText.style.color = 'black';
        countInMeasures.style.color = 'black';
    }
})