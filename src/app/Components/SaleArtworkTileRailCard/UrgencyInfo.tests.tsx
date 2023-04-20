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
})
