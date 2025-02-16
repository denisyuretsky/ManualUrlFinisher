import { DEFAULT_CONTENT_URL, ROWS_COUNT, DEFAULT_NUMBER } from "./constants";
export const loadStorageData = (defaults = {
    contentUrl: DEFAULT_CONTENT_URL,
    numbers: Array(ROWS_COUNT).fill(DEFAULT_NUMBER)
}) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(defaults, (storageData) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(storageData);
        });
    });
};
export const saveStorageData = (data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(data, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
};
