const textVim = document.getElementById('text-vim')
textVim.textContent = textVim.dataset.defaultText

let title = document.querySelector("#title");
let textTitle = title.dataset.title;
let lengthText = textTitle.length;
let counter = 0;

let modeCell = document.querySelector("#mode-vim");
let timeCell = document.querySelector("#time");
let containerTime = document.querySelector("#time-cell");
timeCell.innerText = new Date().toLocaleTimeString(['es-MX', 'en-US', "es-ES", "es-PE"]
    , {timeStyle: "short"});

// console.log(document.)
setInterval(() => {
    timeCell.innerText = new Date().toLocaleTimeString(['es-MX', 'en-US', "es-ES", "es-PE"]
        , {timeStyle: "short"});
}, 1000 * 60);

let interval = setInterval(function () {
    moveCursor(textTitle, counter);
    counter++;
    if (counter >= lengthText) {
        clearInterval(interval);
    }
}, 100);

function moveCursor(titleText, currentPosition) {
    let char = titleText.charAt(currentPosition);
    title.innerHTML += char;
}

const states = {
    FOCUSED: 1,
    NOT_FOCUSED: 0,
}
const customFunctions = {
    'changeLanguage': changeLanguage,
    'setLightMode': setLightMode,
    'setDarkMode': setDarkMode,
    'downloadCV': downloadCV,
}

const header = document.querySelector(".head");
let stateHeader = states.NOT_FOCUSED
header.addEventListener("click", function (event) {
    stateHeader = states.FOCUSED;
    event.stopPropagation();
});
document.addEventListener("click", function (event) {
    stateHeader = states.NOT_FOCUSED;
})

function specialKeys(key) {
    let keys = {
        'Shift': true,
        'Up': true,
        'Down': true,
        'Left': true,
        'Right': true,
        'Tab': true,
        'Ctrl': true,
        'Alt': true,
        'Meta': true,
        'Super': true,
        'CapLock': true,
        'ArrowDown': true,
        'ArrowLeft': true,
        'ArrowRight': true,
        'ArrowUp': true,
    }
    return !!keys[key]
}

function deleteKeys(key) {
    let keys = {
        'Backspace': true,
        'Delete': true,
        'Del': true
    }
    return !!keys[key];
}

let messageCommand = ''


function setLightMode() {

    console.log('funciona light')
}

function downloadCV() {
    console.log('funciona download')
}

function setDarkMode() {
    console.log('funciona dark')
}

function changeLanguage(language) {
    let locales = {
        'spanish': 'es',
        'english': 'en'
    }
    fetch(`../Languages/${locales[language]}.json`)
        .then(res => res.json())
        .then(json => {
            // for (let textToChange of textsElementsToChange) {
            //     let section = textToChange.dataset.section;
            //     let value = textToChange.dataset.value;
            //     textToChange.innerHTML = texts[section][value];
            // }
            if (locales[language] === 'es') {
                messageCommand = 'El idioma ha sido cambiado con éxito';
            } else {
                messageCommand = 'Language changed successfully';
            }
            changeMessageText(messageCommand)
        })
        .catch(err => {
            console.log(err)
            messageCommand = 'Hubo un error al cambiar el idioma';
        });
    messageCommand = messageCommand === '' ? 'Error al resolver' : messageCommand;
    return true;
}

function changeMessageText(text) {
    textVim.textContent = text === '' ? textVim.dataset.defaultText : text;
}

function executeCommand(graphWays, sequenceRest) {
    for (let key in graphWays) {
        let valueSequence = sequenceRest[0]
        let keysObject = graphWays.hasOwnProperty(valueSequence) && typeof (graphWays[key]) !== 'string' ? Object.keys(graphWays[valueSequence]) : key

        if (sequenceRest.length === 1 && keysObject.length > 1 && typeof (keysObject) !== 'string') {
            return false
        }
        if (sequenceRest.length === 1 && typeof (keysObject) === 'string' && key === sequenceRest[0]) {
            let valueFunction = graphWays[key];
            let fn = customFunctions[valueFunction];
            fn(sequenceRest[0])

            return true;
        }
        if (key === valueSequence) {
            sequenceRest.shift()
            return executeCommand(graphWays[key], sequenceRest)
        }
    }
    return false
}

function validateAndExecuteCommand(sequence) {
    let ways = {
        'set': {
            'language': {
                'spanish': "changeLanguage",
                'english': "changeLanguage",
            },
            'dark': {
                'mode': "setDarkMode"
            },

            'light': {
                'mode': "setLightMode"
            }
        },
        'download': {
            'cv': 'downloadCV',
        }
    }
    return executeCommand(ways, sequence)
}

let modeElement = document.getElementById('mode')
function setCommandMode(elements) {
    modeElement.innerText = 'Command';
    elements.forEach(element => {
        element.classList.add("command-mode")
    })
}

function disableCommandMode(elements) {
    modeElement.innerText = 'Normal';
    elements.forEach(element => {
        element.classList.remove("command-mode")
    })
}

document.addEventListener("keydown", function (event) {
    let regText = /aA-zZ/
    if (stateHeader === states.FOCUSED) {
        let key = event.key
        if (specialKeys(key)) {
            return
        }

        if (key === ':') {
            textVim.contentEditable = 'true';
            textVim.textContent = ''
            textVim.focus();
            setCommandMode([modeCell, containerTime])
            return;
        }
        if (key === 'Enter') {
            let command = textVim.textContent.split(':')[1]
            let sequence = command.split(' ');
            validateAndExecuteCommand(sequence)
            disableCommandMode([modeCell, containerTime])
            textVim.blur()
            event.preventDefault()
            return
        }
        if (key === 'esc' || key === 'Escape' || key === 'Esc' || key === 'Scape') {
            textVim.contentEditable = 'false';
            textVim.textContent = textVim.dataset.defaultText
            disableCommandMode([modeCell, containerTime])
            return;
        }
        if (deleteKeys(key)) {
            return
        }
        if (textVim.contentEditable === 'true' && regText.test(key)) {
            textVim.textContent += key;
        }
    }
})
