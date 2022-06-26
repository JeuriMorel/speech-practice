import { ENGLISH } from "./english-sentences.js"
import { FRENCH } from "./french-sentences.js"
import { qs, qsa, capitalizeFirstLetter } from "./js-utility-funcs.js"

const languageCodes = {
    ENGLISH: "en-US",
    SPANISH: "es-ES",
    FRENCH: "fr-FR",
}

const languageObjects = {
    ENGLISH: ENGLISH,
    FRENCH: FRENCH,
}

function resetButtons() {
    startRecordBtn.disabled = true
    resultParagraph.textContent = ""
    testParagraph.textContent = ""
    recordingStatus.classList.remove("show")
}

//MODAL
const btnInfo = qs(".btn-info")
const modal = qs("dialog")
const btnCloseModal = qs(".close-modal")

btnInfo.addEventListener("click", () => {
    modal.showModal()
})
btnCloseModal.addEventListener("click", () => {
    modal.close()
})

// DIFFICULTY FORM
const difficultyForm = qs("[data-form='difficulty']")
const difficultyInputs = qsa("input", difficultyForm)

difficultyInputs.forEach(input => {
    input.addEventListener("click", e => {
        selectedDifficulty = e.target.value.toLocaleUpperCase()
        resetButtons()
    })
})

//LANGUAGE FORM
const languageForm = qs("[data-form='language']")
const languageInputs = qsa("input", languageForm)

languageInputs.forEach(input => {
    input.addEventListener("click", e => {
        selectedLanguage = e.target.value.toLocaleUpperCase()
        recognition.lang = languageCodes[selectedLanguage]
    })
})

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition

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

const startRecordBtn = qs("[data-button='record']")
const newSentenceBtn = qs("[data-button='new sentence']")
const resultParagraph = qs("[data-paragraph='output']")
const testParagraph = qs("[data-paragraph='test sentence']")
const recordingStatus = qs(".status")
const editBtn = qs("[data-button='edit']")

editBtn.addEventListener("click", () => {
    recordingStatus.classList.remove("show", "animate-waves")
    testParagraph.contentEditable = true
    testParagraph.focus()
    setCaret()
})

function setCaret() {
    const text = testParagraph.childNodes[0]
    if(!text) return
    const range = document.createRange()
    const sel = window.getSelection()

    range.setStart(text, text.length)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
}

testParagraph.addEventListener("keypress", e => {
    if (e.keyCode === 13) {
        testParagraph.contentEditable = false
    }
})
testParagraph.addEventListener("focusout", () => {
    testParagraph.contentEditable = false
    resultParagraph.textContent = ""
    startRecordBtn.disabled = false
    startRecordBtn.focus()
})

newSentenceBtn.addEventListener("click", () => {
    sentencesArray = languageObjects[selectedLanguage][selectedDifficulty]
    let sentence =
        sentencesArray[Math.floor(Math.random() * sentencesArray.length)]
    resultParagraph.textContent = ""
    startRecordBtn.disabled = false
    testParagraph.textContent = sentence
    recordingStatus.classList.remove("show")
})

startRecordBtn.addEventListener("click", () => {
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
    if (
        !resultParagraph.classList.contains("success") &&
        !resultParagraph.classList.contains("error")
    )
        recordingStatus.classList.add("show")
    startRecordBtn.disabled = true
}

recognition.onresult = function (event) {
    let testString = testParagraph.textContent
        .toLocaleLowerCase()
        .replace(/[.,/#!$%^&*;:{}=-_~()]/g, "")
        .replace(/\s{2}/g, " ")
    let result = event.results[0][0].transcript.toLocaleLowerCase()
    let success = result.trim() === testString.trim()
    resultParagraph.textContent = capitalizeFirstLetter(
        result.replace(/(^|\W)i('?\s+)/gm, `$1I$2`)
    )
    resultParagraph.classList.add(success ? "success" : "error")
    setTimeout(() => {
        startRecordBtn.disabled = false
        recordingStatus.classList.remove("show")
    }, 100)
}
