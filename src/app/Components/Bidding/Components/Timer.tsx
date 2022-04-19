import { StateManager as CountdownStateManager } from "app/Components/Countdown"
import { CountdownTimerProps } from "app/Components/Countdown/CountdownTimer"
import { ModernTicker, SimpleTicker } from "app/Components/Countdown/Ticker"
import { useFeatureFlag } from "app/store/GlobalStore"
import moment from "moment-timezone"
import { Flex, Sans } from "palette"
import PropTypes from "prop-types"
import React from "react"

// Possible states for an auction:
// - PREVIEW: Auction is open for registration but artworks cannot be bid on. This occurs when the current time is before any auction's startAt.
// - CLOSING: Timed auction has started
// - LIVE_INTEGRATION_UPCOMING: Auction is open for pre-bidding, live portion has not started
// - LIVE_INTEGRATION_ONGOING: Live auction is in progress
// - CLOSED: Auction is over
export enum AuctionTimerState {
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
  const format = dateInMoment.minutes() === 0 ? "MMM D, h A z" : "MMM D, h:mm A z"

  return dateInMoment.format(format)
}

export function relevantStateData(
  currentState: AuctionTimerState,
  { liveStartsAt, startsAt, endsAt }: Props
) {
  switch (currentState) {
    case AuctionTimerState.PREVIEW: {
      if (!startsAt) {
        console.error("startsAt is required when isPreview is true")
      }
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return { date: startsAt, label: `Starts ${formatDate(startsAt)}`, hasStarted: false }
    }
    case AuctionTimerState.LIVE_INTEGRATION_UPCOMING: {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return { date: liveStartsAt, label: `Live ${formatDate(liveStartsAt)}` }
    }
    case AuctionTimerState.LIVE_INTEGRATION_ONGOING: {
      return { date: null, label: "In progress" }
    }
    case AuctionTimerState.CLOSING: {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return { date: endsAt, label: `Closes ${formatDate(endsAt)}`, hasStarted: true }
    }
    default: {
      return { date: null, label: "Bidding closed" }
    }
  }
}

export function nextTimerState(currentState: AuctionTimerState, { liveStartsAt }: Props) {
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

export function currentTimerState({ isPreview, isClosed, liveStartsAt }: Props) {
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

export interface CountdownProps extends CountdownTimerProps {
  hasStarted?: boolean
  cascadingEndTimeInterval?: number | null
}

export const Countdown: React.FC<CountdownProps> = ({
  duration,
  label,
  hasStarted,
  cascadingEndTimeInterval,
}) => {
  const cascadingEndTimeFeatureEnabled = !useFeatureFlag("ARDisableCascadingEndTimerLotPage")

  return (
    <Flex alignItems="center">
      {cascadingEndTimeFeatureEnabled && cascadingEndTimeInterval ? (
        <ModernTicker duration={duration} hasStarted={hasStarted} />
      ) : (
        <SimpleTicker duration={duration} separator="  " size="4t" weight="medium" />
      )}

      <Sans size="2" weight="medium" color="black60">
        {label}
      </Sans>
    </Flex>
  )
}

interface TimeOffsetProviderProps {
  children: React.ReactElement<any>
}

export class TimeOffsetProvider extends React.Component<TimeOffsetProviderProps> {
  static contextTypes = {
    timeOffsetInMilliSeconds: PropTypes.number,
  }

  render() {
    return React.cloneElement(this.props.children, this.context || {})
  }
}

export const Timer: React.FC<Props> = (props) => {
  return (
    <TimeOffsetProvider>
      <CountdownStateManager
        CountdownComponent={Countdown}
        onCurrentTickerState={() => {
          const state = currentTimerState(props)
          const { label, date } = relevantStateData(state, props)
          return { label, date, state } as any // STRICTNESS_MIGRATION
        }}
        onNextTickerState={({ state }) => {
          const nextState = nextTimerState(state as AuctionTimerState, props)
          const { label, date } = relevantStateData(nextState, props)
          return { state: nextState, label, date } as any // STRICTNESS_MIGRATION
        }}
      />
    </TimeOffsetProvider>
  )
}
