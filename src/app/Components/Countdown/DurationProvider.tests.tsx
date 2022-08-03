import { renderWithWrappers } from "app/tests/renderWithWrappers"
import moment from "moment"
import { Text } from "palette"
import { DurationProvider } from "./DurationProvider"

describe("DurationProvider", () => {
  const DurationConsumer = (props: any) => {
    return <Text>{props.duration.toString()}</Text>
  }

  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true })
    Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  })

  it("provides a duration", () => {
    const startAt = new Date(Date.now() + 1000).toISOString()
    const { getByText } = renderWithWrappers(
      <DurationProvider startAt={startAt}>
        <DurationConsumer />
      </DurationProvider>
    )

    const duration = moment.duration(1000).toString()
    expect(getByText(duration)).toBeTruthy()
  })

  it("updates duration every second", () => {
    const startAt = new Date(Date.now() + 1000).toISOString()
    const { getByText } = renderWithWrappers(
      <DurationProvider startAt={startAt}>
        <DurationConsumer />
      </DurationProvider>
    )
    jest.advanceTimersByTime(1000)

    const duration = moment.duration(0).toString()
    expect(getByText(duration)).toBeTruthy()
  })
})
