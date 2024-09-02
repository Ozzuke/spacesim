import { useDataTracker, useStateTracker, gameModes, defaultState, defaultData } from '@/logic/states.js'
import { Vec } from '@/logic/math.js'
import { GameMap } from '@/logic/GameMap.js'
import { SpaceObject } from '@/logic/SpaceObject.js'
import { Ship } from '@/logic/Ship.js'
import { applyMouseForce, checkCollisions } from '@/logic/physics.js'
import { renderCanvas } from '@/logic/visual.js'
import { onBlur, onKeyDown, onMouseEnter, onMouseLeave, onMouseMove } from '@/logic/eventHandlers.js'

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

export async function setUpGame() {
  setGameMode([gameModes.SANDBOX, gameModes.PAUSED, gameModes.SETUP, gameModes.CONTROL_SHIP])
  setVisible(['gameCanvas', 'hud'])
  data.value.map = new GameMap({
    type: 'circle',
    radius: 3.0e3,
    center: new Vec(0, 0),
    color: '#000',
    collisionType: {
      default: 'smooth-bounce',
      ship: 'slow'
    }
  })
  data.value.specials.ship = new Ship()
  setAction('onmousemove', onMouseMove)
  setAction('onmouseenter', onMouseEnter)
  setAction('onmouseleave', onMouseLeave)
  setAction('onblur', onBlur)
  setAction('onkeydown', onKeyDown)
  initializeLevel()
  while (!state.value.mounted.canvas) {
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  calcAndSetCenterVec()
  startGame()
}

export const stopGame = () => {
  removeVisible('objectEditor')
  removeVisible('hud')
  removeVisible('gameCanvas')
  setGameMode()
}

export const pauseGame = () => {
  addGameMode(gameModes.PAUSED)
  removeGameMode(gameModes.RUNNING)
  addVisible('menuBackground')
  addVisible('pauseMenu')
}

export const resumeGame = () => {
  removeGameMode(gameModes.PAUSED)
  addGameMode(gameModes.RUNNING)
  removeVisible('menuBackground')
  removeVisible('pauseMenu')
  setFocusOnCanvas()
  loop()
}

export const restartGame = () => {
  stopGame()
  resetDataAndState()
  setUpGame()
}

export const startGame = () => {
  removeGameMode(gameModes.PAUSED)
  if (!isGameMode(gameModes.SETUP && !isGameMode(gameModes.RUNNING))) {
    addGameMode(gameModes.RUNNING)
    setFocusOnCanvas()
    loop()
  } else {
    if (isGameMode(gameModes.SETUP)) {
      console.error('Unable to start game, still in setup mode')
    } else if (isGameMode(gameModes.RUNNING)) {
      console.error('Unable to start game, game already running')
    }
  }
}

export const initializeLevel = () => {
  data.value.objects.push(new SpaceObject({ posVec: new Vec(50, 70), velVec: new Vec(1, 2) }))
  data.value.objects.push(new SpaceObject({ posVec: new Vec(-50, 300), density: 50 }))
  data.value.objects.push(new SpaceObject({
    posVec: new Vec(150, 180),
    colors: { fillStyle: 'red', strokeStyle: 'black' },
    radius: 50
  }))

  data.value.objects.push(data.value.specials.ship)
  data.value.camera.lockOn = data.value.specials.ship
  removeGameMode(gameModes.SETUP)
}

const loop = () => {
  if (isGameMode(gameModes.RUNNING)) {
    if (isGameMode(gameModes.CONTROL_SHIP) && data.value.mouse.isInWindow) {
      applyMouseForce(data.value.specials.ship, data)
    }
    checkCollisions(data)
    data.value.objects.forEach(obj => obj.update())
    changeCameraPosition()
    renderCanvas(data)
    data.value.mouse.isMoved = false
    data.value.frameCount++
    requestAnimationFrame(loop)
  }
}

export const calcAndSetCenterVec = () => {
  data.value.camera.posVec = new Vec(
    -data.value.canvas.width / data.value.devicePixelRatio / 2,
    -data.value.canvas.height / data.value.devicePixelRatio / 2)
  data.value.centerVec = new Vec(data.value.camera.posVec)
}

const changeCameraPosition = () => {
  const lockOn = data.value.camera.lockOn
  if (lockOn instanceof Vec) {
    data.value.camera.posVec = lockOn.add(data.value.centerVec)
  } else if (lockOn?.posVec instanceof Vec) {
    data.value.camera.posVec = lockOn.posVec.add(data.value.centerVec)
  }
}

export const setFocusOnCanvas = () => {
  data.value.canvas.focus()
}

export const resetDataAndState = () => {
  state.value.visible = [...defaultState.visible]
  state.value.gameMode = [...defaultState.gameMode]
  state.value.actions = { ...defaultState.actions }
  data.value.objects = [...defaultData.objects]
  data.value.specials = { ...defaultData.specials }
  data.value.eventQueue = [...defaultData.eventQueue]
  data.value.map = defaultData.map
  data.value.centerVec = defaultData.centerVec
  data.value.frameCount = defaultData.frameCount
  data.value.game = { ...defaultData.game }
  data.value.physics = { ...defaultData.physics }
  data.value.mouse = { ...defaultData.mouse }
  data.value.camera = { ...defaultData.camera }
}
