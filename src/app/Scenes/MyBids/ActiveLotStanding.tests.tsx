import React from "react"

import { ActiveLotStanding_saleArtwork$data } from "__generated__/ActiveLotStanding_saleArtwork.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { merge } from "lodash"
import { ActiveLotStanding } from "./Components/ActiveLotStanding"

const defaultSaleArtwork = {
  isHighestBidder: true,
  estimate: "$100",
  artwork: {
    internalId: "internalId",
    href: "/artwork/maskull-lasserre-painting",
    image: {
      url: "https://d2v80f5yrouhh2.cloudfront.net/zrtyPc3hnFNl-1yv80qS2w/medium.jpg",
    },
  },
  sale: {
    endAt: "2020-08-05T15:00:00+00:00",
    status: "closed",
  },
  lotState: {
    soldStatus: "sold",
    sellingPrice: {
      display: "$100",
    },
  },
}

const saleArtworkFixture = (overrides = {}) => {
  return merge({}, defaultSaleArtwork, overrides) as unknown as ActiveLotStanding_saleArtwork$data
}

describe(ActiveLotStanding, () => {
  describe("User winning status", () => {
    it("says 'Highest bid' if the user is winning the lot", () => {
      const tree = renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "ReserveMet" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Highest bid' if the user is has the high bid and reserveStatus is UnknownReserve", () => {
      const tree = renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "UnknownReserve" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Highest bid' if the user is winning the lot but the reserveStatus is ReserveNotMet in a Live Auction", () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      const tree = renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            sale: { liveStartAt: date },
            lotState: { reserveStatus: "ReserveNotMet" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Reserve not met' if the user is winning the lot, but the reserveStatus is ReserveNotMet", () => {
      const tree = renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "ReserveNotMet" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Reserve not met")
    })

    it("says 'Outbid' if the user is outbid on the lot, but the reserveStatus is ReserveNotMet", () => {
      const tree = renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: false,
            lotState: { reserveStatus: "ReserveNotMet" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })

    it("says 'outbid' if the user is outbid on the lot and reserve is met", () => {
      const tree = renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: false,
            lotState: { reserveStatus: "ReserveMet" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })
  })

  describe("selling price", () => {
    it("shows floor selling price", () => {
      const tree = renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "ReserveMet" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("$100")
    })
  })
})
