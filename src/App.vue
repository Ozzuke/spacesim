<template>
  <div id="app">
    <GameCanvas v-if="isVisible('gameCanvas')" :state="state" />
    <HUD v-if="isVisible('hud')" />
    <ObjectEditor v-if="isVisible('objectEditor')" />
    <MenuBackground v-if="isVisible('menuBackground')" />
    <MainMenu v-if="isVisible('mainMenu')" @changeState="changeState" />
    <Settings v-if="isVisible('settings')" />
    <UnknownEvent v-if="isVisible('unknownEvent')" @changeState="changeState" />

  </div>
</template>


<script setup>
import { useStateTracker, useDataTracker, stateChangeEvents } from '@/logic/states.js'
import { ref } from 'vue'
import MainMenu from '@/components/MainMenu.vue'
import MenuBackground from '@/components/MenuBackground.vue'
import GameCanvas from '@/components/GameCanvas.vue'
import HUD from '@/components/HUD.vue'
import Settings from '@/components/Settings.vue'
import ObjectEditor from '@/components/ObjectEditor.vue'
import UnknownEvent from '@/components/UnknownEvent.vue'
import { setUpGame } from '@/logic/game.js'

const {
  state,
  isVisible,
  setVisible,
  addVisible,
  removeVisible,
  isGameMode,
  setGameMode,
  addGameMode,
  removeGameMode,
  setAction,
  getAction
} = useStateTracker()
const {
  data
} = useDataTracker()


const changeState = (newState) => {
  console.log('changing state to', newState)
  switch (newState) {
    case stateChangeEvents.START_GAME:
      setUpGame()
      break
    case stateChangeEvents.MAIN_MENU:
      setVisible(['mainMenu', 'menuBackground'])
      break
    case stateChangeEvents.HIDE_UNKNOWN_EVENT:
      removeVisible('unknownEvent')
      break
    default:
      console.error('unknown state', newState)
      addVisible('unknownEvent')
  }
  console.log('state is', state.value)
}

</script>


<style scoped>

</style>
