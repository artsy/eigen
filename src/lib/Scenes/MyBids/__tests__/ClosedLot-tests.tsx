import React from "react"

import { ClosedLot_lotStanding } from "__generated__/ClosedLot_lotStanding.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { merge } from "lodash"
import { StarCircleFill } from "palette/svgs/sf"
import { ClosedLot } from "../Components/ClosedLot"

const defaultLotStanding = {
  isHighestBidder: true,
  lotState: {
    internalID: "123",
    bidCount: 1,
    soldStatus: "Passed",
    reserveStatus: "ReserveMet",
    sellingPrice: {
      displayAmount: "CHF 1,800",
    },
    askingPrice: {
      displayAmount: "CHF 2,000",
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
    sale: {
      displayTimelyAt: "Closed on 7/15/20",
    },
  },
}

const lotStandingFixture = (overrides = {}) => {
  return (merge({}, defaultLotStanding, overrides) as unknown) as ClosedLot_lotStanding
}

describe(ClosedLot, () => {
  describe("result message", () => {
    it("says 'You won!' if the user won the lot", () => {
      const tree = renderWithWrappers(
        <ClosedLot lotStanding={lotStandingFixture({ isHighestBidder: true, lotState: { soldStatus: "Sold" } })} />
      )
      expect(extractText(tree.root)).toContain("You won!")
    })

    it("says 'Outbid' if the the lot sold to someone else", () => {
      const tree = renderWithWrappers(
        <ClosedLot lotStanding={lotStandingFixture({ isHighestBidder: false, lotState: { soldStatus: "Sold" } })} />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })

    it("says 'Passed' if the lot did not sell at all", () => {
      const tree = renderWithWrappers(
        <ClosedLot lotStanding={lotStandingFixture({ isHighestBidder: true, lotState: { soldStatus: "Passed" } })} />
      )
      expect(extractText(tree.root)).toContain("Passed")
    })
  })

  describe("artwork badge", () => {
    it("has a little star badge if the user won the lot", () => {
      expect(
        renderWithWrappers(
          <ClosedLot lotStanding={lotStandingFixture({ isHighestBidder: true, lotState: { soldStatus: "Sold" } })} />
        ).root.findAllByType(StarCircleFill).length
      ).toBe(1)
    })
  })
})
