import moment from "moment"
import React from "react"
import { Sans14 } from "../Elements/Typography"

interface BidResultProps {
  // TODO: Change ths to endsAt or until that is formatted in ISO8601
  timeLeftInMilliseconds: number
}

interface BidResultState {
  timeLeftInMilliseconds: number
}

export class Timer extends React.Component<BidResultProps, BidResultState> {
  private intervalId: number

  constructor(props) {
    super(props)

    this.state = {
      timeLeftInMilliseconds: this.props.timeLeftInMilliseconds,
    }
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
    const duration = moment.duration(this.state.timeLeftInMilliseconds)

    return (
      <Sans14>
        {this.padWithZero(duration.days())}d{"  "}
        {this.padWithZero(duration.hours())}h{"  "}
        {this.padWithZero(duration.minutes())}m{"  "}
        {this.padWithZero(duration.seconds())}s
      </Sans14>
    )
  }

  private padWithZero(number: number) {
    return (number.toString() as any).padStart(2, "0")
  }
}
