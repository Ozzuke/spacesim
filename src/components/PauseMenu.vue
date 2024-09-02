<template>
  <div id="pauseMenu" class="menu">
    <h1>Paused</h1>
    <button @click="$emit('changeState', stateChangeEvents.RESUME_GAME)">RESUME</button>
    <button @click="$emit('changeState', stateChangeEvents.RESTART_GAME)">RESTART</button>
    <button @click="$emit('changeState', stateChangeEvents.SETTINGS)">SETTINGS</button>
    <button @click="$emit('changeState', stateChangeEvents.MAIN_MENU)">MAIN MENU</button>
  </div>
</template>


<script setup>

import { stateChangeEvents } from '@/logic/states.js'
</script>


<style scoped>

</style>
