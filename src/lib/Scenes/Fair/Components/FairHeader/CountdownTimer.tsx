import { Flex, Sans, Spacer } from "@artsy/palette"
import { LabeledTicker, StateManager as CountdownStateManager } from "lib/Components/Countdown"
import moment from "moment"
import React from "react"

interface Props {
  startAt: string
  endAt: string
}

enum FairTimerState {
  UPCOMING = "UPCOMING",
  CURRENT = "CURRENT",
  PAST = "PAST",
}

function relevantStateData(state, { startAt, endAt }: Props) {
  switch (state) {
    case FairTimerState.UPCOMING:
      return {
        date: startAt,
        label: "Opening in",
      }
    case FairTimerState.CURRENT:
      return {
        date: endAt,
        label: "Closes in",
      }
    case FairTimerState.PAST:
      return {
        date: null,
        label: "Closed",
      }
  }
}

function currentState({ startAt, endAt }: Props) {
  if (Date.parse(startAt) > Date.now()) {
    return FairTimerState.UPCOMING
  } else if (Date.parse(endAt) > Date.now()) {
    return FairTimerState.CURRENT
  } else {
    return FairTimerState.PAST
  }
}

interface CountdownTextProps {
  duration: moment.Duration
  label: string
}

const CountdownText: React.SFC<CountdownTextProps> = ({ duration, label }) =>
  label !== "Closed" && (
    <Flex justifyContent="center" alignItems="center">
      <LabeledTicker
        renderSeparator={() => <Spacer mr={0.5} />}
        textProps={{ color: "white", size: "3t" }}
        duration={duration}
      />
      <Sans size="1" color="white">
        {label}
      </Sans>
    </Flex>
  )

export const CountdownTimer: React.SFC<Props> = (props: Props) => {
  const onState = () => {
    const state = currentState(props)
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
