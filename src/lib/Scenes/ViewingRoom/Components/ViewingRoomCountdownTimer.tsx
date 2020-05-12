import { CountdownProps } from "lib/Components/Bidding/Components/Timer"
import { SimpleTicker, StateManager as CountdownStateManager } from "lib/Components/Countdown"
import React from "react"

interface Props {
  startAt: string
  endAt: string
}

enum ViewingRoomTimerState {
  UPCOMING = "UPCOMING",
  CURRENT = "CURRENT",
  PAST = "PAST",
}

function relevantStateData(state, { startAt, endAt }: Props) {
  switch (state) {
    case ViewingRoomTimerState.UPCOMING:
      return {
        date: startAt,
      }
    case ViewingRoomTimerState.CURRENT:
      return {
        date: endAt,
      }
    case ViewingRoomTimerState.PAST:
      return {
        date: null,
      }
  }
}

function currentState({ startAt, endAt }: Props) {
  if (Date.parse(startAt) > Date.now()) {
    return ViewingRoomTimerState.UPCOMING
  } else if (Date.parse(endAt) > Date.now()) {
    return ViewingRoomTimerState.CURRENT
  } else {
    return ViewingRoomTimerState.PAST
  }
}

const CountdownText: React.SFC<CountdownProps> = ({ duration }) => (
  <SimpleTicker duration={duration} separator="  " size="2" weight="medium" color="white100" />
)

export const ViewingRoomCountdownTimer: React.SFC<Props> = (props: Props) => {
  const onState = () => {
    const state = currentState(props)
    // @ts-ignore STRICTNESS_MIGRATION
    const { label, date } = relevantStateData(state, props)
    return { state, label, date }
  }
  return (
    <CountdownStateManager
      CountdownComponent={CountdownText}
      onCurrentTickerState={onState}
      onNextTickerState={onState}
    />
  )
}
