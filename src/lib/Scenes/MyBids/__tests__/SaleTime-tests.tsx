jest.mock("moment-timezone", () => {
  const CURRENT_TIME = "2020-07-31T15:21:14-04:00"
  const TIME_ZONE = "America/New_York"

  const actual = jest.requireActual("moment-timezone")
  const moment = (time: string) => (!!time ? actual(time) : actual(CURRENT_TIME))
  moment.tz = { guess: () => TIME_ZONE }

  return moment
})
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { BoltFill } from "palette/svgs/sf/BoltFill"
import { Stopwatch } from "palette/svgs/sf/Stopwatch"
import React from "react"
import { SaleTime } from "../Components/SaleTime"

const renderText = (node: React.ReactElement) => extractText(renderWithWrappers(node).root)

describe("#saleTime", () => {
  it("displays today and time if the sale goes live in 24 hours or less", () => {
    expect(renderText(<SaleTime sale={{ liveStartAt: "2020-07-31T15:00:00+00:00" }} />)).toEqual(
      "Live bidding begins today at 11:00am"
    )
    expect(renderText(<SaleTime sale={{ liveStartAt: "2020-07-31T16:00:00+00:00" }} />)).toEqual(
      "Live bidding begins today at 12:00pm"
    )

    expect(renderText(<SaleTime sale={{ liveStartAt: "2020-07-31T17:00:00+00:00" }} />)).toEqual(
      "Live bidding begins today at 1:00pm"
    )
  })

  describe("live sale", () => {
    it("has a little lightning bolt", () => {
      expect(
        renderWithWrappers(<SaleTime sale={{ liveStartAt: "2020-08-01T15:00:00+00:00" }} />).root.findAllByType(
          BoltFill
        ).length
      ).toBe(1)
    })
    it("displays today and time if the sale goes live in 24-48 hours", () => {
      expect(renderText(<SaleTime sale={{ liveStartAt: "2020-08-01T15:00:00+00:00" }} />)).toEqual(
        "Live bidding begins tomorrow at 11:00am"
      )
      expect(renderText(<SaleTime sale={{ liveStartAt: "2020-08-01T16:00:00+00:00" }} />)).toEqual(
        "Live bidding begins tomorrow at 12:00pm"
      )
      expect(renderText(<SaleTime sale={{ liveStartAt: "2020-08-01T17:00:00+00:00" }} />)).toEqual(
        "Live bidding begins tomorrow at 1:00pm"
      )
    })

    it("displays today and time if the sale goes live in more than 48 hours", () => {
      expect(renderText(<SaleTime sale={{ liveStartAt: "2020-08-02T15:00:00+00:00" }} />)).toEqual(
        "Live bidding begins at 11:00am on 8/2"
      )
      expect(renderText(<SaleTime sale={{ liveStartAt: "2020-08-02T16:00:00+00:00" }} />)).toEqual(
        "Live bidding begins at 12:00pm on 8/2"
      )
      expect(renderText(<SaleTime sale={{ liveStartAt: "2020-08-02T17:00:00+00:00" }} />)).toEqual(
        "Live bidding begins at 1:00pm on 8/2"
      )
    })
  })

  describe("timed auction", () => {
    it("has a little stopwatch", () => {
      expect(
        renderWithWrappers(<SaleTime sale={{ endAt: "2020-08-01T15:00:00+00:00" }} />).root.findAllByType(Stopwatch)
          .length
      ).toBe(1)
    })
    it("displays today and time if the sale closes in 24 hours or less", () => {
      expect(renderText(<SaleTime sale={{ endAt: "2020-07-31T15:00:00+00:00" }} />)).toEqual("Closes today at 11:00am")
      expect(renderText(<SaleTime sale={{ endAt: "2020-07-31T16:00:00+00:00" }} />)).toEqual("Closes today at 12:00pm")
      expect(renderText(<SaleTime sale={{ endAt: "2020-07-31T17:00:00+00:00" }} />)).toEqual("Closes today at 1:00pm")
    })

    it("displays today and time if the sale closes in 24-48 hours", () => {
      expect(renderText(<SaleTime sale={{ endAt: "2020-08-01T15:00:00+00:00" }} />)).toEqual(
        "Closes tomorrow at 11:00am"
      )
      expect(renderText(<SaleTime sale={{ endAt: "2020-08-01T16:00:00+00:00" }} />)).toEqual(
        "Closes tomorrow at 12:00pm"
      )
      expect(renderText(<SaleTime sale={{ endAt: "2020-08-01T17:00:00+00:00" }} />)).toEqual(
        "Closes tomorrow at 1:00pm"
      )
    })

    it("displays today and time if the sale closes in more than 48 hours", () => {
      expect(renderText(<SaleTime sale={{ endAt: "2020-08-02T15:00:00+00:00" }} />)).toEqual("Closes at 11:00am on 8/2")
      expect(renderText(<SaleTime sale={{ endAt: "2020-08-02T16:00:00+00:00" }} />)).toEqual("Closes at 12:00pm on 8/2")
      expect(renderText(<SaleTime sale={{ endAt: "2020-08-02T17:00:00+00:00" }} />)).toEqual("Closes at 1:00pm on 8/2")
    })
  })
})
