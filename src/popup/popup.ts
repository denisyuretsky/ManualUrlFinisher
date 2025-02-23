"use strict";

import { DEFAULT_CONTENT_URL, DEFAULT_NUMBER, DISPLAY_NAME_FOR_DEFAULT_NUMBER } from "../shared/constants";
import { loadStorageData, saveStorageData } from "../shared/storage";
import type { OptionNumber, StorageData, HistoryValue, HistoryAction } from "../shared/types";

let tempResult: OptionNumber[] = [];
let contentUrl = DEFAULT_CONTENT_URL;
let tempHistory: Record<number, HistoryValue> = {}

const resultElement = document.getElementById("muf-options-result") as HTMLParagraphElement;
const historyListElement = document.getElementById("muf-history-list") as HTMLUListElement;
const clearAllHistoryElement = document.getElementById("muf-history-clear-all") as HTMLSpanElement;

const composeResultText = (): string =>
  tempResult.map((number) => (number == DEFAULT_NUMBER ? DISPLAY_NAME_FOR_DEFAULT_NUMBER : number)).join("");

const updateDisplayedResult = (): string => {
  const resultText = composeResultText();
  resultElement.textContent = resultText;
  return resultText;
}

const addValueToTempHistory = (key: number): void => {
  const now = Date.now();

  tempHistory[key] = tempHistory[key] ?? { count: 0, timestamp: now };
  tempHistory[key].count++;
  tempHistory[key].timestamp = now;

  // Store only 10 items in the history. Delete the oldest one. 
  const keys: number[] = Object.keys(tempHistory).map(k => Number(k));
  if (keys.length > 10) {
    const oldestKey = keys.reduce((a, b) => (tempHistory[a].timestamp < tempHistory[b].timestamp ? a : b));
    delete tempHistory[oldestKey];
  }
};

const openChromeTab = (value: string): void => {
  chrome.tabs.create({ url: `${contentUrl}${value}` })
    .catch((error: unknown) => {
      console.error("Error while opening a tab:", error);
    });
}

const handleHistory = (action: HistoryAction, value?: string, callBack?: (callBackValue: string) => void): void => {
  switch (action) {
    case "add":
      addValueToTempHistory(Number(value));
      break;
    case "delete":
      if (Object.prototype.hasOwnProperty.call(tempHistory, Number(value))) {
        delete tempHistory[Number(value)];
      }
      break;
    case "clearAll":
      tempHistory = {}
      break;
    default:
      break;
  }

  saveStorageData({ history: tempHistory }).then(() => {
    updateDisplayedHistory();

    if (callBack && typeof value === 'string' && value.length > 0) {
      callBack(value)
    }
  })
    .catch((error: unknown) => {
      console.error("Error while saving storage data:", error);
    });
};


const addClearButton = (li: HTMLLIElement, value: string): void => {
  const clearIcon = document.createElement("span");
  clearIcon.className = "clear-icon";
  clearIcon.innerHTML = "&#128711;"; // HTML of Prohibited Sign
  clearIcon.title = "Delete";

  clearIcon.addEventListener("click", (event: MouseEvent) => {
    event.stopPropagation(); // prevent click on li
    handleHistory("delete", value)
  });

  li.appendChild(clearIcon);
}

const createListItemElement = (key: string, value: HistoryValue): HTMLLIElement => {
  const li = document.createElement("li");
  li.className = "muf-history-item";
  li.textContent = `${key}${value.count > 1 ? ` (${value.count})` : ''}`;

  addClearButton(li, key)

  li.addEventListener("click", () => { handleHistory("add", key, openChromeTab); });
  return li;
}

const updateDisplayedHistory = (): void => {
  historyListElement.innerHTML = '';

  const sortedEntries = Object.entries(tempHistory).sort(([, a], [, b]) => b.timestamp - a.timestamp);
  if (sortedEntries.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  sortedEntries.forEach(([key, value]) => fragment.appendChild(createListItemElement(key, value)));
  historyListElement.appendChild(fragment);
}

const areAllNumbersEntered = (): boolean => tempResult.every((number) => number >= 0);

const handleCellClick = (e: MouseEvent): void => {
  const { cellIndex, innerText } = e.target as HTMLTableCellElement;
  tempResult[cellIndex] = Number(innerText) as OptionNumber;

  const resultText = updateDisplayedResult();

  if (areAllNumbersEntered()) {
    handleHistory("add", resultText, openChromeTab)
  }
}

const initialize = (): void => {
  loadStorageData().then((storageData: StorageData) => {
    const table = document.getElementById("muf-options-table") as HTMLTableElement;

    tempResult = [...storageData.numbers];
    contentUrl = storageData.contentUrl;
    tempHistory = storageData.history;

    storageData.numbers.forEach((number, index) => {
      const cell = table.rows[number]?.cells[index];
      if (number >= 0 && cell) {
        cell.classList.add("selected");
      }
    });

    updateDisplayedResult();
    updateDisplayedHistory();
  })
    .catch((error: unknown) => {
      console.error("Error while loading storage data:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();

  document.querySelectorAll("td").forEach((cell) => { cell.addEventListener("click", handleCellClick); });

  clearAllHistoryElement.addEventListener("click", () => { handleHistory("clearAll"); })
});
