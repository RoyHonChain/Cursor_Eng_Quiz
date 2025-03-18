<template>
  <div class="fireworks-container" v-if="show">
    <div 
      v-for="(firework, index) in fireworks" 
      :key="index" 
      class="firework"
      :style="firework.style"
    >
      <div class="explosion"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  show: boolean
}>();

const fireworks = ref<Array<{ style: { [key: string]: string } }>>([]);

function createFirework() {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const size = 15 + Math.random() * 25;
  const duration = 0.5 + Math.random() * 0.6;
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

  return {
    style: {
      left: `${x}%`,
      top: `${y}%`,
      '--size': `${size}px`,
      '--duration': `${duration}s`,
      '--color': color
    }
  };
}

function launchFireworks() {
  fireworks.value = [];
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      fireworks.value.push(createFirework());
      if (i === 14) {
        setTimeout(() => {
          for (let j = 0; j < 10; j++) {
            setTimeout(() => {
              fireworks.value.push(createFirework());
            }, j * 50);
          }
          setTimeout(() => {
            if (props.show) {
              props.show = false;
            }
          }, 600);
        }, 200);
      }
    }, i * 80);
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    fireworks.value = [];
    launchFireworks();
  }
});
</script>

<style scoped>
.fireworks-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.firework {
  position: absolute;
  transform: translate(-50%, -50%);
}

.explosion {
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background-color: var(--color);
  animation: explode var(--duration) ease-out forwards;
}

@keyframes explode {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.9;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.firework::before,
.firework::after {
  content: '';
  position: absolute;
  width: 2px;
  height: var(--size);
  background: var(--color);
  animation: spark var(--duration) ease-out forwards;
}

@keyframes spark {
  0% {
    transform: rotate(0deg) scale(0);
  }
  50% {
    transform: rotate(180deg) scale(1);
  }
  100% {
    transform: rotate(360deg) scale(0);
  }
}

.firework::before {
  transform-origin: 50% 100%;
}

.firework::after {
  transform-origin: 50% 0%;
}
</style> 