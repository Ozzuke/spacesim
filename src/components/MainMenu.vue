<template>
  <div id="mainMenu" class="menu">
    <h1>MAIN MENU</h1>
    <button @click="$emit('changeState', stateChangeEvents.START_GAME)">START GAME</button>
    <button @click="$emit('changeState', stateChangeEvents.SETTINGS)">SETTINGS</button>
    <button @click="$emit('changeState', stateChangeEvents.HELP)">HELP</button>
    <button @click="$emit('changeState', stateChangeEvents.CREDITS)">CREDITS</button>
  </div>
</template>


<script setup>

import { stateChangeEvents } from '@/logic/states.js'
</script>


<style scoped>

</style>
