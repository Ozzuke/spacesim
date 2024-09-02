import { stateChangeEvents, useDataTracker, useStateTracker } from '@/logic/states.js'
import { pauseGame, resetDataAndState, restartGame, resumeGame, setUpGame } from '@/logic/game.js'

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

export const changeState = (newState) => {
  switch (newState) {
    case stateChangeEvents.START_GAME:
      resetDataAndState()
      setUpGame()
      break
    case stateChangeEvents.PAUSE_GAME:
      pauseGame()
      break
    case stateChangeEvents.RESUME_GAME:
      resumeGame()
      break
    case stateChangeEvents.RESTART_GAME:
      restartGame()
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
}
