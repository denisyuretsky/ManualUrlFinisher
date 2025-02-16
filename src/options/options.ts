"use strict";

import { ROWS_COUNT, DEFAULT_NUMBER } from "../shared/constants";
import { loadStorageData, saveStorageData } from "../shared/storage";
import { StorageData, OptionNumber } from "../shared/types";

const saveOptions = () => {
  let numbers: OptionNumber[] = [];

  for (var i = 0; i < ROWS_COUNT; i++) {
    let selectElement = document.getElementById(`muf-number-${i}`) as HTMLSelectElement
    let parsedNumber: number = Number(selectElement.value) || DEFAULT_NUMBER
    numbers.push(parsedNumber as OptionNumber);
  }

  let textElement = document.getElementById("muf-url") as HTMLInputElement
  let url: string = textElement.value.trim();

  saveStorageData( {
    contentUrl: url,
    numbers: numbers,
  }).then(() => {
    let statusElement = document.getElementById("muf-status") as HTMLParagraphElement;
    statusElement.textContent = "Options saved.";
    setTimeout(function () {
      statusElement.textContent = "";
    }, 750);
  })
};

const initialize = () => {
  loadStorageData().then((storageData: StorageData) => {
    storageData.numbers.forEach((value, index) => {
      const selectElement = document.getElementById(`muf-number-${index}`) as HTMLSelectElement;
      selectElement.value = value.toString();
    });

    let textElement = document.getElementById("muf-url") as HTMLInputElement
    textElement.value = storageData.contentUrl;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();
  let buttonElement = document.getElementById("muf-save") as HTMLButtonElement
  buttonElement.addEventListener("click", saveOptions);
});
