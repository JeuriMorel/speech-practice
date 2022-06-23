import { ENGLISH } from "./english-sentences.js"
import { FRENCH } from "./french-sentences.js"

const languageCodes = {
    ENGLISH: "en-US",
    SPANISH: "es-ES",
    FRENCH: "fr-FR",
}

const languageObjects = {
    ENGLISH: ENGLISH,
    FRENCH: FRENCH
}

function resetButtons() {
    startRecordBtn.disabled = true
    resultParagraph.textContent = ""
    testParagraph.textContent = ""
    clearConfidence()
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}

// DIFFICULTY FORM
const difficultyForm = document.querySelector("[data-form='difficulty']")
const difficultyInputs = [...difficultyForm.querySelectorAll("input")]

difficultyInputs.forEach(input => {
    input.addEventListener("click", e => {
        selectedDifficulty = e.target.value.toLocaleUpperCase()
        resetButtons()
    })
})

//LANGUAGE FORM
const languageForm = document.querySelector("[data-form='language']")
const languageInputs = [...languageForm.querySelectorAll("input")]

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

let selectedLanguage = languageInputs
    .find(input => input.checked)
    .value.toLocaleUpperCase()
let selectedDifficulty = difficultyInputs
    .find(input => input.checked)
    .value.toLocaleUpperCase()
let sentencesArray

recognition.continuous = false
recognition.lang = languageCodes[selectedLanguage]
recognition.interimResults = false
recognition.maxAlternatives = 1

const startRecordBtn = document.querySelector("[data-button='record']")
const newSentenceBtn = document.querySelector("[data-button='new sentence']")
const resultParagraph = document.querySelector("[data-paragraph='output']")
const testParagraph = document.querySelector("[data-paragraph='test sentence']")
const recordingStatus = document.querySelector(".status")

function clearConfidence() {
    recordingStatus.setAttribute("data-confidence", "")
}

newSentenceBtn.addEventListener("click", () => {
    clearConfidence()
    sentencesArray = languageObjects[selectedLanguage][selectedDifficulty]
    let sentence =
        sentencesArray[Math.floor(Math.random() * sentencesArray.length)]
    resultParagraph.textContent = ""
    startRecordBtn.disabled = false
    testParagraph.textContent = sentence
})

startRecordBtn.addEventListener("click", () => {
    clearConfidence()
    if (startRecordBtn.classList.contains("recording")) {
        recognition.abort()
        recordingStatus.classList.remove("animate-waves")
        startRecordBtn.classList.remove("recording")
    } else {
        recognition.start()
        recordingStatus.classList.add("animate-waves")
        startRecordBtn.classList.add("recording")
        resultParagraph.textContent = ""
        resultParagraph.classList.remove("success", "error")
        console.log("record start")
    }
})

recognition.onspeechend = function () {
    recognition.stop()
    recordingStatus.classList.remove("animate-waves")
    startRecordBtn.classList.remove("recording")
    console.log("Speech recognition has stopped.")
    startRecordBtn.disabled = true
}

recognition.onresult = function (event) {
    let testString = testParagraph.textContent
        .toLocaleLowerCase()
        .replace(/[.,/#!$%^&*;:{}=-_~()]/g, "").replace(/\s{2}/g, ' ')
    let result = event.results[0][0].transcript.toLocaleLowerCase()
    let confidence = Math.floor(event.results[0][0].confidence * 100)
    let success = result.trim() === testString.trim()
    if (success) {
        recordingStatus.setAttribute("data-confidence", `${confidence}%`)
    }
    resultParagraph.textContent = capitalizeFirstLetter(result.replace(/(^|\W)i('?\s+)/gm, `$1I$2`))
    resultParagraph.classList.add(success ? "success" : "error")
    setTimeout(() => {
        startRecordBtn.disabled = false
    },100)
}
