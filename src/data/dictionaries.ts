import { Dictionary } from '../types/dictionary';

export const dictionaries: Dictionary[] = [
  {
    id: 'basic',
    name: '基礎單字',
    words: [
      { word: 'apple', meaning: '蘋果' },
      { word: 'banana', meaning: '香蕉' },
      { word: 'orange', meaning: '橘子' },
      { word: 'computer', meaning: '電腦' },
      { word: 'phone', meaning: '電話' },
      { word: 'book', meaning: '書' },
      { word: 'pencil', meaning: '鉛筆' },
      { word: 'water', meaning: '水' },
      { word: 'house', meaning: '房子' },
      { word: 'table', meaning: '桌子' },
    ],
  },
  {
    id: 'intermediate',
    name: '中級單字',
    words: [
      { word: 'algorithm', meaning: '演算法' },
      { word: 'database', meaning: '資料庫' },
      { word: 'interface', meaning: '介面' },
      { word: 'variable', meaning: '變數' },
      { word: 'function', meaning: '函數' },
      { word: 'network', meaning: '網路' },
      { word: 'security', meaning: '安全性' },
      { word: 'software', meaning: '軟體' },
      { word: 'hardware', meaning: '硬體' },
      { word: 'system', meaning: '系統' },
    ],
  },
]; 