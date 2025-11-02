let currentGuess = '';
let currentRow = 1;
let wordFound = false;
let canClick = true;
let wordList;
let word;

fetch('words.txt').then(response => response.text()).then(text => {
    wordList = text.split('\n');
    word = wordList[Math.floor(Math.random() * wordList.length)];
    console.log(word);
});



document.addEventListener("keydown", function(event) {
    let key = event.key.toUpperCase();
    if (key.length == 1 && key.match(/[A-Z]/)) {
        addLetter(key);
    }
    if (key === 'BACKSPACE') {
        clickBackspace();
    }
    if (key === "ENTER") {
        clickEnter();
    }
});

function clickEnter() {
    if (wordFound) return;
    if (!canClick) return;
    canClick = false;
    setTimeout(() => {
        canClick = true;
    }, 1600);
    let warning = document.getElementById('warning')
    let row = document.getElementById(`row${currentRow}`);
    function dontWork() {
        warning.style.display = 'block';
        row.style.animation = 'shake 0.3s';
        row.addEventListener('animationend', () => {
            row.style.animation = 'none';
            warning.style.opacity = 0;
            warning.style.transition = "opacity 0.8s";
            warning.addEventListener('transitionend', () => {
                warning.style.display = 'none';
                warning.style.opacity = 1;
            }, { once: true });
        }, { once: true });
    }

    if (currentGuess.length != 5) {
        warning.innerText = 'NOT ENOUGH LETTERS';
        dontWork();
    } else {
        if (!wordList.includes(currentGuess.toLowerCase())) {
            warning.innerText = 'NOT IN WORD LIST';
            dontWork();
        } else {
            for (let i = 0; i < 5; i++) {
                setTimeout(function() {
                    let place = document.getElementById(`place${(currentRow) * 5 - (4 - i)}`);
                    place.style.animation = 'flip 0.3s';
                    place.addEventListener('animationend', () => {
                        place.style.animation = 'none';
                    }, { once: true });
                    setTimeout(function() {
                        changeBackgroundColour(place, i);
                        if (i == 4) {
                            currentGuess = '';
                            currentRow++;
                        }
                    }, 150);
                }, i * 300);
            }
        }
    }
    if (word.toUpperCase() == currentGuess) {
        wordFound = true;
        setTimeout(() => {
            warning.style.display = 'block';
            warning.innerText = 'GOOD JOB';
        }, 1600);
    } else if (currentRow == 6) {
        warning.style.display = 'block';
        warning.innerText = word.toUpperCase();
        wordFound = true;
    }
}

function changeBackgroundColour(place, number) {
    let colour;
    if (word[number] === currentGuess.toLowerCase()[number]) {
        colour = '#6AAA64';
    } else if (word.includes(currentGuess.toLowerCase()[number])) {
        colour = '#C9B458';
    } else {
        colour = '#787C7E';
    }
    place.style.backgroundColor = colour;
    place.style.border = `2px solid ${colour}`;
    place.style.color = '#fff';
}

function clickBackspace() {
    if (currentGuess.length > 0) {
        let currentBox = document.getElementById(`place${(currentRow * 5) - (5 - currentGuess.length)}`);
        currentBox.style.border = '2px solid #d9d9d9';
        currentBox.firstChild.innerText = '\u200F';
        currentGuess = currentGuess.slice(0, -1);
    }
}

function addLetter(letter) {
    if (currentGuess.length < 5 && currentRow < 7 && !wordFound) {
        let currentBox = document.getElementById(`place${(currentRow * 5) - (4 - currentGuess.length)}`);
        currentBox.style.border = '2px solid #939393';
        currentBox.firstChild.innerText = letter;
        currentGuess = currentGuess + letter;

        currentBox.style.animation = 'pop 0.1s ease forwards';
        currentBox.addEventListener('animationend', () => {
            currentBox.style.animation = 'none';
        });
    }
}



