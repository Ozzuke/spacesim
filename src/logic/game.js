import { useDataTracker, useStateTracker, gameModes } from '@/logic/states.js'
import { Vec } from '@/logic/math.js'
import { GameMap } from '@/logic/GameMap.js'
import { SpaceObject } from '@/logic/SpaceObject.js'
import { Ship } from '@/logic/Ship.js'
import { applyMouseForce, checkCollisions } from '@/logic/physics.js'
import { renderCanvas } from '@/logic/visual.js'
import { onMouseEnter, onMouseLeave, onMouseMove } from '@/logic/eventHandlers.js'

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

export const setUpGame = () => {
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
  initializeLevel()
}

export const stopGame = () => {
  setVisible([])
  setGameMode()
  data.map = null
}

export const startGame = () => {
  removeGameMode(gameModes.PAUSED)
  if (!isGameMode(gameModes.SETUP && !isGameMode(gameModes.RUNNING))) {
    addGameMode(gameModes.RUNNING)
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
  data.value.objects.push(new SpaceObject({posVec: new Vec(50, 70), velVec: new Vec(1, 2)}))
  data.value.objects.push(new SpaceObject({ posVec: new Vec(-50, 300), density: 50 }))
  data.value.objects.push(new SpaceObject({ posVec: new Vec(150, 180), colors: { fillStyle: 'red', strokeStyle: 'black' }, radius: 50 }))

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

const changeCameraPosition = () => {
  const lockOn = data.value.camera.lockOn
  if (lockOn instanceof Vec) {
    data.value.camera.posVec = lockOn.add(data.value.centerVec)
  } else if (lockOn?.posVec instanceof Vec) {
    data.value.camera.posVec = lockOn.posVec.add(data.value.centerVec)
  }
}

