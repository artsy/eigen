import moment from "moment-timezone"
import React from "react"
import { Flex } from "../Elements/Flex"
import { SansMedium12, SansMedium14 } from "../Elements/Typography"

interface TimerProps {
  liveStartsAt?: string
  endsAt?: string
}

interface TimerState {
  timeLeftInMilliseconds: number
}

export class Timer extends React.Component<TimerProps, TimerState> {
  private intervalId: number

  constructor(props) {
    super(props)

    const { liveStartsAt, endsAt } = props
    const timeLeftInMilliseconds = Date.parse(liveStartsAt || endsAt) - Date.now()

    this.state = { timeLeftInMilliseconds }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  timer = () => {
    this.setState({
      timeLeftInMilliseconds: this.state.timeLeftInMilliseconds - 1000,
    })
  }

  render() {
    const { liveStartsAt, endsAt } = this.props
    const duration = moment.duration(this.state.timeLeftInMilliseconds)

    return (
      <Flex alignItems="center">
        <SansMedium12>
          {liveStartsAt ? "Live " : "Ends "}
          {moment(liveStartsAt || endsAt, moment.ISO_8601)
            .tz(moment.tz.guess(true))
            .format("MMM D, ha")}
        </SansMedium12>
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
