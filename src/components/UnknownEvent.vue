<template>
  <div id="screen-cover" @click="$emit('changeState', stateChangeEvents.HIDE_UNKNOWN_EVENT)">
    <div id="error" class="menu">
      <h1>Error</h1>
      <p>Something went wrong. Please try again later.</p>
      <button @click="$emit('changeState', stateChangeEvents.HIDE_UNKNOWN_EVENT)">OKAY</button>
    </div>
  </div>
</template>


<script setup>

import { stateChangeEvents } from '@/logic/states.js'
</script>


<style scoped>
#error {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80%;
  max-width: 800px;
  height: 40%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  color: white;
  font-family: 'Press Start 2P', cursive;
}

#error p {
  color: var(--primary);
  font-size: 1.5em;
}

#screen-cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
