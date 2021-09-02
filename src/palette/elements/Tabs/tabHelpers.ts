import { Dispatch, SetStateAction } from "react"
import Animated, { Easing } from "react-native-reanimated"

export type TabsType = Array<{
  label: string
  completed?: boolean
}>

export interface TabsProps {
  setActiveTab: Dispatch<SetStateAction<number>>
  activeTab: number
  tabs: TabsType
}

export const timingFunction = () => {
  const { Value, set, cond, startClock, clockRunning, timing, block, Clock } = Animated
  const clock = new Clock()
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  }

  const config = {
    duration: 300,
    toValue: new Value(1),
    easing: Easing.linear,
  }

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, 1)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, 0),
        set(state.frameTime, 0),
        set(config.toValue, 1),
        startClock(clock),
      ]
    ),
    timing(clock, state, config),
    state.position,
  ])
}
