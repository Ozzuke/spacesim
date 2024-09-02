import { useDataTracker, useStateTracker } from '@/logic/states.js'
import { Vec } from '@/logic/math.js'
import { pauseGame, resumeGame } from '@/logic/game.js'

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

export const onMouseMove = (e) => {
  const mouseVec = new Vec(e.offsetX, e.offsetY)
  data.value.mouse.posVec = mouseVec.add(data.value.camera.posVec)
  data.value.mouse.isMoved = true
}

export const onMouseLeave = () => {
  data.value.mouse.isInWindow = false
  data.value.mouse.forceVec = new Vec(0, 0)
}

export const onMouseEnter = () => {
  data.value.mouse.isInWindow = true
}

export const onBlur = () => {
  pauseGame()
}

export const onKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (isGameMode('PAUSED')) {
      resumeGame()
    } else {
      pauseGame()
    }
  }
}
