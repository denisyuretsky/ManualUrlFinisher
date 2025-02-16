"use strict";
import { ROWS_COUNT, DEFAULT_NUMBER } from "../shared/constants";
import { loadStorageData, saveStorageData } from "../shared/storage";
const saveOptions = () => {
    let numbers = [];
    for (var i = 0; i < ROWS_COUNT; i++) {
        let selectElement = document.getElementById(`muf-number-${i}`);
        let parsedNumber = Number(selectElement.value) || DEFAULT_NUMBER;
        numbers.push(parsedNumber);
    }
    let textElement = document.getElementById("muf-url");
    let url = textElement.value.trim();
    saveStorageData({
        contentUrl: url,
        numbers: numbers,
    }).then(() => {
        let statusElement = document.getElementById("muf-status");
        statusElement.textContent = "Options saved.";
        setTimeout(function () {
            statusElement.textContent = "";
        }, 750);
    });
};
const initialize = () => {
    loadStorageData().then((storageData) => {
        storageData.numbers.forEach((value, index) => {
            const selectElement = document.getElementById(`muf-number-${index}`);
            selectElement.value = value.toString();
        });
        let textElement = document.getElementById("muf-url");
        textElement.value = storageData.contentUrl;
    });
};
document.addEventListener("DOMContentLoaded", () => {
    initialize();
    let buttonElement = document.getElementById("muf-save");
    buttonElement.addEventListener("click", saveOptions);
});
