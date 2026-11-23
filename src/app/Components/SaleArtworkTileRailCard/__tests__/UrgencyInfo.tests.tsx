import { act, screen } from "@testing-library/react-native"
import { UrgencyInfo } from "app/Components/SaleArtworkTileRailCard/UrgencyInfo"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const SEC = 1000
const MIN = SEC * 60
const HR = MIN * 60
const DAY = HR * 24

describe("UrgencyInfo", () => {
  // Modern fake timers move Date along with the timers, so the countdown text is deterministic
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })
  it('shows "Live in" when sale is live type and has not started', async () => {
    const start = new Date(new Date().getTime() + 11 * DAY + 10 * MIN).toISOString()
    const end = new Date(new Date().getTime() + 20 * DAY).toISOString()
    await renderWithWrappers(
      <UrgencyInfo startAt={start} endAt={end} isLiveAuction saleTimeZone="America/New_York" />
    )

    await act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(screen.getByText("Live in 11 days")).toBeOnTheScreen()
  })

  it("shows time left when sale has started", async () => {
    const start = new Date(new Date().getTime() - 10).toISOString()
    const end = new Date(new Date().getTime() + 3 * DAY + HR).toISOString()
    await renderWithWrappers(
      <UrgencyInfo startAt={start} endAt={end} saleTimeZone="America/New_York" />
    )

    await act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(screen.getByText("3 days left")).toBeOnTheScreen()
  })

  it('shows "In Progress" if event has started but has no end date', async () => {
    const start = new Date(new Date().getTime() - 10).toISOString()
    const end = ""
    await renderWithWrappers(
      <UrgencyInfo startAt={start} endAt={end} saleTimeZone="America/New_York" />
    )

    await act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(screen.getByText("In progress")).toBeOnTheScreen()
  })

  it("calls onTimerEnd function when timer ends", async () => {
    const start = new Date(new Date().getTime()).toISOString()
    const end = new Date(new Date().getTime() + 3 * SEC).toISOString()
    const onTimerEndMock = jest.fn()
    await renderWithWrappers(
      <UrgencyInfo
        startAt={start}
        endAt={end}
        saleTimeZone="America/New_York"
        onTimerEnd={onTimerEndMock}
      />
    )

    // The countdown interval never stops, so step past the end time instead of running all timers
    await act(() => {
      jest.advanceTimersByTime(2 * SEC)
    })
    expect(onTimerEndMock).not.toHaveBeenCalled()

    await act(() => {
      jest.advanceTimersByTime(2 * SEC)
    })
    expect(onTimerEndMock).toHaveBeenCalledTimes(1)
  })

  describe("text color", () => {
    it("text color is red when time is less than 1 hour", async () => {
      const start = new Date(new Date().getTime() - 10).toISOString()
      const end = new Date(new Date().getTime() + HR - MIN).toISOString()
      await renderWithWrappers(
        <UrgencyInfo startAt={start} endAt={end} saleTimeZone="America/New_York" />
      )
      await act(() => {
        jest.advanceTimersByTime(2000)
      })
      expect(screen.getByText("58m 58s left")).toHaveStyle({ color: "#D71023" })
    })
    it("text color is blue when time is greater than 1 hour", async () => {
      const start = new Date(new Date().getTime() - 10).toISOString()
      const end = new Date(new Date().getTime() + 2 * HR).toISOString()
      await renderWithWrappers(
        <UrgencyInfo startAt={start} endAt={end} saleTimeZone="America/New_York" />
      )
      await act(() => {
        jest.advanceTimersByTime(2000)
      })
      expect(screen.getByText("1h 59m left")).toHaveStyle({ color: "#1023D7" })
    })
  })
})
