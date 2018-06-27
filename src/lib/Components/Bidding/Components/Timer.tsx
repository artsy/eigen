import moment from "moment-timezone"
import React from "react"
import { Flex } from "../Elements/Flex"
import { SansMedium12, SansMedium14 } from "../Elements/Typography"

interface TimerProps {
  liveStartsAt?: string
  endsAt?: string
  isPreview?: boolean
  isClosed?: boolean
  startsAt?: string
}

interface TimerState {
  timeLeftInMilliseconds: number
  label: string
  timerState: AuctionTimerState
}

export enum AuctionTimerState {
  PREVIEW = "PREVIEW",
  LIVE_INTEGRATION_UPCOMING = "LIVE_INTEGRATION_UPCOMING",
  LIVE_INTEGRATION_ONGOING = "LIVE_INTEGRATION_ONGOING",
  CLOSING = "CLOSING",
  CLOSED = "CLOSED",
}

export class Timer extends React.Component<TimerProps, TimerState> {
  private intervalId: number

  constructor(props) {
    super(props)

    const { liveStartsAt, endsAt, isClosed, isPreview, startsAt } = props
    const timerState = this.currentState(isPreview, isClosed, liveStartsAt)
    const { relevantDate, label } = this.upcomingLabel(timerState, liveStartsAt, startsAt, endsAt)

    this.state = { timeLeftInMilliseconds: Date.parse(relevantDate) - Date.now(), label, timerState }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  timer = () => {
    if (this.state.timeLeftInMilliseconds - 1000 > 0) {
      this.setState({ timeLeftInMilliseconds: this.state.timeLeftInMilliseconds - 1000 })
    } else {
      const { liveStartsAt, endsAt, startsAt } = this.props
      const nextState = this.nextState(this.state.timerState, liveStartsAt)
      const { relevantDate, label } = this.upcomingLabel(nextState, liveStartsAt, startsAt, endsAt)

      this.setState({ label, timerState: nextState })
      if (relevantDate) {
        this.setState({
          timeLeftInMilliseconds: Date.parse(relevantDate) - Date.now(),
        })
      } else {
        clearInterval(this.intervalId)
      }
    }
  }

  formatDate(date: string) {
    return moment(date, moment.ISO_8601)
      .tz(moment.tz.guess(true))
      .format("MMM D, ha")
  }

  upcomingLabel(currentState: AuctionTimerState, liveStartsAt: string, startsAt: string, endsAt: string) {
    switch (currentState) {
      case AuctionTimerState.PREVIEW: {
        if (!startsAt) {
          console.error("startsAt is required when isPreview is true")
        }
        return { relevantDate: startsAt, label: `Starts ${this.formatDate(startsAt)}` }
      }
      case AuctionTimerState.LIVE_INTEGRATION_UPCOMING: {
        return { relevantDate: liveStartsAt, label: `Live ${this.formatDate(liveStartsAt)}` }
      }
      case AuctionTimerState.LIVE_INTEGRATION_ONGOING: {
        return { relevantDate: null, label: "In progress" }
      }
      case AuctionTimerState.CLOSING: {
        return { relevantDate: endsAt, label: `Ends ${this.formatDate(endsAt)}` }
      }
      default: {
        return { relevantDate: null, label: "Bidding closed" }
      }
    }
  }

  nextState(currentState: AuctionTimerState, liveStartsAt: string) {
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

  currentState(isPreview: boolean, isClosed: boolean, liveStartsAt: string) {
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

  render() {
    const duration = moment.duration(this.state.timeLeftInMilliseconds)

    return (
      <Flex alignItems="center">
        <SansMedium12>{this.state.label}</SansMedium12>
        <SansMedium14>
          {this.padWithZero(duration.days())}d{"  "}
          {this.padWithZero(duration.hours())}h{"  "}
          {this.padWithZero(duration.minutes())}m{"  "}
          {this.padWithZero(duration.seconds())}s
        </SansMedium14>
      </Flex>
    )
  }

  private padWithZero(number: number) {
    return (number.toString() as any).padStart(2, "0")
  }
}
