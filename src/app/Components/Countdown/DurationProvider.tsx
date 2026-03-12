import { DateTime } from "luxon"
import moment from "moment"
import React from "react"
import { AppState, AppStateStatus, NativeEventSubscription } from "react-native"

interface Props {
  startAt?: string
  timeOffsetInMilliseconds?: number
  children: React.ReactElement<any>
  onDurationEnd?: () => void
}

interface State {
  timeLeftInMilliseconds: number
  appState: AppStateStatus
}

export class DurationProvider extends React.Component<Props, State> {
  state = {
    timeLeftInMilliseconds: this.props.startAt
      ? DateTime.fromISO(this.props.startAt).toMillis() - DateTime.now().toMillis()
      : 0,
    appState: AppState.currentState,
  }

  private intervalId: ReturnType<typeof setInterval> | null = null
  private appStateSubscription: NativeEventSubscription | null = null

  componentDidMount() {
    this.intervalId = setInterval(this.timer, 1000)
    this.appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
        // recalculate timeLeftInMilliseconds
        if (this.props.startAt) {
          this.setState({
            timeLeftInMilliseconds:
              DateTime.fromISO(this.props.startAt).toMillis() - DateTime.now().toMillis(),
          })
        }
      }
      this.setState({ appState: nextAppState })
    })
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.startAt !== this.props.startAt) {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
      this.intervalId = null
      if (!!nextProps.startAt) {
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
