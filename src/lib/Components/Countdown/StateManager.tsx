import moment from "moment"
import React from "react"
import { DurationProvider } from "./DurationProvider"

export interface TickerState {
  label: string
  date?: string
  state: string
}

interface Props {
  CountdownComponent: React.ComponentType<{ label: string; duration: moment.Duration }>
  timeOffsetInMilliseconds?: number
  onCurrentTickerState: () => TickerState
  onNextTickerState: (currentState: TickerState) => TickerState
}

interface State {
  tickerState: TickerState
}

export class StateManager extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { tickerState: props.onCurrentTickerState() }
  }

  handleDurationEnd = () => {
    this.setState({ tickerState: this.props.onNextTickerState(this.state.tickerState) })
  }

  render() {
    const { CountdownComponent, timeOffsetInMilliseconds } = this.props
    const {
      tickerState: { label, date },
    } = this.state

    return (
      <DurationProvider
        startAt={date}
        timeOffsetInMilliseconds={timeOffsetInMilliseconds}
        onDurationEnd={this.handleDurationEnd}
      >
        <CountdownComponent label={label} duration={null} />
      </DurationProvider>
    )
  }
}
