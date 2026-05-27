import { renderHook, act } from "@testing-library/react-native"
import { IANATimezone } from "app/utils/IANATimezone"
import { Time } from "app/utils/getTimer"
import {
  getAbsoluteTimeOfSale,
  getTimerInfo,
  saleTime,
  useRelativeTimeOfSale,
} from "app/utils/saleTime"

const timezones: Record<string, IANATimezone> = {
  ny: "America/New_York",
  la: "America/Los_Angeles",
  de: "Europe/Berlin",
}

jest.mock("moment-timezone", () => {
  const timezone = "America/New_York"
  const momentMock = jest.requireActual("moment-timezone")
  momentMock.tz.setDefault(timezone)
  momentMock.tz.guess = () => timezone
  return momentMock
})

const times = {
  past20: "2020-08-01T15:00:00",
  past10: "2020-09-01T15:00:00",

  present: "2020-09-04T19:00:00",

  future01: "2020-09-04T15:01:00",
  future10: "2020-09-04T15:43:00",
  future20: "2020-09-04T17:32:00",
  future30: "2020-09-05T15:00:00",
  future40: "2020-09-09T15:00:00",
  future50: "2020-09-09T21:00:00",
  future60: "2020-10-01T15:00:00",
  future70: "2021-01-02T15:00:00",
}

type Sale = Parameters<typeof saleTime>[0]

const liveSaleNY: Sale = {
  startAt: null,
  liveStartAt: times.future60,
  endAt: null,
  timeZone: timezones.ny,
}

const timedSaleNY: Sale = {
  startAt: times.future60,
  liveStartAt: null,
  endAt: null,
  timeZone: timezones.ny,
}

const liveSaleImminentNY: Sale = {
  startAt: null,
  liveStartAt: times.present,
  endAt: null,
  timeZone: timezones.ny,
}

const liveSaleSoonNY: Sale = {
  startAt: times.future40,
  liveStartAt: null,
  endAt: null,
  timeZone: timezones.ny,
}

const liveSaleReallySoonNY: Sale = {
  startAt: times.future10,
  liveStartAt: null,
  endAt: null,
  timeZone: timezones.ny,
}

const liveSaleInOneMinuteNY: Sale = {
  startAt: times.future01,
  liveStartAt: null,
  endAt: null,
  timeZone: timezones.ny,
}

const liveSaleSoonLA: Sale = {
  startAt: times.future50,
  liveStartAt: null,
  endAt: null,
  timeZone: timezones.la,
}

const finishedSaleNY: Sale = {
  startAt: times.past20,
  liveStartAt: null,
  endAt: times.past10,
  timeZone: timezones.ny,
}

const completeNotYetOpenSaleNY: Sale = {
  startAt: null,
  liveStartAt: times.future30,
  endAt: times.future40,
  timeZone: timezones.ny,
}

const completeOpenSaleNY: Sale = {
  startAt: null,
  liveStartAt: times.past10,
  endAt: times.future30,
  timeZone: timezones.ny,
}

const completeFinishedSaleNY: Sale = {
  startAt: null,
  liveStartAt: times.past20,
  endAt: times.past10,
  timeZone: timezones.ny,
}

const liveSaleDE: Sale = {
  startAt: null,
  liveStartAt: times.future60,
  endAt: null,
  timeZone: timezones.de,
}

const liveSaleWithHoursAndMinutes: Sale = {
  startAt: null,
  liveStartAt: times.future20,
  endAt: null,
  timeZone: timezones.ny,
}

const liveSale2021: Sale = {
  startAt: null,
  liveStartAt: times.future70,
  endAt: null,
  timeZone: timezones.de,
}

const liveSaleTomorrow: Sale = {
  startAt: null,
  liveStartAt: times.future30,
  endAt: null,
  timeZone: timezones.de,
}

const futureNoEndAtSale: Sale = {
  startAt: times.future30,
  liveStartAt: null,
  endAt: null,
  timeZone: timezones.ny,
}

const pastNoEndAtSale: Sale = {
  startAt: times.past10,
  liveStartAt: null,
  endAt: null,
  timeZone: timezones.ny,
}

const futureNoStartAtSale: Sale = {
  startAt: null,
  liveStartAt: null,
  endAt: times.future30,
  timeZone: timezones.ny,
}

const pastNoStartAtSale: Sale = {
  startAt: null,
  liveStartAt: null,
  endAt: times.past20,
  timeZone: timezones.ny,
}

beforeEach(() => {
  // @ts-ignore
  Date.now = jest.fn(() => new Date(times.present + "Z"))
})

describe("saleTime", () => {
  it("returns null when timezone is missing", () => {
    expect(
      saleTime({
        startAt: times.present,
        liveStartAt: times.present,
        endAt: times.present,
        timeZone: null,
      })
    ).toEqual({
      absolute: null,
      relative: null,
    })
  })
})

describe("#saleTime.absolute", () => {
  it("shows the time in the correct timezone", () => {
    expect(saleTime(liveSaleNY).absolute).toEqual("Live bidding begins Oct 1 at 3:00pm EDT")
    expect(saleTime(liveSaleDE).absolute).toEqual("Live bidding begins Oct 1 at 9:00am EDT")
  })
  it("recognises whether an auction is live or not", () => {
    expect(saleTime(liveSaleNY).absolute).toEqual("Live bidding begins Oct 1 at 3:00pm EDT")
    expect(saleTime(timedSaleNY).absolute).toEqual("Bidding begins Oct 1 at 3:00pm EDT")
  })
  it("recognises whether an auction is over or not", () => {
    expect(saleTime(finishedSaleNY).absolute).toEqual("Closed on Sep 1")
    expect(saleTime(completeNotYetOpenSaleNY).absolute).toEqual(
      "Live bidding begins Sep 5 at 3:00pm EDT"
    )
    expect(saleTime(completeFinishedSaleNY).absolute).toEqual("Closed on Sep 1")
  })
  it("works for currently open sales", () => {
    expect(saleTime(completeOpenSaleNY).absolute).toEqual("Live bidding closes Sep 5 at 3:00pm EDT")
  })
  it("works for null endAt", () => {
    expect(saleTime(futureNoEndAtSale).absolute).toEqual("Bidding begins Sep 5 at 3:00pm EDT")
    expect(saleTime(pastNoEndAtSale).absolute).toEqual(null)
  })
  it("works for null startAt and liveStartAt", () => {
    expect(saleTime(futureNoStartAtSale).absolute).toEqual(null)
    expect(saleTime(pastNoStartAtSale).absolute).toEqual("Closed on Aug 1")
  })
})

describe("#saleTime.relative", () => {
  it("shows the relative time for imminent sales", () => {
    expect(saleTime(liveSaleImminentNY).relative).toEqual("Starts in 4 hours")
    expect(saleTime(liveSaleSoonNY).relative).toEqual("Starts in 5 days")
    expect(saleTime(liveSaleReallySoonNY).relative).toEqual("Starts in 43 minutes")
  })

  it("doesn't show the relative time for a non-imminent sale", () => {
    expect(saleTime(liveSaleNY).relative).toEqual(null)
  })

  it("doesn't show the relative time for a recently finished sale", () => {
    expect(saleTime(finishedSaleNY).relative).toEqual(null)
  })

  it("handles timezone differences across midnight", () => {
    expect(saleTime(liveSaleSoonLA).relative).toEqual("Starts in 6 days")
  })

  it("handles breaks across years", () => {
    // @ts-ignore
    Date.now = jest.fn(() => new Date("2020-12-31T19:00:00Z"))
    expect(saleTime(liveSale2021).relative).toEqual("Starts in 2 days")
  })

  it("pluralises correctly", () => {
    expect(saleTime(liveSaleTomorrow).relative).toEqual("Starts in 18 hours")
    expect(saleTime(liveSaleInOneMinuteNY).relative).toEqual("Starts in 1 minute")
  })

  it("handles hours and minutes until sale correctly", () => {
    expect(saleTime(liveSaleWithHoursAndMinutes).relative).toEqual("Starts in 2 hours 32 minutes")
  })

  it("handles complete sales correctly", () => {
    expect(saleTime(completeNotYetOpenSaleNY).relative).toEqual("Starts in 1 day")
    expect(saleTime(completeFinishedSaleNY).relative).toEqual(null)
    expect(saleTime(completeOpenSaleNY).relative).toEqual("Ends in 1 day")
  })

  it("handles nulls correctly", () => {
    expect(saleTime(futureNoEndAtSale).relative).toEqual("Starts in 1 day")
    expect(saleTime(pastNoEndAtSale).relative).toEqual(null)
    expect(saleTime(futureNoStartAtSale).relative).toEqual(null)
    expect(saleTime(pastNoStartAtSale).relative).toEqual(null)
  })
})

const makeTime = (overrides: Partial<Time> = {}): Time => ({
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
  ...overrides,
})

describe("getTimerInfo", () => {
  describe("when sale has not started", () => {
    it("shows days when days >= 1", () => {
      expect(getTimerInfo(makeTime({ days: "02" }), { hasStarted: false })).toEqual({
        copy: "2 Days Until Bidding Starts",
        color: "blue100",
      })
    })

    it("uses singular 'Day' when days = 1", () => {
      expect(getTimerInfo(makeTime({ days: "01" }), { hasStarted: false })).toEqual({
        copy: "1 Day Until Bidding Starts",
        color: "blue100",
      })
    })

    it("shows hours and minutes when days < 1 and hours >= 1", () => {
      expect(getTimerInfo(makeTime({ hours: "03", minutes: "15" }), { hasStarted: false })).toEqual(
        {
          copy: "3h 15m Until Bidding Starts",
          color: "blue100",
        }
      )
    })

    it("shows minutes and seconds when days < 1 and hours < 1", () => {
      expect(
        getTimerInfo(makeTime({ minutes: "45", seconds: "30" }), { hasStarted: false })
      ).toEqual({
        copy: "45m 30s Until Bidding Starts",
        color: "blue100",
      })
    })
  })

  describe("when sale is extended", () => {
    it("shows extended format with red color", () => {
      expect(
        getTimerInfo(makeTime({ minutes: "05", seconds: "10" }), {
          hasStarted: true,
          isExtended: true,
        })
      ).toEqual({
        copy: "Extended: 5m 10s",
        color: "red100",
      })
    })
  })

  describe("when sale has started and isSaleInfo=true", () => {
    it("shows 'Lots are closing' when saleHasEnded=true", () => {
      expect(
        getTimerInfo(makeTime(), { hasStarted: true, isSaleInfo: true, saleHasEnded: true })
      ).toEqual({
        copy: "Lots are closing",
        color: "red100",
      })
    })

    it("shows days until lots close when days >= 1", () => {
      expect(
        getTimerInfo(makeTime({ days: "02", hours: "03" }), {
          hasStarted: true,
          isSaleInfo: true,
          saleHasEnded: false,
        })
      ).toEqual({
        copy: "2 Days Until Lots Start Closing",
        color: "blue100",
      })
    })

    it("uses singular 'Day' when days = 1", () => {
      expect(
        getTimerInfo(makeTime({ days: "01" }), {
          hasStarted: true,
          isSaleInfo: true,
          saleHasEnded: false,
        })
      ).toEqual({
        copy: "1 Day Until Lots Start Closing",
        color: "blue100",
      })
    })

    it("shows hours and minutes when days < 1 and hours >= 1", () => {
      expect(
        getTimerInfo(makeTime({ hours: "03", minutes: "15" }), {
          hasStarted: true,
          isSaleInfo: true,
          saleHasEnded: false,
        })
      ).toEqual({
        copy: "3h 15m Until Lots Start Closing",
        color: "red100",
      })
    })

    it("shows minutes and seconds when days < 1 and hours < 1", () => {
      expect(
        getTimerInfo(makeTime({ minutes: "45", seconds: "30" }), {
          hasStarted: true,
          isSaleInfo: true,
          saleHasEnded: false,
        })
      ).toEqual({
        copy: "45m 30s Until Lots Start Closing",
        color: "red100",
      })
    })
  })

  describe("when sale has started and isSaleInfo=false (lot timer)", () => {
    it("shows days and hours when days >= 1", () => {
      expect(
        getTimerInfo(makeTime({ days: "02", hours: "03" }), {
          hasStarted: true,
          isSaleInfo: false,
        })
      ).toEqual({
        copy: "2d 3h",
        color: "blue100",
      })
    })

    it("shows hours and minutes when days < 1 and hours >= 1", () => {
      expect(
        getTimerInfo(makeTime({ hours: "03", minutes: "15" }), {
          hasStarted: true,
          isSaleInfo: false,
        })
      ).toEqual({
        copy: "3h 15m",
        color: "blue100",
      })
    })

    it("shows minutes and seconds with red color when days < 1 and hours < 1", () => {
      expect(
        getTimerInfo(makeTime({ minutes: "45", seconds: "30" }), {
          hasStarted: true,
          isSaleInfo: false,
        })
      ).toEqual({
        copy: "45m 30s",
        color: "red100",
      })
    })
  })
})

describe("getAbsoluteTimeOfSale", () => {
  it("returns null when timeZone is missing", () => {
    expect(
      getAbsoluteTimeOfSale({
        startAt: times.future60,
        endAt: null,
        endedAt: null,
        timeZone: null,
      })
    ).toBeNull()
  })

  it("returns formatted start date when startAt is in the future", () => {
    expect(
      getAbsoluteTimeOfSale({
        startAt: times.future60,
        endAt: null,
        endedAt: null,
        timeZone: timezones.ny,
      })
    ).toEqual("Oct 1, 2020 • 3:00pm EDT")
  })

  it("returns 'Closed' string when endedAt is in the past", () => {
    expect(
      getAbsoluteTimeOfSale({
        startAt: null,
        endAt: null,
        endedAt: times.past20,
        timeZone: timezones.ny,
      })
    ).toEqual("Closed Aug 1, 2020 • 3:00pm EDT")
  })

  it("returns formatted end date when endAt is set and not ended", () => {
    expect(
      getAbsoluteTimeOfSale({
        startAt: null,
        endAt: times.future30,
        endedAt: null,
        timeZone: timezones.ny,
      })
    ).toEqual("Sep 5, 2020 • 3:00pm EDT")
  })

  it("returns null when no relevant dates are provided", () => {
    expect(
      getAbsoluteTimeOfSale({
        startAt: null,
        endAt: null,
        endedAt: null,
        timeZone: timezones.ny,
      })
    ).toBeNull()
  })
})

describe("useRelativeTimeOfSale", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date(times.present + "Z") })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns null initially", () => {
    const { result } = renderHook(() =>
      useRelativeTimeOfSale({
        startAt: times.past10,
        endAt: times.future30,
        endedAt: null,
        timeZone: timezones.ny,
      })
    )
    expect(result.current).toBeNull()
  })

  it("stays null after interval when endedAt is set", () => {
    const { result } = renderHook(() =>
      useRelativeTimeOfSale({
        startAt: times.past10,
        endAt: times.future30,
        endedAt: times.future20,
        timeZone: timezones.ny,
      })
    )
    act(() => {
      jest.advanceTimersByTime(1001)
    })
    expect(result.current).toBeNull()
  })

  it("stays null after interval when endAt is missing", () => {
    const { result } = renderHook(() =>
      useRelativeTimeOfSale({
        startAt: times.past10,
        endAt: null,
        endedAt: null,
        timeZone: timezones.ny,
      })
    )
    act(() => {
      jest.advanceTimersByTime(1001)
    })
    expect(result.current).toBeNull()
  })

  it("stays null after interval when startAt is missing", () => {
    const { result } = renderHook(() =>
      useRelativeTimeOfSale({
        startAt: null,
        endAt: times.future30,
        endedAt: null,
        timeZone: timezones.ny,
      })
    )
    act(() => {
      jest.advanceTimersByTime(1001)
    })
    expect(result.current).toBeNull()
  })

  it("returns timer info after interval fires for a valid in-progress sale", () => {
    const { result } = renderHook(() =>
      useRelativeTimeOfSale({
        startAt: times.past10,
        endAt: times.future30,
        endedAt: null,
        timeZone: timezones.ny,
      })
    )
    act(() => {
      jest.advanceTimersByTime(1001)
    })
    expect(result.current).not.toBeNull()
    expect(result.current).toMatchObject({
      copy: expect.any(String),
      color: expect.any(String),
    })
  })
})
