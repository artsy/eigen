import { Text } from "@artsy/palette-mobile"
import { act, screen } from "@testing-library/react-native"
import { DurationProvider } from "app/Components/Countdown/DurationProvider"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("DurationProvider", () => {
  const DurationConsumer = (props: any) => {
    return <Text>{props.duration.toISO()}</Text>
  }

  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  })

  it("provides a duration", () => {
    const startAt = new Date(Date.now() + 1000).toISOString()
    renderWithWrappers(
      <DurationProvider startAt={startAt}>
        <DurationConsumer />
      </DurationProvider>
    )

    expect(screen.getByText("PT1S")).toBeTruthy()
  })

  it("updates duration every second", () => {
    const startAt = new Date(Date.now() + 1000).toISOString()
    renderWithWrappers(
      <DurationProvider startAt={startAt}>
        <DurationConsumer />
      </DurationProvider>
    )

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText("PT0S")).toBeTruthy()
  })
})
