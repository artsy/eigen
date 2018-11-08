import moment from "moment-timezone"
import React from "react"
import { DurationProvider } from "../../../Duration/DurationProvider"

interface Props {
  liveStartsAt?: string
  endsAt?: string
  isPreview?: boolean
  isClosed?: boolean
  startsAt?: string
  timeOffsetInMilliseconds?: number
  Component: any // FIXME: How do I type this?
}

interface State {
  timerState: AuctionTimerState
  label: string
  relevantDate: string
}

export enum AuctionTimerState {
  PREVIEW = "PREVIEW",
  LIVE_INTEGRATION_UPCOMING = "LIVE_INTEGRATION_UPCOMING",
  LIVE_INTEGRATION_ONGOING = "LIVE_INTEGRATION_ONGOING",
  CLOSING = "CLOSING",
  CLOSED = "CLOSED",
}

function formatDate(date: string) {
  const dateInMoment = moment(date, moment.ISO_8601).tz(moment.tz.guess(true))
  const format = dateInMoment.minutes() === 0 ? "MMM D, h A" : "MMM D, h:mm A"

  return dateInMoment.format(format)
}

function upcomingLabel(currentState: AuctionTimerState, liveStartsAt: string, startsAt: string, endsAt: string) {
  switch (currentState) {
    case AuctionTimerState.PREVIEW: {
      if (!startsAt) {
        console.error("startsAt is required when isPreview is true")
      }
      return { relevantDate: startsAt, label: `Starts ${formatDate(startsAt)}` }
    }
    case AuctionTimerState.LIVE_INTEGRATION_UPCOMING: {
      return { relevantDate: liveStartsAt, label: `Live ${formatDate(liveStartsAt)}` }
    }
    case AuctionTimerState.LIVE_INTEGRATION_ONGOING: {
      return { relevantDate: null, label: "In progress" }
    }
    case AuctionTimerState.CLOSING: {
      return { relevantDate: endsAt, label: `Ends ${formatDate(endsAt)}` }
    }
    default: {
      return { relevantDate: null, label: "Bidding closed" }
    }
  }
}

function nextTimerState(currentState: AuctionTimerState, liveStartsAt: string) {
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

function currentTimerState(isPreview: boolean, isClosed: boolean, liveStartsAt: string) {
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

export class StateManager extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    const { liveStartsAt, endsAt, isClosed, isPreview, startsAt } = props
    const timerState = currentTimerState(isPreview, isClosed, liveStartsAt)
    const { relevantDate, label } = upcomingLabel(timerState, liveStartsAt, startsAt, endsAt)
    this.state = { label, timerState, relevantDate }
  }

  handleDurationEnd = () => {
    const { liveStartsAt, endsAt, startsAt } = this.props
    const nextState = nextTimerState(this.state.timerState, liveStartsAt)
    const { relevantDate, label } = upcomingLabel(nextState, liveStartsAt, startsAt, endsAt)

    this.setState({ label, relevantDate, timerState: nextState })
  }

  render() {
    const { Component, timeOffsetInMilliseconds } = this.props
    const { label, relevantDate } = this.state

    return (
      <DurationProvider
        startAt={relevantDate}
        timeOffsetInMilliseconds={timeOffsetInMilliseconds}
        onDurationEnd={this.handleDurationEnd}
      >
        <Component label={label} />
      </DurationProvider>
    )
  }
}
