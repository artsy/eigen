import { StateManager as CountdownStateManager } from "lib/Components/Countdown"
import moment from "moment-timezone"
import React from "react"

interface Props {
  startAt: string
  endAt: string
  formattedOpeningHours?: string
  countdownComponent: React.SFC<CountdownProps>
}

export interface CountdownProps {
  duration: moment.Duration
  label?: string
}

enum TimerState {
  UPCOMING = "UPCOMING",
  CURRENT = "CURRENT",
  PAST = "PAST",
}

// @ts-ignore STRICTNESS_MIGRATION
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

export const CountdownTimer: React.SFC<Props> = (props: Props) => {
  const onState = () => {
    const state = currentState(props)
    // @ts-ignore STRICTNESS_MIGRATION
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
