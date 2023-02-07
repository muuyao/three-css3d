<template>
  <div class="page" :class="{ 'is-full': isFull }">
    <div class="page-model" ref="container"></div>
  </div>
  <button class="full-btn" @click="isFull = !isFull">切换全屏</button>
  <div class="board-container">
    <div class="board-info">test position<br />123</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useThree } from './useThree';

const isFull = ref(false);
const container = ref<HTMLElement | null>(null);

useThree(container);
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.page {
  width: 100%;
  height: 100vh;
  display: flex;
  padding: 15px 34px 27px;
}

.page.is-full {
  padding: 0;
}

.page-model {
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: #033258;
  position: relative;
}

.board-container {
  display: none;
}

.board-info {
  background: red;
}

.board {
  font-size: 12px;
  color: #fff;
  text-align: center;
}

.full-btn {
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  background-color: green;
  z-index: 999;
}
</style>
