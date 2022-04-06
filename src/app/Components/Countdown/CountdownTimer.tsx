import { StateManager as CountdownStateManager } from "app/Components/Countdown"
import { Duration } from "moment"
import React from "react"

interface Props {
  startAt: string
  endAt: string
  formattedOpeningHours?: string
  countdownComponent: React.FC<CountdownTimerProps>
}

export interface CountdownTimerProps {
  duration: Duration
  label?: string
}

enum TimerState {
  UPCOMING = "UPCOMING",
  CURRENT = "CURRENT",
  PAST = "PAST",
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
function relevantStateData(state, { startAt, endAt, formattedOpeningHours = "" }: Props) {
  switch (state) {
    case TimerState.UPCOMING:
      return {
        date: startAt,
        label: formattedOpeningHours,
      }
    case TimerState.CURRENT:
      return {
        date: endAt,
        label: formattedOpeningHours,
      }
    case TimerState.PAST:
      return {
        date: null,
        label: formattedOpeningHours,
      }
  }
}

function currentState({ startAt, endAt }: Props) {
  if (Date.parse(startAt) > Date.now()) {
    return TimerState.UPCOMING
  } else if (Date.parse(endAt) > Date.now()) {
    return TimerState.CURRENT
  } else {
    return TimerState.PAST
  }
}

export const CountdownTimer: React.FC<Props> = (props: Props) => {
  const onState = () => {
    const state = currentState(props)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const { label, date } = relevantStateData(state, props)
    return { state, label, date }
  }
  return (
    <CountdownStateManager
      CountdownComponent={props.countdownComponent}
      onCurrentTickerState={onState}
      onNextTickerState={onState}
    />
  )
}
