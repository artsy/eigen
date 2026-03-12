import { Text } from "@artsy/palette-mobile"
import { CountdownProps } from "app/Components/Bidding/Components/Timer"
import { StateManager } from "app/Components/Countdown/StateManager"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import moment from "moment"

describe("StateManager", () => {
  const Countdown = (props: CountdownProps) => {
    return <Text>{props.duration?.toString()}</Text>
  }

  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  })

  it("Manages a DurationProvider", () => {
    const onNextTickerStateMock = jest.fn(() => ({ label: "bar", state: "foo" }))
    const { getByText } = renderWithWrappers(
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

    const duration = moment.duration(1000).toString()
    expect(getByText(duration)).toBeTruthy()
  })

  it("Transitions state when duration expires", () => {
    const onNextTickerState = jest.fn(() => ({ label: "bar", state: "foo" }))
    renderWithWrappers(
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
