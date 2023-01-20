import { CountdownProps } from "app/Components/Bidding/Components/Timer"
import React from "react"
import { DurationProvider } from "./DurationProvider"

export interface TickerState {
  label?: string
  date?: string
  hasStarted?: boolean
  state: string
  biddingEndAt?: string
  hasBeenExtended?: boolean
}

interface Props {
  CountdownComponent: React.ComponentType<CountdownProps>
  timeOffsetInMilliseconds?: number
  onCurrentTickerState: () => TickerState
  onNextTickerState: (currentState: TickerState) => TickerState
}

interface State {
  tickerState: TickerState
  previousTickerState: TickerState
}

export class StateManager extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    // If this component receives a new tickerState as props,
    // update to use the new props.

    if (props.onCurrentTickerState().date !== state.previousTickerState.date) {
      return {
        tickerState: props.onCurrentTickerState(),
        previousTickerState: props.onCurrentTickerState(),
      }
    } else {
      return null
    }
  }

  state = {
    tickerState: this.props.onCurrentTickerState(),
    previousTickerState: this.props.onCurrentTickerState(),
  }

  handleDurationEnd = () => {
    this.setState({ tickerState: this.props.onNextTickerState(this.state.tickerState) })
  }

  render() {
    const { CountdownComponent, timeOffsetInMilliseconds, ...props } = this.props
    const {
      tickerState: { label, date, state, hasStarted, hasBeenExtended, biddingEndAt },
    } = this.state
    return (
      <DurationProvider
        startAt={date}
        timeOffsetInMilliseconds={timeOffsetInMilliseconds}
        onDurationEnd={this.handleDurationEnd}
      >
        <CountdownComponent
          label={label}
          duration={null}
          hasStarted={hasStarted}
          timerState={state}
          hasBeenExtended={hasBeenExtended}
          biddingEndAt={biddingEndAt}
          {...props}
        />
      </DurationProvider>
    )
  }
}
