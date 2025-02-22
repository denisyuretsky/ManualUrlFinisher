export type OptionNumber = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type HistoryAction = 'add' | 'clearAll' | 'delete';

export interface HistoryValue {
  count: number;
  timestamp: number;
}

export interface StorageData {
  contentUrl: string;
  numbers: OptionNumber[];
  history: Record<number, HistoryValue>;
}
