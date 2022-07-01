import { ENGLISH_SENTENCES } from "./english-sentences.js"
import { FRENCH_SENTENCES } from "./french-sentences.js"
import { SPANISH_SENTENCES } from "./spanish-sentences.js"
import {
    qs,
    qsa,
    capitalizeFirstLetter,
    removePunctuation,
} from "./js-utility-funcs.js"

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
        window.SpeechRecognition || webkitSpeechRecognition

    const recognition = new SpeechRecognition()

    const languageCodes = {
        ENGLISH: "en-US",
        SPANISH: "es-LA",
        FRENCH: "fr_FR",
    }

    const languageObjects = {
        ENGLISH: ENGLISH_SENTENCES,
        FRENCH: FRENCH_SENTENCES,
        SPANISH: SPANISH_SENTENCES,
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
    const startRecordBtn = qs("[data-button='record']")
    const newSentenceBtn = qs("[data-button='new sentence']")
    const resultParagraph = qs("[data-paragraph='output']")
    const testParagraph = qs("[data-paragraph='test sentence']")
    const recordingStatus = qs(".status")
    const editBtn = qs("[data-button='edit']")
    const speakBtn = qs("[data-button='speak']")

    languageInputs.forEach(input => {
        input.addEventListener("click", e => {
            selectedLanguage = e.target.value.toLocaleUpperCase()
            recognition.lang = languageCodes[selectedLanguage]
        })
    })

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

    editBtn.addEventListener("click", () => {
        recordingStatus.classList.remove("show", "animate-waves")
        testParagraph.contentEditable = true
        testParagraph.focus()
        setCaret()
    })

    speakBtn.addEventListener("click", () => {
        let sentenceToSpeak = testParagraph.textContent
        const utterance = new SpeechSynthesisUtterance(sentenceToSpeak)
        utterance.lang = languageCodes[selectedLanguage]
        speechSynthesis.speak(utterance)
    })

    function setCaret() {
        const text = testParagraph.childNodes[0]
        if (!text) return
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
            resultParagraph.classList.add("aborted")
        } else {
            recognition.start()
            resultParagraph.classList.remove("aborted")
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

        setTimeout(() => {
            if (
                resultParagraph.classList.contains("success") ||
                resultParagraph.classList.contains("error") ||
                resultParagraph.classList.contains("aborted")
            )
                return
            recordingStatus.classList.add("show")
            startRecordBtn.disabled = true
        }, 500)
    }

    recognition.onresult = function (event) {
        let testString = removePunctuation(testParagraph.textContent)

        let result = removePunctuation(event.results[0][0].transcript)

        let success =
            result.toLocaleLowerCase() === testString.toLocaleLowerCase()
        resultParagraph.textContent = capitalizeFirstLetter(
            result.replace(/(^|\W)i('?\s+)/gm, `$1I$2`)
        )
        resultParagraph.classList.add(success ? "success" : "error")

        startRecordBtn.disabled = false
        recordingStatus.classList.remove("show")
    }
} else {
    let body = qs("body")
    body.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation"></i>
    <h1 >Oops!</h1>
    <p >I'm sorry but it looks like your browser does not support the functionality of this site.</p>
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#browser_compatibility" target="_blank"
    >Check Browser Support</a>
    `

    body.classList.add("body--error")
}
