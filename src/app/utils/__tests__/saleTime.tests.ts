import { IANATimezone } from "app/utils/IANATimezone"
import { saleTime } from "app/utils/saleTime"

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
