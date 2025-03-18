<script setup lang="ts">
import WordGame from './components/WordGame.vue'
</script>

<template>
  <div class="app">
    <div class="container">
      <h1>英文單字練習</h1>
      <WordGame />
    </div>
  </div>
</template>

<style>
#app {
  width: 100%;
  display: flex;
  justify-content: center;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 800px;
}

h1 {
  text-align: center;
  color: #ffffff;
  margin-bottom: 30px;
}
</style>
