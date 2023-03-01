let imagesObj = document.getElementsByClassName("image");
const flagsElement = document.getElementById("flags");
flagsElement.addEventListener("click", ChangeLanguage)

const textsElementsToChange = document.querySelectorAll("[data-section]")
for (let i = 0; i < imagesObj.length; i++) {
    imagesObj[i].addEventListener("click", expandImages);
}
document.onreadystatechange = ev =>{
    setDefaultLanguage();
}
function expandImages(evt) {
    if (evt.currentTarget.style.width === "85vw") {
        evt.currentTarget.style.width = "20vw";
        evt.currentTarget.style.minWidth = "4vw";
        return;
    }
    evt.currentTarget.style.width = "85vw";
    evt.currentTarget.style.height = "auto";

}
function setDefaultLanguage(){
    GetLanguage("es");
}
function ChangeLanguage(event) {
    console.log(event.target.parentElement.dataset.language);
    GetLanguage(event.target.parentElement.dataset.language)
}

async function GetLanguage(language) {
    let requestJson = await fetch(`../Languages/${language}.json`);
    let texts = await requestJson.json();
    for (let textToChange of textsElementsToChange) {
        let section = textToChange.dataset.section;
        let value = textToChange.dataset.value;
        textToChange.innerHTML = texts[section][value];
    }
}