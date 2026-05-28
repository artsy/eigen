import { screen } from "@testing-library/react-native"
import { TimeSince, relativeDate } from "app/Scenes/Inbox/Components/Conversations/TimeSince"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// Fixed "now": 2025-06-15 12:00:00 UTC (Sunday)
const NOW = new Date("2025-06-15T12:00:00.000Z").getTime()

beforeEach(() => {
  jest.spyOn(Date, "now").mockReturnValue(NOW)
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe("TimeSince", () => {
  it("renders null when time is null", () => {
    const { toJSON } = renderWithWrappers(<TimeSince time={null} />)
    expect(toJSON()).toBeNull()
  })

  it("renders null when time is undefined", () => {
    const { toJSON } = renderWithWrappers(<TimeSince time={undefined} />)
    expect(toJSON()).toBeNull()
  })

  describe("exact mode", () => {
    it("shows 'Today' for a time earlier today", () => {
      const todayMorning = new Date("2025-06-15T08:00:00.000Z").toISOString()
      renderWithWrappers(<TimeSince time={todayMorning} exact />)
      expect(screen.getByText(/Today/)).toBeOnTheScreen()
    })

    it("shows 'Yesterday' for a time yesterday", () => {
      const yesterday = new Date("2025-06-14T10:00:00.000Z").toISOString()
      renderWithWrappers(<TimeSince time={yesterday} exact />)
      expect(screen.getByText(/Yesterday/)).toBeOnTheScreen()
    })

    it("shows the weekday name for a time 3 days ago (within 7 days)", () => {
      const threeDaysAgo = new Date("2025-06-12T10:00:00.000Z").toISOString()
      renderWithWrappers(<TimeSince time={threeDaysAgo} exact />)
      // June 12, 2025 is a Thursday
      expect(screen.getByText(/Thursday/)).toBeOnTheScreen()
    })

    it("shows a full date for a time more than 7 days ago", () => {
      const tenDaysAgo = new Date("2025-06-05T10:00:00.000Z").toISOString()
      renderWithWrappers(<TimeSince time={tenDaysAgo} exact />)
      // Should show something like "Thu, Jun 5th, 10:00 AM"
      expect(screen.getByText(/Jun/)).toBeOnTheScreen()
    })
  })

  describe("relative mode (default)", () => {
    it("renders without crashing for a valid time", () => {
      const oneHourAgo = new Date(NOW - 60 * 60 * 1000).toISOString()
      const { toJSON } = renderWithWrappers(<TimeSince time={oneHourAgo} />)
      expect(toJSON()).not.toBeNull()
    })
  })
})

describe("relativeDate", () => {
  it("returns null for empty string", () => {
    expect(relativeDate("")).toBeNull()
  })

  it("returns a non-empty string for a valid date", () => {
    const oneHourAgo = new Date(NOW - 60 * 60 * 1000).toISOString()
    const result = relativeDate(oneHourAgo)
    expect(result).toBeTruthy()
    expect(typeof result).toBe("string")
  })
})
