import { ENGLISH } from "./english-sentences.js"


const languageCodes = {
    ENGLISH: "en-US",
    SPANISH: "es-ES",
    FRENCH: "fr-FR"
}

const languageObjects = {
    ENGLISH: ENGLISH
}

function resetButtons(){
    startRecordBtn.disabled = true
    stopRecordBtn.disabled = true
    resultParagraph.textContent = ""
    testParagraph.textContent = ''
}

// DIFFICULTY FORM
const difficultyForm = document.querySelector("[data-form='difficulty']");
const difficultyInputs = [...difficultyForm.querySelectorAll("input")]

difficultyInputs.forEach(input => {
    input.addEventListener("click", e => {
        selectedDifficulty = e.target.value.toLocaleUpperCase()
        resetButtons()
    })
})

//LANGUAGE FORM
const languageForm = document.querySelector("[data-form='language']");
const languageInputs = [...languageForm.querySelectorAll("input")];

languageInputs.forEach(input => {
    input.addEventListener("click", e => {
        selectedLanguage = e.target.value.toLocaleUpperCase()
        recognition.lang = languageCodes[selectedLanguage]
    })
})

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
// const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList
// const SpeechRecognitionEvent =
//     window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const recognition = new SpeechRecognition()

// const testSentences = {
//     1: "se reposer",
//     2: "se détendre",
//     3: "Se bronzer",
//     4: "nager",
//     5: "Aller à la mer",
//     6: "Marcher sur la plage",
//     7: "lire des romans sur la plage",
//     8: "natation",
//     9: "se baigner",
//     10: "faire de la planche à voile",
//     11: "faire du ski nautique",
//     12: "faire de la voile",
//     13: "Faire un pique-nique",
//     14: "faire du surf",
//     15: "faire du ski",
//     16: "faire le tour de",
//     17: "faire une excursion",
//     18: "visiter les musées",
//     19: "faire du camping",
//     20: "faire du sport",
//     21: "Faire du vélo",
//     22: "Faire de l'escalade",
//     23: "Faire du skate",
//     24: "Faire du parapente",
// }

let selectedLanguage = languageInputs
    .find(input => input.checked)
    .value.toLocaleUpperCase()
let selectedDifficulty = difficultyInputs.find(input => input.checked).value.toLocaleUpperCase()
let sentencesArray


recognition.continuous = false
recognition.lang = languageCodes[selectedLanguage]
recognition.interimResults = false
recognition.maxAlternatives = 1

const startRecordBtn = document.querySelector("[data-button='record']")
const stopRecordBtn = document.querySelector("[data-button='stop']")
const newSentenceBtn = document.querySelector("[data-button='new sentence']")
const resultParagraph = document.querySelector("[data-paragraph='output']")
const testParagraph = document.querySelector("[data-paragraph='test sentence']")
const recordingIcon = document.querySelector("[data-icon='recording']")



newSentenceBtn.addEventListener('click', () => {
    sentencesArray = languageObjects[selectedLanguage][selectedDifficulty]
    let sentence = sentencesArray[Math.floor(Math.random() * sentencesArray.length)]
    resultParagraph.textContent = ""
    startRecordBtn.disabled = false
    testParagraph.textContent = sentence
    startRecordBtn.textContent = "record"
})

startRecordBtn.addEventListener("click", () => {
    recognition.start()
    recordingIcon.classList.add("recording")
    stopRecordBtn.disabled = false
    resultParagraph.textContent = ''
    resultParagraph.classList.remove("success", "error")
    console.log("record start")
})
stopRecordBtn.addEventListener("click", () => {
    recognition.abort()
    recordingIcon.classList.remove("recording")
    stopRecordBtn.disabled = true
    startRecordBtn.textContent = "try again"
})
recognition.onspeechend = function () {
    recognition.stop()
    recordingIcon.classList.remove("recording")
    stopRecordBtn.disabled = true
    console.log("Speech recognition has stopped.")
}

recognition.onresult = function (event) {
    let testString = testParagraph.textContent.toLocaleLowerCase()
        .replace(/[.,/#!$%^&*;:{}=-_~()]/g, "")
    let result = event.results[0][0].transcript.toLocaleLowerCase()
    let success = result === testString
    if(!success) startRecordBtn.textContent = 'try again'
    if(success) startRecordBtn.textContent = 'record'
    resultParagraph.textContent = result.replace(/(^|\W)i('?\s+)/gm, `$1I$2`)
    resultParagraph.classList.add(success ? 'success' : 'error')
}


