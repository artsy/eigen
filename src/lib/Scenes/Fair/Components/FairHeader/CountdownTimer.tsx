import { Flex, Sans, Spacer } from "@artsy/palette"
import { LabeledTicker, StateManager as CountdownStateManager } from "lib/Components/Countdown"
import moment from "moment"
import React from "react"

interface Props {
  startAt: string
  endAt: string
  formattedOpeningHours: string
}

enum FairTimerState {
  UPCOMING = "UPCOMING",
  CURRENT = "CURRENT",
  PAST = "PAST",
}

function currentDateToUse({ startAt, endAt }: Props) {
  if (Date.parse(startAt) > Date.now()) {
    return startAt
  } else if (Date.parse(endAt) > Date.now()) {
    return endAt
  } else {
    return null
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
  formattedOpeningHours: string
}

const CountdownText: React.SFC<CountdownTextProps> = ({ duration, formattedOpeningHours }) =>
  formattedOpeningHours !== "Closed" && (
    <Flex justifyContent="center" alignItems="center">
      <LabeledTicker
        renderSeparator={() => <Spacer mr={0.5} />}
        textProps={{ color: "white", size: "3t" }}
        duration={duration}
      />
      <Sans size="1" color="white">
        {formattedOpeningHours}
      </Sans>
    </Flex>
  )

export const CountdownTimer: React.SFC<Props> = (props: Props) => {
  const onState = () => {
    const state = currentState(props)
    const date = currentDateToUse(props)
    return { state, date }
  }
  return (
    <CountdownStateManager
      CountdownComponent={CountdownText}
      onCurrentTickerState={onState}
      onNextTickerState={onState}
    />
  )
}
