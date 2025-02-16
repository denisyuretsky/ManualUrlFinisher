import { DEFAULT_CONTENT_URL, ROWS_COUNT, DEFAULT_NUMBER } from "./constants";
import { StorageData } from "../shared/types";

export const loadStorageData = (
    defaults: StorageData = {
        contentUrl: DEFAULT_CONTENT_URL,
        numbers: Array(ROWS_COUNT).fill(DEFAULT_NUMBER)
    }): Promise<StorageData> => {
    return new Promise<StorageData>((resolve, reject) => {
        chrome.storage.sync.get(defaults, (storageData: StorageData) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(storageData);
        });
    });
};

export const saveStorageData = (data: StorageData): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set(data, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  };