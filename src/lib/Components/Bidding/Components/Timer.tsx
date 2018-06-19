import moment from "moment-timezone"
import React from "react"
import { Flex } from "../Elements/Flex"
import { SansMedium12, SansMedium14 } from "../Elements/Typography"

interface TimerProps {
  liveStartsAt?: string
  endsAt?: string
  isPreview?: boolean
  startsAt?: string
}

interface TimerState {
  timeLeftInMilliseconds: number
  upcomingLabel: string
}

export class Timer extends React.Component<TimerProps, TimerState> {
  private intervalId: number

  constructor(props) {
    super(props)

    const { liveStartsAt, endsAt, isPreview, startsAt } = props

    let relevantDate
    let upcomingLabel

    if (isPreview) {
      if (!startsAt) {
        console.error("startsAt is required when isPreview is true")
      }

      relevantDate = startsAt
      upcomingLabel = `Starts ${this.formatDate(startsAt)}`
    } else if (liveStartsAt) {
      relevantDate = liveStartsAt
      upcomingLabel = `Live ${this.formatDate(liveStartsAt)}`
    } else if (endsAt) {
      relevantDate = endsAt
      upcomingLabel = `Ends ${this.formatDate(endsAt)}`
    } else {
      console.error("liveStartsAt or endsAt is required when isPreview is false")
    }

    this.state = { timeLeftInMilliseconds: Date.parse(relevantDate) - Date.now(), upcomingLabel }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  timer = () => {
    this.setState({ timeLeftInMilliseconds: this.state.timeLeftInMilliseconds - 1000 })
  }

  formatDate(date: string) {
    return moment(date, moment.ISO_8601)
      .tz(moment.tz.guess(true))
      .format("MMM D, ha")
  }

  render() {
    const duration = moment.duration(this.state.timeLeftInMilliseconds)

    return (
      <Flex alignItems="center">
        <SansMedium12>{this.state.upcomingLabel}</SansMedium12>
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
