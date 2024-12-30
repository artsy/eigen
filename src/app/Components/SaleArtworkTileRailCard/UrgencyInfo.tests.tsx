import { UrgencyInfo } from "app/Components/SaleArtworkTileRailCard/UrgencyInfo"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const SEC = 1000
const MIN = SEC * 60
const HR = MIN * 60
const DAY = HR * 24

describe("UrgencyInfo", () => {
  jest.useFakeTimers({
    legacyFakeTimers: true,
  })
  afterAll(() => {
    jest.useRealTimers()
  })
  it('shows "Live in" when sale is live type and has not started', () => {
    const start = new Date(new Date().getTime() + 11 * DAY + 10 * MIN).toISOString()
    const end = new Date(new Date().getTime() + 20 * DAY).toISOString()
    const { getByText } = renderWithWrappers(
      <UrgencyInfo startAt={start} endAt={end} isLiveAuction saleTimeZone="America/New_York" />
    )

    jest.advanceTimersByTime(2000)
    expect(getByText("Live in 11 days")).toBeDefined()
  })

  it("shows time left when sale has started", () => {
    const start = new Date(new Date().getTime() - 10).toISOString()
    const end = new Date(new Date().getTime() + 3 * DAY + HR).toISOString()
    const { getByText } = renderWithWrappers(
      <UrgencyInfo startAt={start} endAt={end} saleTimeZone="America/New_York" />
    )

    jest.advanceTimersByTime(2000)
    expect(getByText("3 days left")).toBeDefined()
  })

  it('shows "In Progress" if event has started but has no end date', () => {
    const start = new Date(new Date().getTime() - 10).toISOString()
    const end = ""
    const { getByText } = renderWithWrappers(
      <UrgencyInfo startAt={start} endAt={end} saleTimeZone="America/New_York" />
    )

    jest.advanceTimersByTime(2000)
    expect(getByText("In progress")).toBeDefined()
  })

  it.skip("calls onTimerEnd function when timer ends", () => {
    const start = new Date(new Date().getTime()).toISOString()
    const end = new Date(new Date().getTime() + 3 * SEC).toISOString()
    const onTimerEndMock = jest.fn()
    renderWithWrappers(
      <UrgencyInfo
        startAt={start}
        endAt={end}
        saleTimeZone="America/New_York"
        onTimerEnd={onTimerEndMock}
      />
    )

    // IRL onTimerEndMock is called once when the timer ends
    // but since timer runs endlessly, jest timer would never exit
    // TODO: Find better way to test this block
    jest.runAllTimers()
    expect(onTimerEndMock).toHaveBeenCalled()
  })

  describe("text color", () => {
    it("text color is red when time is less than 1 hour", () => {
      const start = new Date(new Date().getTime() - 10).toISOString()
      const end = new Date(new Date().getTime() + HR - MIN).toISOString()
      const { getByText } = renderWithWrappers(
        <UrgencyInfo startAt={start} endAt={end} saleTimeZone="America/New_York" />
      )

      jest.advanceTimersByTime(2000)
      expect(getByText("58m 59s left")).toHaveStyle({ color: "#D71023" })
    })
    it("text color is blue when time is greater than 1 hour", () => {
      const start = new Date(new Date().getTime() - 10).toISOString()
      const end = new Date(new Date().getTime() + 2 * HR).toISOString()
      const { getByText } = renderWithWrappers(
        <UrgencyInfo startAt={start} endAt={end} saleTimeZone="America/New_York" />
      )

      jest.advanceTimersByTime(2000)
      expect(getByText("1h 59m left")).toHaveStyle({ color: "#1023D7" })
    })
  })
})
