import { Theme, TimeRemaining } from "@artsy/palette"
import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { Settings } from "luxon"
import moment from "moment"
import "moment-timezone"
import React from "react"
import { AuctionCountDownTimer } from "../AuctionCountDownTimer"

const realNow = Settings.now
const realDefaultZone = Settings.defaultZoneName

describe("AuctionCountDownTimer", () => {
  // beforeAll(() => {
  //   Settings.defaultZoneName = "America/New_York"
  //   Settings.now = () => new Date("2019-08-15T12:00:00+00:00").valueOf()
  // })

  // afterAll(() => {
  //   Settings.now = realNow
  //   Settings.defaultZoneName = realDefaultZone
  // })

  const dateNow = 1565870400000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  let oneDayAgo
  let oneDayFromNow
  let oneWeekFromNow
  let oneMonthFromNow
  let oneYearFromNow
  let today

  beforeEach(() => {
    jest.useFakeTimers()

    // Thursday, May 10, 2018 8:22:32.000 PM UTC
    Date.now = () => dateNow

    today = moment(dateNow).toISOString()

    oneDayFromNow = moment(dateNow)
      .add(1, "day")
      .toISOString()

    // oneWeekFromNow = moment(dateNow)
    //   .add(1, "week")
    //   .toISOString()
    // oneMonthFromNow = moment(dateNow)
    //   .add(1, "week")
    //   .toISOString()
    oneYearFromNow = moment(dateNow)
      .add(1, "year")
      .toISOString()

    oneDayAgo = moment(dateNow)
      .subtract(1, "day")
      .toISOString()
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
