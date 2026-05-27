import { getTimer } from "app/utils/getTimer"
import { DateTime } from "luxon"

const NOW = "2024-01-01T12:00:00.000Z"

describe("getTimer", () => {
  beforeEach(() => {
    jest.spyOn(DateTime, "now").mockReturnValue(DateTime.fromISO(NOW) as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("without startAt", () => {
    it("returns hasEnded=false and correct countdown when endDate is in the future", () => {
      const endDate = DateTime.fromISO(NOW).plus({ minutes: 1, seconds: 30 }).toISO()!
      const result = getTimer(endDate)

      expect(result.hasEnded).toBe(false)
      expect(result.time).toEqual({
        days: "00",
        hours: "00",
        minutes: "01",
        seconds: "30",
      })
    })

    it("returns hasEnded=true and zeroed time when endDate is in the past", () => {
      const endDate = DateTime.fromISO(NOW).minus({ minutes: 1 }).toISO()!
      const result = getTimer(endDate)

      expect(result.hasEnded).toBe(true)
      expect(result.time).toEqual({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      })
    })

    it("returns hasEnded=true when endDate equals current time", () => {
      const result = getTimer(NOW)
      expect(result.hasEnded).toBe(true)
    })

    it("returns hasEnded=false and NaN time values when endDate is an empty string", () => {
      // Many callers do: getTimer(offer?.endAt || "") and only read hasEnded (not time).
      // Luxon produces NaN durations from an empty string, so time fields contain "NaN".
      // Callers that render time always guard with a prior null-check on endAt.
      const result = getTimer("")
      expect(result.hasEnded).toBe(false)
      expect(result.time).toEqual({ days: "NaN", hours: "NaN", minutes: "NaN", seconds: "NaN" })
    })

    it("correctly breaks down days, hours, minutes, and seconds", () => {
      const endDate = DateTime.fromISO(NOW)
        .plus({ days: 1, hours: 2, minutes: 3, seconds: 4 })
        .toISO()!
      const result = getTimer(endDate)

      expect(result.time).toEqual({
        days: "01",
        hours: "02",
        minutes: "03",
        seconds: "04",
      })
    })

    it("pads single-digit values with zero", () => {
      const endDate = DateTime.fromISO(NOW).plus({ hours: 1, minutes: 1, seconds: 1 }).toISO()!
      const result = getTimer(endDate)

      expect(result.time.hours).toBe("01")
      expect(result.time.minutes).toBe("01")
      expect(result.time.seconds).toBe("01")
    })
  })

  describe("modulo correctness", () => {
    it("keeps hours modulo 24 (25h → 1 day 1 hour)", () => {
      const endDate = DateTime.fromISO(NOW).plus({ hours: 25 }).toISO()!
      const result = getTimer(endDate)

      expect(result.time.days).toBe("01")
      expect(result.time.hours).toBe("01")
    })

    it("keeps minutes modulo 60 (61m → 1 hour 1 minute)", () => {
      const endDate = DateTime.fromISO(NOW).plus({ minutes: 61 }).toISO()!
      const result = getTimer(endDate)

      expect(result.time.hours).toBe("01")
      expect(result.time.minutes).toBe("01")
    })

    it("keeps seconds modulo 60 (61s → 1 minute 1 second)", () => {
      const endDate = DateTime.fromISO(NOW).plus({ seconds: 61 }).toISO()!
      const result = getTimer(endDate)

      expect(result.time.minutes).toBe("01")
      expect(result.time.seconds).toBe("01")
    })
  })

  describe("with startAt", () => {
    it("shows time before start when startAt is in the future", () => {
      const startAt = DateTime.fromISO(NOW).plus({ minutes: 5 }).toISO()!
      const endDate = DateTime.fromISO(NOW).plus({ hours: 1 }).toISO()!
      const result = getTimer(endDate, startAt)

      expect(result.hasStarted).toBe(false)
      expect(result.hasEnded).toBe(false)
      expect(result.time).toEqual({
        days: "00",
        hours: "00",
        minutes: "05",
        seconds: "00",
      })
    })

    it("shows time before end when startAt is in the past", () => {
      const startAt = DateTime.fromISO(NOW).minus({ hours: 1 }).toISO()!
      const endDate = DateTime.fromISO(NOW).plus({ minutes: 30 }).toISO()!
      const result = getTimer(endDate, startAt)

      expect(result.hasStarted).toBe(true)
      expect(result.hasEnded).toBe(false)
      expect(result.time).toEqual({
        days: "00",
        hours: "00",
        minutes: "30",
        seconds: "00",
      })
    })

    it("returns hasEnded=true and zeroed time when both startAt and endDate are in the past", () => {
      const startAt = DateTime.fromISO(NOW).minus({ hours: 2 }).toISO()!
      const endDate = DateTime.fromISO(NOW).minus({ hours: 1 }).toISO()!
      const result = getTimer(endDate, startAt)

      expect(result.hasStarted).toBe(true)
      expect(result.hasEnded).toBe(true)
      expect(result.time).toEqual({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      })
    })

    it("returns hasStarted=false when startAt is far in the future", () => {
      const startAt = DateTime.fromISO(NOW).plus({ days: 1 }).toISO()!
      const endDate = DateTime.fromISO(NOW).plus({ days: 2 }).toISO()!
      const result = getTimer(endDate, startAt)

      expect(result.hasStarted).toBe(false)
      expect(result.hasEnded).toBe(false)
    })

    it("shows time before start when event has not yet started, even though endDate is far in future", () => {
      const startAt = DateTime.fromISO(NOW).plus({ hours: 2 }).toISO()!
      const endDate = DateTime.fromISO(NOW).plus({ days: 3 }).toISO()!
      const result = getTimer(endDate, startAt)

      expect(result.hasStarted).toBe(false)
      expect(result.time.hours).toBe("02")
      expect(result.time.minutes).toBe("00")
    })
  })
})
