import { DEFAULT_CONTENT_URL, ROWS_COUNT, DEFAULT_NUMBER } from "./constants";
import type { OptionNumber, StorageData } from "../shared/types";

export const loadStorageData = (
  defaults: StorageData = {
    contentUrl: DEFAULT_CONTENT_URL,
    numbers: Array<OptionNumber>(ROWS_COUNT).fill(DEFAULT_NUMBER),
    history: {}
  }): Promise<StorageData> => {
  return new Promise<StorageData>((resolve, reject) => {
    chrome.storage.local.get(defaults, (storageData: StorageData) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      }
      resolve(storageData);
    });
  });
};

export const saveStorageData = (data: Partial<StorageData>): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      }
      resolve();
    });
  });
};