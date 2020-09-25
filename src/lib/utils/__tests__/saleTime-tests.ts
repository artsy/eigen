// import moment from "moment-timezone"

const TIME_ZONE_NY = "America/New_York"
const TIME_ZONE_LA = "America/Los_Angeles"
const TIME_ZONE_DE = "Europe/Berlin"

// @ts-ignore
Date.now = jest.fn(() => new Date("2020-09-04T19:00:00Z"))
jest.mock("moment-timezone", () => {
  const momentMock = require.requireActual("moment-timezone")
  momentMock.tz.setDefault("America/New_York")
  momentMock.tz.guess = () => "America/New_York"
  return momentMock
})

import { saleTime } from "../saleTime"

const liveSaleNY = {
  liveStartAt: "2020-10-01T15:00:00",
  timeZone: TIME_ZONE_NY,
}

const timedSaleNY = {
  startAt: "2020-10-01T15:00:00",
  timeZone: TIME_ZONE_NY,
}

const liveSaleImminentNY = {
  liveStartAt: "2020-09-04T19:00:00",
  timeZone: TIME_ZONE_NY,
}

const liveSaleSoonNY = {
  startAt: "2020-09-09T15:00:00",
  timeZone: TIME_ZONE_NY,
}

const liveSaleSoonLA = {
  startAt: "2020-09-09T21:00:00",
  timeZone: TIME_ZONE_LA,
}

const finishedSaleNY = {
  startAt: "2020-08-01T15:00:00",
  endAt: "2020-09-01T15:00:00",
  timeZone: TIME_ZONE_NY,
}

const finishedLiveSaleNY = {
  liveStartAt: "2020-08-01T15:00:00",
  startAt: "2020-08-01T15:00:00",
  endAt: "2021-08-01T15:00:00",
  timeZone: TIME_ZONE_NY,
}

const liveSaleDE = {
  liveStartAt: "2020-10-01T15:00:00",
  timeZone: TIME_ZONE_DE,
}

const liveSale2021 = {
  liveStartAt: "2021-01-02T15:00:00",
  timeZone: TIME_ZONE_DE,
}

const liveSaleTomorrow = {
  liveStartAt: "2020-09-05T15:00:00",
  timeZone: TIME_ZONE_DE,
}

describe("#saleTime.absoluteConcatenated", () => {
  it("shows the time in the correct timezone", () => {
    expect(saleTime(liveSaleNY)?.absoluteConcatenated).toEqual("Live bidding begins Oct 1 at 3:00pm EDT")
    expect(saleTime(liveSaleDE)?.absoluteConcatenated).toEqual("Live bidding begins Oct 1 at 9:00am EDT")
  })
  it("recognises whether an auction is live or not", () => {
    expect(saleTime(liveSaleNY)?.absoluteConcatenated).toEqual("Live bidding begins Oct 1 at 3:00pm EDT")
    expect(saleTime(timedSaleNY)?.absoluteConcatenated).toEqual("Bidding begins Oct 1 at 3:00pm EDT")
  })
  it("recognises whether an auction is over or not", () => {
    expect(saleTime(finishedSaleNY)?.absoluteConcatenated).toEqual("Closed on Sep 1")
    expect(saleTime(finishedLiveSaleNY)?.absoluteConcatenated).toEqual("Live bidding closes Aug 1 at 3:00pm")
  })
})

describe("#saleTime.relative", () => {
  it("shows the relative time for imminent sales", () => {
    expect(saleTime(liveSaleImminentNY)?.relative).toEqual("Starts in 4 hours")
    expect(saleTime(liveSaleSoonNY)?.relative).toEqual("Starts in 5 days")
  })

  it("doesn't show the relative time for a non-imminent sale", () => {
    expect(saleTime(liveSaleNY)?.relative).toEqual(null)
  })

  it("doesn't show the relative time for a recently finished sale", () => {
    expect(saleTime(finishedSaleNY)?.relative).toEqual(null)
  })

  it("handles timezone differences across midnight", () => {
    expect(saleTime(liveSaleSoonLA)?.relative).toEqual("Starts in 6 days")
  })

  it("pluralises correctly", () => {
    expect(saleTime(liveSaleTomorrow)?.relative).toEqual("Starts in 1 day")
  })

  it("handles breaks across years", () => {
    // @ts-ignore
    Date.now = jest.fn(() => new Date("2020-12-31T19:00:00Z"))
    expect(saleTime(liveSale2021)?.relative).toEqual("Starts in 2 days")
  })
})
