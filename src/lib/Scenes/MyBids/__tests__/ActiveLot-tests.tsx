import React from "react"

import { ActiveLot_lotStanding } from "__generated__/ActiveLot_lotStanding.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { merge } from "lodash"
import { ActiveLot } from "../Components/ActiveLot"

const defaultLotStanding = {
  isHighestBidder: true,
  lotState: {
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
  return (merge({}, defaultLotStanding, overrides) as unknown) as ActiveLot_lotStanding
}

describe(ActiveLot, () => {
  describe("User winning status", () => {
    it("says 'Highest bid' if the user is winning the lot", () => {
      const tree = renderWithWrappers(
        <ActiveLot
          lotStanding={lotStandingFixture({ isHighestBidder: true, lotState: { reserveStatus: "ReserveMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Highest bid' if the user is has the high bid and reserveStatus is UnknownReserve", () => {
      const tree = renderWithWrappers(
        <ActiveLot
          lotStanding={lotStandingFixture({ isHighestBidder: true, lotState: { reserveStatus: "UnknownReserve" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Highest bid' if the user is winning the lot but the reserveStatus is ReserveNotMet in a Live Auction", () => {
      const tree = renderWithWrappers(
        <ActiveLot
          lotStanding={lotStandingFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "ReserveNotMet" },
            saleArtwork: { sale: { liveStartAt: new Date().toJSON() } },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Highest bid")
    })

    it("says 'Reserve not met' if the user is winning the lot, but the reserveStatus is ReserveNotMet", () => {
      const tree = renderWithWrappers(
        <ActiveLot
          lotStanding={lotStandingFixture({ isHighestBidder: true, lotState: { reserveStatus: "ReserveNotMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Reserve not met")
    })

    it("says 'Outbid' if the user is outbid on the lot, but the reserveStatus is ReserveNotMet", () => {
      const tree = renderWithWrappers(
        <ActiveLot
          lotStanding={lotStandingFixture({ isHighestBidder: false, lotState: { reserveStatus: "ReserveNotMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })

    it("says 'outbid' if the user is outbid on the lot and reserve is met", () => {
      const tree = renderWithWrappers(
        <ActiveLot
          lotStanding={lotStandingFixture({ isHighestBidder: false, lotState: { reserveStatus: "ReserveMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })
  })

  describe("selling price", () => {
    it("shows floor selling price", () => {
      const tree = renderWithWrappers(
        <ActiveLot
          lotStanding={lotStandingFixture({ isHighestBidder: true, lotState: { reserveStatus: "ReserveMet" } })}
        />
      )
      expect(extractText(tree.root)).toContain("CHF 1,800")
    })
  })
})
