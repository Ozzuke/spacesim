<template>
  <div id="app">
    <GameCanvas v-if="isVisible('gameCanvas')" :state="state" />
    <HUD v-if="isVisible('hud')" />
    <ObjectEditor v-if="isVisible('objectEditor')" />
    <MenuBackground v-if="isVisible('menuBackground')" />
    <MainMenu v-if="isVisible('mainMenu')" @changeState="changeState" />
    <PauseMenu v-if="isVisible('pauseMenu')" @changeState="changeState" />
    <Settings v-if="isVisible('settings')" />
    <UnknownEvent v-if="isVisible('unknownEvent')" @changeState="changeState" />

  </div>
</template>


<script setup>
import { useDataTracker, useStateTracker } from '@/logic/states.js'
import { changeState } from '@/logic/stateChangeHandler.js'
import MainMenu from '@/components/MainMenu.vue'
import MenuBackground from '@/components/MenuBackground.vue'
import GameCanvas from '@/components/GameCanvas.vue'
import HUD from '@/components/HUD.vue'
import Settings from '@/components/Settings.vue'
import ObjectEditor from '@/components/ObjectEditor.vue'
import UnknownEvent from '@/components/UnknownEvent.vue'
import PauseMenu from '@/components/PauseMenu.vue'

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
  getAction,
  resetState
} = useStateTracker()
const {
  data
} = useDataTracker()
</script>


<style scoped>

</style>
