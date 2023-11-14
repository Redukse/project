const fileInput = document.getElementById("fileInput");
const clearFormButton = document.getElementById("clearFormButton");
const fileContent = document.getElementById("fileContent");
const letterCountElement = document.getElementById("letterCount");
const letterCountSpan = letterCountElement.querySelector("span");
const charCountElement = document.getElementById("charCount");
const charCountSpan = charCountElement.querySelector("span");
const nonAlphaNumericCountElement = document.getElementById("nonAlphaNumericCount");
const nonAlphaNumericCountSpan = nonAlphaNumericCountElement.querySelector("span");
const digitCountElement = document.getElementById("digitCount");
const digitCountSpan = digitCountElement.querySelector("span");
const punctuationCountElement = document.getElementById("punctuationCount");
const punctuationCountSpan = punctuationCountElement.querySelector("span");
const specialCharCountElement = document.getElementById("specialCharCount");
const specialCharCountSpan = specialCharCountElement.querySelector("span");
const letterOccurrencesTable = document.getElementById("letterOccurrences");
const letterOccurrencesTableBody = letterOccurrencesTable.querySelector("tbody");

// !Винось меседжи в окремі константи і перевикористовуй їх
const MSG_FILE_NOR_SELECTED = "Файл не було обрано"
const MSG_FILE_NOR_TXT = "Обраний файл не є текстовим файлом (*.txt)"

fileInput.change(() => {
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        if (selectedFile.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = function (event) {

                const fileText: string | ArrayBuffer = event.target.result;
                fileContent.textContent = fileText;

                // Обчислити кількість знаків у тексті
                charCountSpan.textContent = fileText.length.toString();

                // Обчислити кількість букв у тексті
                countResults(fileText, letterCountSpan, /[^A-Za-zА-Яа-яЁё]/g)

                // Обчислити кількість не-буквенних та не-цифрових знаків у тексті
                countResults(fileText, nonAlphaNumericCountSpan, /[A-Za-z0-9А-Яа-яЁё]/g)

                // Обчислити кількість цифр у тексті
                countResults(fileText, digitCountSpan, /[^0-9]/g)

                // Обчислити кількість розділових знаків у тексті
                countResults(fileText, punctuationCountSpan, /[A-Za-z0-9А-Яа-яЁё\s]/g)

                // Обчислити кількість спеціальних символів у тексті
                countResults(fileText, specialCharCountSpan, /[A-Za-z0-9А-Яа-яЁё\s\p{P}]/gu)

                // Обчислити кількість повторень букв та визначити, які саме букви повторюються
                const letterOccurrences = new Map();
                const letterArray = fileText.match(/[A-Za-zА-Яа-яЁё]/g);

                if (letterArray) {
                    letterArray.forEach((letter) => {
                        const normalizedLetter = letter.toLowerCase();
                        if (letterOccurrences.has(normalizedLetter)) {
                            letterOccurrences.set(normalizedLetter, letterOccurrences.get(normalizedLetter) + 1);
                        } else {
                            letterOccurrences.set(normalizedLetter, 1);
                        }
                    });
                }

                // Очистити таблицю перед оновленням
                clearTable()

                // Створити рядок для кожної букви та кількості повторень та вставити їх в таблицю
                const sortedLetterOccurrences = Array.from(letterOccurrences.entries()).sort((a, b) => a[0].localeCompare(b[0]));
                sortedLetterOccurrences.forEach(([letter, count]) => {
                    const row = document.createElement("tr");
                    const letterCell = document.createElement("td");
                    letterCell.textContent = letter;
                    const countCell = document.createElement("td");
                    countCell.textContent = count;
                    row.appendChild(letterCell);
                    row.appendChild(countCell);
                    letterOccurrencesTableBody.appendChild(row);
                });
            };

            reader.readAsText(selectedFile);
        } else {
            // Очистити всі результати і таблицю
            clearResults(MSG_FILE_NOR_TXT)
            clearTable()
        }
    } else {
        // Очистити всі результати і таблицю
        clearResults(MSG_FILE_NOR_SELECTED)
        clearTable()
    }
});

// !Замість прослуховування івентів по типу, можна використовувати onclick()
// Обробник події для кнопки "Очистити форму"
clearFormButton.onclick(() => {
    // Очистіть значення поля вибору файлу
    clearResults()
    clearTable()
    fileInput.value = "";
    fileContent.textContent = MSG_FILE_NOR_SELECTED;
});

// ! Виніс дублюючий код в окрему функцію
function countResults(fileText: string | ArrayBuffer, htmlSpanElement: HTMLSpanElement, regex: String) {
    htmlSpanElement.textContent = fileText.replace(regex, "").length.toString()
}

// ! Виніс дублюючий код в окрему функцію
function clearResults(msg) {
    // Очистити вміст відображення результатів
    charCountSpan.textContent = "0";
    letterCountSpan.textContent = "0";
    nonAlphaNumericCountSpan.textContent = "0";
    digitCountSpan.textContent = "0";
    punctuationCountSpan.textContent = "0";
    specialCharCountSpan.textContent = "0";

    fileContent.textContent = msg;
    fileContent.value = ""
}

// ! Виніс дублюючий код в окрему функцію
function clearTable() {
    // Очистити таблицю з результатами
    while (letterOccurrencesTableBody.firstChild) {
        letterOccurrencesTableBody.removeChild(letterOccurrencesTableBody.firstChild);
    }
}

