"use strict";
import { DEFAULT_CONTENT_URL, DEFAULT_NUMBER, DISPLAY_NAME_FOR_DEFAULT_NUMBER } from "../shared/constants";
import { loadStorageData } from "../shared/storage";
let tempResult = [];
let contentUrl = DEFAULT_CONTENT_URL;
const areAllNumbersEntered = () => tempResult.every((number) => number >= 0);
const composeResultText = () => tempResult.map((number) => (number == DEFAULT_NUMBER ? DISPLAY_NAME_FOR_DEFAULT_NUMBER : number)).join("");
const updateDisplayedResult = () => {
    var resultElement = document.getElementById("muf-result");
    resultElement.textContent = composeResultText();
};
const handleCellClick = (e) => {
    const { cellIndex, innerText } = e.target;
    tempResult[cellIndex] = Number(innerText);
    updateDisplayedResult();
    if (areAllNumbersEntered()) {
        chrome.tabs.create({
            url: `${contentUrl}${tempResult.join("")}`,
        });
    }
};
const initialize = () => {
    loadStorageData().then((items) => {
        var table = document.getElementById("muf-options-table");
        tempResult = [...items.numbers];
        contentUrl = items.contentUrl;
        if (table && table.rows) {
            items.numbers.forEach((number, index) => {
                if (number >= 0
                    && table.rows[number]
                    && table.rows[number].cells[index]) {
                    table.rows[number].cells[index].classList.add("selected");
                }
            });
        }
        updateDisplayedResult();
    });
};
document.addEventListener("DOMContentLoaded", () => {
    initialize();
    var cells = document.querySelectorAll("td");
    cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
});
