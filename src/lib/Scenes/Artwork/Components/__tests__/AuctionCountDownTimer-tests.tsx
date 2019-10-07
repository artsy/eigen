import { Theme, TimeRemaining } from "@artsy/palette"
import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { mockTimezone } from "lib/tests/mockTimezone"
import { Settings } from "luxon"
import moment from "moment"
import React from "react"
import { AuctionCountDownTimer } from "../AuctionCountDownTimer"

const realNow = Settings.now
const realDefaultZone = Settings.defaultZoneName

describe("AuctionCountDownTimer", () => {
  beforeAll(() => {
    Settings.defaultZoneName = "America/New_York"
    Settings.now = () => new Date("2019-08-15T12:00:00+00:00").valueOf()
  })

  afterAll(() => {
    Settings.now = realNow
    Settings.defaultZoneName = realDefaultZone
  })

  it("renders formattedStartDateTime", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          startAt: "2019-08-15T19:22:00+00:00",
          endAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: null,
          formattedStartDateTime: "Ends Aug 16 at 8:20pm UTC",
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

  it("renders the correct countdown time using endAt if auctionState hasStarted", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          startAt: "2019-08-15T19:22:00+00:00",
          endAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: null,
          formattedStartDateTime: "Ends Aug 16 at 8:20pm UTC",
        },
      },
    }
    const component = mount(
      <Theme>
        <AuctionCountDownTimer artwork={artwork} auctionState="hasStarted" />
      </Theme>
    )
    expect(component.find(TimeRemaining).text()).toContain("01d 08h 20m 00s")
  })

  it("renders the correct countdown time when the sale has started but the live sale has not", () => {
    mockTimezone("America/Los_Angeles")
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          startAt: "2019-08-15T19:22:00+00:00",
          endAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: "2019-10-15T19:22:00+00:00",
          formattedStartDateTime: "Ends Aug 16 at 8:20pm UTC",
        },
      },
    }
    const component = mount(
      <Theme>
        <AuctionCountDownTimer artwork={artwork} />
      </Theme>
    )
    expect(component.find(TimeRemaining).text()).toContain("01d 08h 20m 00s")
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

  xit("doesn't render if startAt is null", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          startAt: null,
          endAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: null,
          formattedStartDateTime: "Ends Aug 16 at 8:20pm UTC",
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

  xit("doesn't render if endAt is null", () => {
    const artwork = {
      ...ArtworkFixture,
      ...{
        sale: {
          endAt: null,
          startAt: "2019-08-16T20:20:00+00:00",
          liveStartAt: null,
          formattedStartDateTime: "Ends Aug 16 at 8:20pm UTC",
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
          formattedStartDateTime: "Starts Aug 16 at 8:20pm UTC",
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
