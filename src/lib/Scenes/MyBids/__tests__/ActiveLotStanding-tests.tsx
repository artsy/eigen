import React from "react"

import { ActiveLotStanding_lotStanding } from "__generated__/ActiveLotStanding_lotStanding.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers_legacy } from "lib/tests/renderWithWrappers"
import { merge } from "lodash"
import { ActiveLotStanding } from "../Components/ActiveLotStanding"

const defaultLotStanding = {
  isHighestBidder: true,
  lot: {
    internalID: "123",
    bidCount: 1,
    soldStatus: "ForSale",
    reserveStatus: "ReserveMet",
    sellingPrice: {
      display: "CHF 1,800",
    },
    askingPrice: {
      display: "CHF 2,000",
    },
  },
  saleArtwork: {
    lotLabel: "3",
    artwork: {
      artistNames: "Maskull Lasserre",
      href: "/artwork/maskull-lasserre-painting",
      image: {
        url: "https://d2v80f5yrouhh2.cloudfront.net/zrtyPc3hnFNl-1yv80qS2w/medium.jpg",
      },
    },
    sale: {},
  },
}

const lotStandingFixture = (overrides = {}) => {
  return (merge({}, defaultLotStanding, overrides) as unknown) as ActiveLotStanding_lotStanding
}

describe(ActiveLotStanding, () => {
  describe("User winning status", () => {
    it("says 'Highest bid' if the user is winning the lot", () => {
      const tree = renderWithWrappers_legacy(
        <ActiveLotStanding
          lotStanding={lotStandingFixture({ isHighestBidder: true, lot: { reserveStatus: "ReserveMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Highest bid' if the user is has the high bid and reserveStatus is UnknownReserve", () => {
      const tree = renderWithWrappers_legacy(
        <ActiveLotStanding
          lotStanding={lotStandingFixture({ isHighestBidder: true, lot: { reserveStatus: "UnknownReserve" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Highest bid' if the user is winning the lot but the reserveStatus is ReserveNotMet in a Live Auction", () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      const tree = renderWithWrappers_legacy(
        <ActiveLotStanding
          lotStanding={lotStandingFixture({
            isHighestBidder: true,
            lot: { reserveStatus: "ReserveNotMet" },
            saleArtwork: { sale: { liveStartAt: date } },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Reserve not met' if the user is winning the lot, but the reserveStatus is ReserveNotMet", () => {
      const tree = renderWithWrappers_legacy(
        <ActiveLotStanding
          lotStanding={lotStandingFixture({ isHighestBidder: true, lot: { reserveStatus: "ReserveNotMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Reserve not met")
    })

    it("says 'Outbid' if the user is outbid on the lot, but the reserveStatus is ReserveNotMet", () => {
      const tree = renderWithWrappers_legacy(
        <ActiveLotStanding
          lotStanding={lotStandingFixture({ isHighestBidder: false, lot: { reserveStatus: "ReserveNotMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })

    it("says 'outbid' if the user is outbid on the lot and reserve is met", () => {
      const tree = renderWithWrappers_legacy(
        <ActiveLotStanding
          lotStanding={lotStandingFixture({ isHighestBidder: false, lot: { reserveStatus: "ReserveMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })
  })

  describe("selling price", () => {
    it("shows floor selling price", () => {
      const tree = renderWithWrappers_legacy(
        <ActiveLotStanding
          lotStanding={lotStandingFixture({ isHighestBidder: true, lot: { reserveStatus: "ReserveMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("CHF 1,800")
    })
  })
})
