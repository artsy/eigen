import React from "react"
import moment from "moment-timezone"
import { Countdown } from "./Countdown"
import { DurationStateManager } from "lib/Components/Duration/DurationStateManager"
import { TimeOffsetProvider } from "./TimeOffsetProvider"

enum AuctionTimerState {
  PREVIEW = "PREVIEW",
  LIVE_INTEGRATION_UPCOMING = "LIVE_INTEGRATION_UPCOMING",
  LIVE_INTEGRATION_ONGOING = "LIVE_INTEGRATION_ONGOING",
  CLOSING = "CLOSING",
  CLOSED = "CLOSED",
}

interface Props {
  liveStartsAt?: string
  endsAt?: string
  isPreview?: boolean
  isClosed?: boolean
  startsAt?: string
}
function formatDate(date: string) {
  const dateInMoment = moment(date, moment.ISO_8601).tz(moment.tz.guess(true))
  const format = dateInMoment.minutes() === 0 ? "MMM D, h A" : "MMM D, h:mm A"

  return dateInMoment.format(format)
}

function relevantStateData(currentState: AuctionTimerState, { liveStartsAt, startsAt, endsAt }: Props) {
  switch (currentState) {
    case AuctionTimerState.PREVIEW: {
      if (!startsAt) {
        console.error("startsAt is required when isPreview is true")
      }
      return { date: startsAt, label: `Starts ${formatDate(startsAt)}` }
    }
    case AuctionTimerState.LIVE_INTEGRATION_UPCOMING: {
      return { date: liveStartsAt, label: `Live ${formatDate(liveStartsAt)}` }
    }
    case AuctionTimerState.LIVE_INTEGRATION_ONGOING: {
      return { date: null, label: "In progress" }
    }
    case AuctionTimerState.CLOSING: {
      return { date: endsAt, label: `Ends ${formatDate(endsAt)}` }
    }
    default: {
      return { date: null, label: "Bidding closed" }
    }
  }
}

function nextTimerState(currentState: AuctionTimerState, { liveStartsAt }: Props) {
  switch (currentState) {
    case AuctionTimerState.PREVIEW: {
      if (liveStartsAt) {
        return AuctionTimerState.LIVE_INTEGRATION_UPCOMING
      } else {
        return AuctionTimerState.CLOSING
      }
    }
    case AuctionTimerState.CLOSED: {
      return AuctionTimerState.CLOSED
    }
    case AuctionTimerState.LIVE_INTEGRATION_UPCOMING: {
      return AuctionTimerState.LIVE_INTEGRATION_ONGOING
    }
    case AuctionTimerState.LIVE_INTEGRATION_ONGOING: {
      return AuctionTimerState.LIVE_INTEGRATION_ONGOING
    }
    case AuctionTimerState.CLOSING: {
      return AuctionTimerState.CLOSED
    }
    default: {
      return AuctionTimerState.CLOSED
    }
  }
}

function currentTimerState({ isPreview, isClosed, liveStartsAt }: Props) {
  if (isPreview) {
    return AuctionTimerState.PREVIEW
  } else if (isClosed) {
    return AuctionTimerState.CLOSED
  } else if (liveStartsAt) {
    const isLiveOpen = moment().isAfter(liveStartsAt)
    if (isLiveOpen) {
      return AuctionTimerState.LIVE_INTEGRATION_ONGOING
    } else {
      return AuctionTimerState.LIVE_INTEGRATION_UPCOMING
    }
  } else {
    return AuctionTimerState.CLOSING
  }
}

export const Timer: React.SFC<Props> = props => {
  return (
    <TimeOffsetProvider>
      <DurationStateManager
        CountdownComponent={Countdown}
        onCurrentDurationState={() => {
          const state = currentTimerState(props)
          const { label, date } = relevantStateData(state, props)
          return { label, date, state }
        }}
        onNextDurationState={({ state }) => {
          const nextState = nextTimerState(state as AuctionTimerState, props)
          const { label, date } = relevantStateData(nextState, props)
          return { state: nextState, label, date }
        }}
      />
    </TimeOffsetProvider>
  )
}
