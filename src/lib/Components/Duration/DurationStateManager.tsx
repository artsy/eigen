import React from "react"
import { DurationProvider } from "./DurationProvider"

export interface DurationState {
  label: string
  date?: string
  state: string
}

interface Props {
  CountdownComponent: any // FIXME: how do I type this?
  timeOffsetInMilliseconds: number
  onCurrentDurationState: () => DurationState
  onNextDurationState: (currentState: DurationState) => DurationState
}

interface State {
  currentDurationState: DurationState
}

export class DurationStateManager extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { currentDurationState: props.onCurrentDurationState() }
  }

  handleDurationEnd = () => {
    this.setState({ currentDurationState: this.props.onNextDurationState(this.state.currentDurationState) })
  }

  render() {
    const { CountdownComponent, timeOffsetInMilliseconds } = this.props
    const {
      currentDurationState: { label, date },
    } = this.state

    return (
      <DurationProvider
        startAt={date}
        timeOffsetInMilliseconds={timeOffsetInMilliseconds}
        onDurationEnd={this.handleDurationEnd}
      >
        <CountdownComponent label={label} />
      </DurationProvider>
    )
  }
}
