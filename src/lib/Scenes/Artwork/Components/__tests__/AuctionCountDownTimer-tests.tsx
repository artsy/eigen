import { Theme, TimeRemaining } from "@artsy/palette"
import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import moment from "moment"
import "moment-timezone"
import React from "react"
import { AuctionCountDownTimer, timeUntil } from "../AuctionCountDownTimer"

describe("AuctionCountDownTimer", () => {
  const dateNow = 1565870400000 // 2019-08-15T12:00:00.000Z in milliseconds
  let oneDayAgo
  let oneDayFromNow
  let oneYearFromNow

  beforeEach(() => {
    jest.useFakeTimers()

    // 2019-08-15T12:00:00.000Z
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

  describe("timeUntil", () => {
    it("returns 'Ended' string when auction hasEnded", () => {
      const startAt = oneDayAgo
      const liveStartAt = oneDayAgo
      const endAt = oneDayAgo
      const auctionState = "hasEnded"
      const date = timeUntil(startAt, liveStartAt, endAt, auctionState)
      expect(date).toEqual("Ended Aug 14")
    })

    it("returns 'Ended' string with year when auction hasEnded over a year ago", () => {
      const startAt = oneDayAgo
      const liveStartAt = oneDayAgo
      const endAt = oneYearFromNow
      const auctionState = "hasEnded"
      const date = timeUntil(startAt, liveStartAt, endAt, auctionState)
      expect(date).toEqual("Ended Aug 15, 2020")
    })

    it("returns 'Ends' string when sale has started and there is no live sale", () => {
      const startAt = oneDayAgo
      const liveStartAt = null
      const endAt = oneDayFromNow
      const auctionState = "hasStarted"
      const date = timeUntil(startAt, liveStartAt, endAt, auctionState)
      expect(date).toEqual("Ends Aug 16, 8:00am")
    })

    it("returns 'Starts' string when auction isPreview", () => {
      const startAt = oneDayFromNow
      const liveStartAt = oneDayFromNow
      const endAt = oneYearFromNow
      const auctionState = "isPreview"
      const date = timeUntil(startAt, liveStartAt, endAt, auctionState)
      expect(date).toEqual("Starts Aug 16, 8:00am")
    })
    it("returns 'Live' string when auction has started but live sale has not", () => {
      const startAt = oneDayAgo
      const liveStartAt = oneDayFromNow
      const endAt = oneYearFromNow
      const auctionState = "hasStarted"
      const date = timeUntil(startAt, liveStartAt, endAt, auctionState)
      expect(date).toEqual("Live Aug 16, 8:00am")
    })

    it("returns 'In progress' string when auction is live", () => {
      const startAt = oneDayAgo
      const liveStartAt = oneDayAgo
      const endAt = oneDayFromNow
      const auctionState = "isLive"
      const date = timeUntil(startAt, liveStartAt, endAt, auctionState)
      expect(date).toEqual("In progress")
    })
  })

  xit("renders correct label for timer", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          startAt: "2019-08-15T19:22:00+00:00",
          endAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: null,
        },
      },
    }
    const component = mount(
      <Theme>
        <AuctionCountDownTimer artwork={artwork} auctionState="hasStarted" />
      </Theme>
    )
    expect(component.find(TimeRemaining).text()).toContain("Ends Aug 16 at 8:20pm UTC")
  })

  it("renders the correct countdown time and label using endAt if auctionState hasStarted", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          startAt: "2019-08-15T19:22:00+00:00",
          endAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: null,
        },
      },
    }
    const component = mount(
      <Theme>
        <AuctionCountDownTimer artwork={artwork} auctionState="hasStarted" />
      </Theme>
    )
    expect(component.find(TimeRemaining).text()).toContain("01d 08h 20m 00sEnds Aug 16, 4:20pm")
  })

  it("renders the correct countdown time and label when the sale has started but the live sale has not", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          startAt: "2019-08-14T19:22:00+00:00",
          liveStartAt: "2019-09-15T19:22:00+00:00",
          endAt: "2019-10-16T20:20:00+00:00",
        },
      },
    }
    const component = mount(
      <Theme>
        <AuctionCountDownTimer artwork={artwork} auctionState="hasStarted" />
      </Theme>
    )

    expect(component.find(TimeRemaining).text()).toContain("31d 07h 22m 00sLive Sep 15, 3:22pm")
  })

  it("doesn't render if sale is null", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: null,
      },
    }
    const component = mount(
      <Theme>
        <AuctionCountDownTimer artwork={artwork} auctionState="hasStarted" />
      </Theme>
    )
    expect(component.find(TimeRemaining).length).toEqual(0)
  })

  it("doesn't render if endAt is null but sale has started and there is no live sale", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          endAt: null,
          startAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: null,
        },
      },
    }
    const component = mount(
      <Theme>
        <AuctionCountDownTimer artwork={artwork} auctionState="hasStarted" />
      </Theme>
    )
    expect(component.find(TimeRemaining).length).toEqual(0)
  })

  it("uses startAt if auctionState isPreview", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          endAt: "2020-08-16T20:20:00+00:00",
          startAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: null,
        },
      },
    }
    const component = mount(
      <Theme>
        <AuctionCountDownTimer artwork={artwork} auctionState="isPreview" />
      </Theme>
    )
    expect(component.find(TimeRemaining).text()).toContain("01d 08h 20m 00s")
  })
})
