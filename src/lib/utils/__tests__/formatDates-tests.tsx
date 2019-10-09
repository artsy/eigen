import { mockTimezone } from "lib/tests/mockTimezone"
import moment from "moment"
import "moment-timezone"
import { formatDate, formatDateTime } from "../formatDates"

const dateNow = 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
let oneDayAgo
let oneDayFromNow
let oneYearFromNow

beforeEach(() => {
  jest.useFakeTimers()

  // Thursday, May 10, 2018 8:22:32.000 PM UTC
  Date.now = () => dateNow

  oneDayFromNow = moment(dateNow)
    .add(1, "day")
    .toISOString()

  oneYearFromNow = moment(dateNow)
    .add(1, "year")
    .toISOString()

  oneDayAgo = moment(dateNow)
    .subtract(1, "day")
    .toISOString()
})

describe("formatDate", () => {
  it("shows month and day if year is the same as current year", () => {
    mockTimezone("America/New_York")
    const date = formatDate(oneDayFromNow)
    expect(date).toEqual("May 11")
  })

  it("shows month, day, and year if year is not the same as current year", () => {
    mockTimezone("America/New_York")
    const date = formatDate(oneYearFromNow)
    expect(date).toEqual("May 10, 2019")
  })
})

describe("formatDateTime", () => {
  it("shows month and day if year is the same as current year", () => {
    mockTimezone("America/New_York")
    const date = formatDateTime(oneDayFromNow)
    expect(date).toEqual("May 11, 4:22pm")
  })

  it("shows month, day, and year if year is not the same as current year", () => {
    mockTimezone("America/New_York")
    const date = formatDateTime(oneYearFromNow)
    expect(date).toEqual("May 10, 2019, 4:22pm")
  })

  it("adjusts according to timezone", () => {
    mockTimezone("America/Los_Angeles")
    const date = formatDateTime(oneDayFromNow)
    expect(date).toEqual("May 11, 1:22pm")
  })
})

describe("timeUntil", () => {
  it("returns 'Ended' string when endAt is in the past", () => {
    mockTimezone("America/New_York")
    const startAt = oneDayAgo
    const liveStartAt = oneDayAgo
    const endAt = oneDayAgo
    const date = timeUntil(startAt, liveStartAt, endAt)
    expect(date).toEqual("Ended May 9")
  })

  it("returns 'Ends' string when sale has started and there is no live sale", () => {
    mockTimezone("America/New_York")
    const startAt = oneDayAgo
    const liveStartAt = null
    const endAt = oneDayFromNow
    const date = timeUntil(startAt, liveStartAt, endAt)
    expect(date).toEqual("Ends May 11, 4:22pm")
  })

  it("returns 'Starts' string when auction has not yet started", () => {
    mockTimezone("America/New_York")
    const startAt = oneDayFromNow
    const liveStartAt = oneDayFromNow
    const endAt = oneYearFromNow
    const date = timeUntil(startAt, liveStartAt, endAt)
    expect(date).toEqual("Starts May 11, 4:22pm")
  })
  it("returns 'Live' string when auction has started but live sale has not", () => {
    mockTimezone("America/New_York")
    const startAt = oneDayAgo
    const liveStartAt = oneDayFromNow
    const endAt = oneYearFromNow
    const date = timeUntil(startAt, liveStartAt, endAt)
    expect(date).toEqual("Live May 11, 4:22pm")
  })

  it("returns 'In progress' string when auction is live", () => {
    mockTimezone("America/New_York")
    const startAt = oneDayAgo
    const liveStartAt = oneDayAgo
    const endAt = oneDayFromNow
    const date = timeUntil(startAt, liveStartAt, endAt)
    expect(date).toEqual("In progress")
  })

  it("returns null if endAt is null and startAt and liveStartAt are in the past", () => {
    mockTimezone("America/New_York")
    const startAt = oneDayAgo
    const liveStartAt = oneDayAgo
    const endAt = null
    const date = timeUntil(startAt, liveStartAt, endAt)
    expect(date).toEqual(null)
  })
})
