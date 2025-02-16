import { DEFAULT_CONTENT_URL, ROWS_COUNT, DEFAULT_NUMBER } from "../shared/constants.js";

export const loadStoredData = (defaults = { contentUrl: DEFAULT_CONTENT_URL, numbers: Array(ROWS_COUNT).fill(DEFAULT_NUMBER) }) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(defaults, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
};