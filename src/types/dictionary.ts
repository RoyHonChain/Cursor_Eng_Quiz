export interface Word {
  word: string;
  meaning: string;
}

export interface Dictionary {
  id: string;
  name: string;
  words: Word[];
}

export interface GameState {
  currentWord: Word;
  maskedWord: string;
  maskedPositions: number[];
  userInput: string[];
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  isCorrect: boolean | null;
} 