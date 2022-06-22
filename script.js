import { ENGLISH } from "./english-sentences.js"

const languageCodes = {
    ENGLISH: "en-US",
    SPANISH: "es-ES",
    FRENCH: "fr-FR",
}

const languageObjects = {
    ENGLISH: ENGLISH,
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
}

recognition.onresult = function (event) {
    let testString = testParagraph.textContent
        .toLocaleLowerCase()
        .replace(/[.,/#!$%^&*;:{}=-_~()]/g, "")
    let result = event.results[0][0].transcript.toLocaleLowerCase()
    let confidence = Math.floor(event.results[0][0].confidence * 100)
    let success = result === testString
    if (success) {
        recordingStatus.setAttribute("data-confidence", `${confidence}%`)
    }
    resultParagraph.textContent = capitalizeFirstLetter(result.replace(/(^|\W)i('?\s+)/gm, `$1I$2`))
    resultParagraph.classList.add(success ? "success" : "error")
}
