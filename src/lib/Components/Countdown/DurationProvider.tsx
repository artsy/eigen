import moment from "moment"
import React from "react"

interface Props {
  startAt: string
  timeOffsetInMilliseconds?: number
  children: React.ReactElement<any>
  onDurationEnd?: () => void
}

interface State {
  timeLeftInMilliseconds: number
}

export class DurationProvider extends React.Component<Props, State> {
  private intervalId: number

  constructor(props) {
    super(props)
    this.state = { timeLeftInMilliseconds: Date.parse(props.startAt) - Date.now() }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer, 1000)
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startAt !== this.props.startAt) {
      clearInterval(this.intervalId)
      this.intervalId = null
      if (nextProps.startAt !== null) {
        this.setState(
          {
            timeLeftInMilliseconds: Date.parse(nextProps.startAt) - Date.now(),
          },
          () => {
            this.intervalId = setInterval(this.timer, 1000)
          }
        )
      }
    }
  }

  timer = () => {
    const { onDurationEnd } = this.props
    const timeLeftInMilliseconds = this.state.timeLeftInMilliseconds - 1000
    if (timeLeftInMilliseconds > 0) {
      this.setState({ timeLeftInMilliseconds })
    } else {
      // Countdown expired, clear interval
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }

      // if `onDurationEnd` is passed, consumer might have explicit handling of end state,
      // otherwise just reflect that duration has expired.
      if (onDurationEnd) {
        onDurationEnd()
      } else {
        this.setState({ timeLeftInMilliseconds: 0 })
      }
    }
  }

  render() {
    const { timeLeftInMilliseconds } = this.state
    const { timeOffsetInMilliseconds, children } = this.props
    return React.cloneElement(children, {
      duration: moment.duration(timeLeftInMilliseconds + (timeOffsetInMilliseconds || 0) || 0),
      timeLeftInMilliseconds,
    })
  }
}
