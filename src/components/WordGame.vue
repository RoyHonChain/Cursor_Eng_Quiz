<template>
  <div class="word-game">
    <Fireworks :show="showFireworks" />
    <div class="dictionary-selector">
      <label for="dictionary">選擇字典：</label>
      <select 
        id="dictionary" 
        v-model="selectedDictionaryId" 
        @change="handleDictionaryChange"
      >
        <option 
          v-for="dict in dictionaries" 
          :key="dict.id" 
          :value="dict.id"
        >
          {{ dict.name }}
        </option>
      </select>
    </div>

    <div v-if="!isGameComplete" class="game-container">
      <div class="progress">
        題目 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
      </div>
      
      <div class="word-container">
        <div class="hint-container">
          <div 
            class="hint-icon" 
            @mouseenter="showHint = true"
            @mouseleave="showHint = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
        </div>
        <div class="word">
          <template v-for="(letter, index) in maskedWord" :key="index">
            <template v-if="letter === '_'">
              <input
                type="text"
                maxlength="1"
                :ref="el => inputRefs[getMaskedIndex(index)] = el"
                v-model="localInputs[getMaskedIndex(index)]"
                @input="handleInput(getMaskedIndex(index), $event)"
                @keydown="handleKeyDown($event, getMaskedIndex(index))"
                :placeholder="showHint ? currentWord.word[index] : ''"
                :class="{ 
                  'correct': isCorrect === true,
                  'incorrect': isCorrect === false
                }"
              />
            </template>
            <span v-else>{{ letter }}</span>
          </template>
        </div>
        <div class="meaning">
          {{ currentWord.meaning }}
        </div>
      </div>
    </div>

    <div v-else class="game-complete">
      <h2>遊戲結束！</h2>
      <p>得分：{{ score }} / {{ totalQuestions }}</p>
      <button @click="resetGame">再玩一次</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import Fireworks from './Fireworks.vue';

interface Word {
  word: string;
  meaning: string;
}

interface Dictionary {
  id: string;
  name: string;
  words: Word[];
}

// 字典數據
const dictionaries: Dictionary[] = [
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

// 遊戲狀態
const selectedDictionaryId = ref(dictionaries[0].id);
const currentDictionary = ref(dictionaries[0]);
const currentWord = ref<Word>({ word: '', meaning: '' });
const maskedWord = ref('');
const maskedPositions = ref<number[]>([]);
const userInput = ref<string[]>([]);
const score = ref(0);
const totalQuestions = ref(10);
const currentQuestionIndex = ref(0);
const isCorrect = ref<boolean | null>(null);

// UI 相關的狀態
const inputRefs = ref<HTMLInputElement[]>([]);
const localInputs = ref<string[]>([]);

// 添加提示相關的狀態
const showHint = ref(false);

// 添加煙火控制狀態
const showFireworks = ref(false);

// 計算屬性
const isGameComplete = computed(() => {
  return currentQuestionIndex.value >= totalQuestions.value;
});

// 方法
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
  const words = currentDictionary.value.words;
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  const { maskedWord: newMaskedWord, maskedPositions: newMaskedPositions } = maskWord(word.word);
  
  currentWord.value = word;
  maskedWord.value = newMaskedWord;
  maskedPositions.value = newMaskedPositions;
  userInput.value = new Array(newMaskedPositions.length).fill('');
  localInputs.value = new Array(newMaskedPositions.length).fill('');
  isCorrect.value = null;

  // 在下一個 tick 後設置焦點到第一個輸入框
  nextTick(() => {
    if (inputRefs.value[0]) {
      inputRefs.value[0].focus();
    }
  });
}

function clearInputs() {
  userInput.value = new Array(maskedPositions.value.length).fill('');
  localInputs.value = new Array(maskedPositions.value.length).fill('');
  // 在下一個 tick 後設置焦點到第一個輸入框
  nextTick(() => {
    if (inputRefs.value[0]) {
      inputRefs.value[0].focus();
    }
  });
}

function handleDictionaryChange() {
  const newDictionary = dictionaries.find(d => d.id === selectedDictionaryId.value);
  if (newDictionary) {
    currentDictionary.value = newDictionary;
    resetGame();
  }
}

function getMaskedIndex(index: number): number {
  return maskedPositions.value.findIndex(pos => pos === index);
}

function handleInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value.toLowerCase();
  
  if (value) {
    userInput.value[index] = value;
    
    const isComplete = userInput.value.every(input => input !== '');
    if (isComplete) {
      const isAnswerCorrect = maskedPositions.value.every((pos, idx) => 
        currentWord.value.word[pos].toLowerCase() === userInput.value[idx]
      );

      isCorrect.value = isAnswerCorrect;
      if (isAnswerCorrect) {
        score.value++;
        showFireworks.value = true;
        // 等待 0.3 秒後再進入下一題
        setTimeout(() => {
          currentQuestionIndex.value++;
          if (!isGameComplete.value) {
            getNextWord();
          }
        }, 300);
      } else {
        setTimeout(() => {
          clearInputs();
        }, 300);
      }
    } else if (index < maskedPositions.value.length - 1) {
      inputRefs.value[index + 1]?.focus();
    }
  }
}

function handleKeyDown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace' && index > 0 && !localInputs.value[index]) {
    event.preventDefault();
    inputRefs.value[index - 1]?.focus();
  }
}

function resetGame() {
  score.value = 0;
  currentQuestionIndex.value = 0;
  getNextWord();
}

// 初始化
onMounted(() => {
  resetGame();
});
</script>

<style scoped>
.word-game {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #2d2d2d;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.dictionary-selector {
  margin-bottom: 20px;
}

.dictionary-selector select {
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 16px;
  background-color: #3d3d3d;
  color: #ffffff;
  border: 1px solid #4d4d4d;
  border-radius: 4px;
}

.dictionary-selector label {
  color: #ffffff;
}

.game-container {
  text-align: center;
}

.progress {
  margin-bottom: 20px;
  font-size: 18px;
  color: #ffffff;
}

.word-container {
  position: relative;
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.hint-container {
  position: absolute;
  top: 10px;
  right: 10px;
}

.hint-icon {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.hint-icon:hover {
  opacity: 1;
}

.word {
  font-size: 32px;
  letter-spacing: 5px;
  margin-bottom: 10px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.word span {
  display: inline-block;
  vertical-align: middle;
}

.meaning {
  font-size: 24px;
  color: #cccccc;
  margin-top: 10px;
}

input[type="text"] {
  width: 40px;
  height: 40px;
  margin: 0 2px;
  text-align: center;
  border: 2px solid #4a4a4a;
  border-radius: 4px;
  background-color: #333;
  color: #fff;
  font-size: 32px;
  padding: 0;
  vertical-align: baseline;
}

input[type="text"]::placeholder {
  color: #666;
  font-size: 32px;
}

/* 當 showHint 為 true 時顯示答案 */
.hint-icon:hover ~ .word input[type="text"]::placeholder {
  content: attr(data-answer);
  color: #666;
}

input:focus {
  outline: none;
  border-color: #007bff;
  background-color: #3d3d3d;
}

input.correct {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
  transition: all 0.3s ease;
}

input.incorrect {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
  transition: all 0.3s ease;
}

.game-complete {
  text-align: center;
  margin-top: 40px;
  color: #ffffff;
}

.game-complete button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.game-complete button:hover {
  background-color: #0056b3;
}
</style> 