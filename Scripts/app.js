const textVim = document.getElementById('text-vim')
textVim.textContent = textVim.dataset.defaultText

let title = document.querySelector("#title");
let textTitle = title.dataset.title;
let lengthText = textTitle.length;
let counter = 0;

let modeCell = document.querySelector("#mode-vim");
let timeCell = document.querySelector("#time");
let containerTime = document.querySelector("#time-cell");
let navigations = document.querySelectorAll(".navigation");
navigations.forEach(navigation => {
    let imageSlider = navigation.parentElement.querySelector(".slider")
    let images = imageSlider.querySelectorAll("img")
    let anchors = navigation.querySelectorAll("a")
    let numberAnchors = anchors.length;
    let currentIndex = 0;
    let isDragging = false
    let startPosition = 0;
    let previousIndex = 0;
    let touchStartX = 0
    let touchEndX = 0
    let isSwiping = false;

    anchors[currentIndex].classList.add("selected-navigation");

    anchors.forEach((anchor, index) => {
        anchor.addEventListener("click", (e) => {
            if (images[index]) {
                currentIndex = goToImage(anchors, images, index, navigation);
            }
        })
    })

    imageSlider.addEventListener("mousedown", (e) => {
        isDragging = true;
        startPosition = e.clientX;
        previousIndex = currentIndex
        isSwiping = false
    })
    imageSlider.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        let deltaX = e.clientX - previousIndex;
        if (Math.abs(deltaX) > 10) {
            isSwiping = true;
            console.log(isSwiping)
        }
    })
    const resetDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;

        let movedSlides = Math.abs((e.clientX - startPosition) / imageSlider.offsetWidth)
        //Mínimo para poder desplazarse
        let limitSwipe = 0.3
        if (isSwiping && movedSlides > limitSwipe) {
            //Arrastra a la izquierda
            if (e.clientX < startPosition) {
                currentIndex = goToImage(anchors, images, currentIndex - 1)
            }
            //Arrastra a la derecha
            if (e.clientX > startPosition) {
                currentIndex = goToImage(anchors, images, currentIndex + 1)
            }
        }
        startPosition = 0;
        isSwiping = false;
    }
    imageSlider.addEventListener("mouseup", resetDrag)
    imageSlider.addEventListener("mouseleave", resetDrag)
    imageSlider.addEventListener("wheel", (e) => {
        let targetIndex;
        console.log(e)
        let isTrackpad = false;
        if (e.wheelDeltaY) {
            if (e.wheelDeltaY === (e.deltaY * -3)) {
                isTrackpad = true;
            }
        } else if (e.deltaMode === 0) {
            isTrackpad = true;
        }
        //Va hacia abajo, entonces desliza hacia la derecha
        if (e.deltaY > 0 || (e.deltaX > 0)) {
            targetIndex = currentIndex + 1
        } else if (e.deltaY < 0 || (e.deltaX < 0)) {
            //Va hacia arriba, entonces desliza hacia la izquierda
            targetIndex = currentIndex - 1
        } else {
            return
        }
        e.preventDefault()
        currentIndex = goToImage(anchors, images, targetIndex, navigation, isTrackpad)
    })

    // Touch events para mobiles
    imageSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchEndX = touchStartX; // Inicializar touchEndX
        isDragging = true; // Considerar el toque como un inicio de arrastre
        isSwiping = false;
    });

    imageSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
        const touchDiff = touchEndX - touchStartX;
        if (Math.abs(touchDiff) > 10) {
            isSwiping = true;
        }
    });

    imageSlider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const touchDiff = touchEndX - touchStartX;
        const sensitivity = 10; // Ajusta según sea necesario

        if (isSwiping && Math.abs(touchDiff) > sensitivity) {
            if (touchDiff < 0) {
                currentIndex = goToImage(anchors, images, currentIndex + 1, navigation);
            } else {
                currentIndex = goToImage(anchors, images, currentIndex - 1, navigation);
            }
        }
        isSwiping = false;
        resetDrag(e)
    });
})

function goToImage(anchors, images, index, navigation, isTrackpad = false) {
    if (index < 0) {
        index = 0;
    } else if (index > images.length - 1) {
        index = images.length - 1;
    }
    let targetImage = images[index];
    let targetAnchor = anchors[index];
    if (isTrackpad) {
        if (targetAnchor) {
            changeSelectedAnchor(targetAnchor, navigation)
        }
    }
    if (targetImage) {
        targetImage.scrollIntoView({inline: "start"})
        changeSelectedAnchor(targetAnchor, navigation)
    }
    return index;
}

function changeSelectedAnchor(elementSelected, navigationElement) {
    let selectedBefore = navigationElement.querySelector(".selected-navigation");
    selectedBefore.classList.remove("selected-navigation");
    elementSelected.classList.add("selected-navigation")
}

timeCell.innerText = new Date().toLocaleTimeString(['es-MX', 'en-US', "es-ES", "es-PE"]
    , {timeStyle: "short"});

const lightPreference = window.matchMedia("(prefers-color-scheme: light)");
lightPreference.addEventListener('change', e => {
    let isLightPreference = e.matches;
    const oldSource = 'icons/git-branch-lighter.svg';
    let images = document.querySelectorAll(".title-prompt > .git-branch");
    let phpImage = document.querySelector("#php-id");
    if (isLightPreference) {
        const newSource = 'icons/git-branch.svg';
        phpImage.src = 'icons/Php_light.svg';
        images.forEach(image => {
            image.src = newSource
        })
    } else {
        let isLight = images[0].src.includes('icons/git-branch.svg')
        phpImage.src = 'icons/Php_dark.svg';
        if (isLight) {
            images.forEach(image => {
                image.src = oldSource
            })
        }
    }
})

let buttonsSections = document.querySelectorAll(".button-show-modal");
let buttonsCloseDialog = document.querySelectorAll(".button-close-modal");
buttonsCloseDialog.forEach(button => {
    button.addEventListener("click", e => {
        e.stopPropagation()
    })
})
buttonsSections.forEach(button => {
    button.addEventListener('click', (e) => {
        let dialog = e.target.parentElement.querySelector('dialog');
        dialog.showModal()
    })
})

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