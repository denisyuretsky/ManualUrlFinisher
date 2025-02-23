"use strict";

import { ROWS_COUNT, DEFAULT_NUMBER, OPTIONS_SAVED_DELAY_IN_MS } from "../shared/constants";
import { loadStorageData, saveStorageData } from "../shared/storage";
import type { StorageData, OptionNumber } from "../shared/types";

const handleSubmit = (event: Readonly<SubmitEvent>): void => {
  event.preventDefault();
  const numbers: OptionNumber[] = [];

  for (let i = 0; i < ROWS_COUNT; i++) {
    const selectElement = document.getElementById(`muf-number-${i}`) as HTMLSelectElement
    const value = Number(selectElement.value);
    const parsedNumber: number = isNaN(value) ? DEFAULT_NUMBER : value;
    numbers.push(parsedNumber as OptionNumber);
  }

  const textElement = document.getElementById("muf-url") as HTMLInputElement
  const url: string = textElement.value.trim();

  saveStorageData({
    contentUrl: url,
    numbers: numbers,
  }).then(() => {
    const statusElement = document.getElementById("muf-status") as HTMLParagraphElement;
    statusElement.textContent = "Options saved.";
    setTimeout(function () {
      statusElement.textContent = "";
    }, OPTIONS_SAVED_DELAY_IN_MS);
  })
    .catch((error: Error) => {
      console.error("Error while saving storage data:", error);
    });
};

const initialize = (): void => {
  loadStorageData().then((storageData: Readonly<StorageData>) => {
    storageData.numbers.forEach((value, index) => {
      const selectElement = document.getElementById(`muf-number-${index}`) as HTMLSelectElement;
      selectElement.value = value.toString();
    });

    const textElement = document.getElementById("muf-url") as HTMLInputElement
    textElement.value = storageData.contentUrl;
  })
    .catch((error: Error) => {
      console.error("Error while loading storage data:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();
  const formElement = document.getElementById('muf-form') as HTMLFormElement
  formElement.addEventListener('submit', handleSubmit);
});
