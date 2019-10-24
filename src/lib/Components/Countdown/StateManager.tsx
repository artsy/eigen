import React from "react"
import { CountdownProps } from "../Bidding/Components/Timer"
import { DurationProvider } from "./DurationProvider"

export interface TickerState {
  label?: string
  date?: string
  state: string
}

interface Props {
  CountdownComponent: React.ComponentType<CountdownProps>
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
    const { CountdownComponent, timeOffsetInMilliseconds, ...props } = this.props
    const {
      tickerState: { label, date, state },
    } = this.state

    return (
      <DurationProvider
        startAt={date}
        timeOffsetInMilliseconds={timeOffsetInMilliseconds}
        onDurationEnd={this.handleDurationEnd}
      >
        <CountdownComponent label={label} duration={null} timerState={state} {...props} />
      </DurationProvider>
    )
  }
}
