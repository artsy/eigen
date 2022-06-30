import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import moment from "moment"
import { Box } from "palette"
import { StateManager } from "./StateManager"

describe("StateManager", () => {
  const Countdown = (props: any) => {
    return <Box accessibilityLabel="Countdown" {...props} />
  }

  beforeEach(() => {
    jest.useFakeTimers()
    Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  })

  it("Manages a DurationProvider", () => {
    const onNextTickerStateMock = jest.fn(() => ({ label: "bar", state: "foo" }))
    const { getByLabelText } = renderWithWrappersTL(
      <StateManager
        CountdownComponent={Countdown}
        onCurrentTickerState={() => ({
          state: "foo",
          date: new Date(Date.now() + 1000).toISOString(),
          label: "foo",
        })}
        onNextTickerState={onNextTickerStateMock}
      />
    )

    const comp = getByLabelText("Countdown")
    const compDuration = comp.props.duration.toString()
    const duration = moment.duration(1000).toString()

    expect(compDuration).toEqual(duration)
  })

  it("Transitions state when duration expires", () => {
    const onNextTickerState = jest.fn(() => ({ label: "bar", state: "foo" }))
    renderWithWrappersTL(
      <StateManager
        CountdownComponent={Countdown}
        onCurrentTickerState={() => ({
          state: "foo",
          date: new Date(Date.now() + 1000).toISOString(),
          label: "foo",
        })}
        onNextTickerState={onNextTickerState}
      />
    )

    jest.advanceTimersByTime(1000)
    expect(onNextTickerState).toHaveBeenCalled()
  })
})
