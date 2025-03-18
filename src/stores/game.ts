import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Word, Dictionary, GameState } from '../types/dictionary';
import { dictionaries } from '../data/dictionaries';

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState>({
    currentWord: { word: '', meaning: '' },
    maskedWord: '',
    maskedPositions: [],
    userInput: [],
    score: 0,
    totalQuestions: 10,
    currentQuestionIndex: 0,
    isCorrect: null,
  });

  const selectedDictionary = ref<Dictionary>(dictionaries[0]);

  const isGameComplete = computed(() => {
    return state.value.currentQuestionIndex >= state.value.totalQuestions;
  });

  function selectDictionary(dictionaryId: string) {
    const dictionary = dictionaries.find(d => d.id === dictionaryId);
    if (dictionary) {
      selectedDictionary.value = dictionary;
      resetGame();
    }
  }

  function maskWord(word: string): { maskedWord: string; maskedPositions: number[] } {
    const positions: number[] = [];
    const letters = word.split('');
    const maskCount = Math.floor(word.length * 0.5);
    
    while (positions.length < maskCount) {
      const pos = Math.floor(Math.random() * word.length);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    
    positions.sort((a, b) => a - b);
    const maskedLetters = letters.map((letter, index) => 
      positions.includes(index) ? '_' : letter
    );
    
    return {
      maskedWord: maskedLetters.join(''),
      maskedPositions: positions,
    };
  }

  function getNextWord() {
    const words = selectedDictionary.value.words;
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];
    const { maskedWord, maskedPositions } = maskWord(word.word);
    
    state.value.currentWord = word;
    state.value.maskedWord = maskedWord;
    state.value.maskedPositions = maskedPositions;
    state.value.userInput = new Array(maskedPositions.length).fill('');
    state.value.isCorrect = null;
  }

  function checkAnswer(inputIndex: number, value: string) {
    if (state.value.isCorrect !== null) return;
    
    state.value.userInput[inputIndex] = value.toLowerCase();
    
    const isComplete = state.value.userInput.every(input => input !== '');
    if (!isComplete) return;

    const isCorrect = state.value.maskedPositions.every((pos, index) => 
      state.value.currentWord.word[pos].toLowerCase() === state.value.userInput[index]
    );

    state.value.isCorrect = isCorrect;
    if (isCorrect) {
      state.value.score++;
      setTimeout(() => {
        state.value.currentQuestionIndex++;
        if (!isGameComplete.value) {
          getNextWord();
        }
      }, 300);
    } else {
      setTimeout(() => {
        state.value.userInput = new Array(state.value.maskedPositions.length).fill('');
      }, 300);
    }
  }

  function resetGame() {
    state.value = {
      currentWord: { word: '', meaning: '' },
      maskedWord: '',
      maskedPositions: [],
      userInput: [],
      score: 0,
      totalQuestions: 10,
      currentQuestionIndex: 0,
      isCorrect: null,
    };
    getNextWord();
  }

  return {
    state,
    selectedDictionary,
    isGameComplete,
    selectDictionary,
    checkAnswer,
    resetGame,
  };
}); 