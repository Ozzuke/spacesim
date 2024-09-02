import { useDataTracker, useStateTracker } from '@/logic/states.js'
import { Vec } from '@/logic/math.js'

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
  data.value.mouse.inWindow = false
}

export const onMouseEnter = () => {
  data.value.mouse.inWindow = true
}
