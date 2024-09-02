import { ref } from 'vue'
import { Vec } from '@/logic/math.js'

export const defaultState = {
  visible: ['menuBackground', 'mainMenu'],
  gameMode: [],
  mounted: {
    canvas: false,
    hud: false,
    objectEditor: false
  },
  actions: {
    onmousemove: null,
    onclick: null,
    onmousedown: null,
    onmouseup: null,
    onmouseleave: null,
    onmouseenter: null,
    onwheel: null,
    onkeydown: null,
    onblur: null,
    onfocus: null
  }
}
const state = ref(structuredClone(defaultState))


export function useStateTracker() {
  const isVisible = (name) => {
    return state.value.visible.includes(name)
  }
  const setVisible = (show) => {
    if (!show) {
      state.value.visible = []
    } else if (typeof show === 'string') {
      state.value.visible = [show]
    } else {
      state.value.visible = show
    }
  }
  const addVisible = (name) => {
    if (!state.value.visible.includes(name)) {
      state.value.visible.push(name)
    }
  }
  const removeVisible = (name) => {
    if (state.value.visible.includes(name)) {
      state.value.visible = state.value.visible.filter((item) => item !== name)
    }
  }
  const isGameMode = (name) => {
    return state.value.gameMode.includes(name)
  }
  const setGameMode = (mode) => {
    if (!mode) {
      state.value.gameMode = []
    } else if (mode instanceof Array) {
      state.value.gameMode = mode
    } else {
      state.value.gameMode = [mode]
    }
  }
  const addGameMode = (name) => {
    if (!state.value.gameMode.includes(name)) {
      state.value.gameMode.push(name)
    }
  }
  const removeGameMode = (name) => {
    if (state.value.gameMode.includes(name)) {
      state.value.gameMode = state.value.gameMode.filter((item) => item !== name)
    }
  }
  const setAction = (name, action) => {
    state.value.actions[name] = action
  }
  const getAction = (name) => {
    return state.value.actions[name]
  }

  return {
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
  }
}

export const defaultData = {
  objects: [],
  specials: {
    ship: null
  },
  canvas: null,
  ctx: null,
  eventQueue: [],
  map: null,
  centerVec: new Vec(0, 0),
  devicePixelRatio: 1,
  frameCount: 0,
  game: {
    score: 0,
    level: 0,
    lives: 1,
    isPaused: false
  },
  physics: {
    gravity: 2.0e-3,
    collisionDamping: 0.01,
    mapCollisionDamping: 0.01,
    mouseForceMultiplier: 40,
    maxMouseDistance: 500,
    mapOutwardForce: 1.0e4,
    mapSlowingForce: 2.0e-2
  },
  mouse: {
    posVec: new Vec(0, 0),
    forceVec: new Vec(0, 0),
    isMoved: false,
    isInWindow: true,
    isDown: false,
    isDrag: false,
    dragStartVec: null
  },
  camera: {
    posVec: new Vec(0, 0),
    prevPosVec: new Vec(0, 0),
    zoom: 1.0,
    lockOn: null
  }
}

const data = ref({ ...defaultData })
data.value.objects = [...defaultData.objects]
data.value.eventQueue = [...defaultData.eventQueue]

export function useDataTracker() {
  return {
    data
  }
}

export const stateChangeEvents = {
  START_GAME: 'START_GAME',
  MAIN_MENU: 'MAIN_MENU',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  RESTART_GAME: 'RESTART_GAME',
  SETTINGS: 'SETTINGS',
  HELP: 'HELP',
  CREDITS: 'CREDITS',
  UNKNOWN_EVENT: 'UNKNOWN_EVENT',
  HIDE_UNKNOWN_EVENT: 'HIDE_UNKNOWN_EVENT'
}

export const gameModes = {
  SETUP: 'SETUP',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  CONTROL_SHIP: 'CONTROL_SHIP',
  SANDBOX: 'SANDBOX'
}
