import React from "react"

import { ClosedLotStanding_lotStanding } from "__generated__/ClosedLotStanding_lotStanding.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers_legacy } from "lib/tests/renderWithWrappers"
import { merge } from "lodash"
import { StarCircleFill } from "palette/svgs/sf"
import { ClosedLotStanding } from "../Components/ClosedLotStanding"

const defaultLotStanding = {
  isHighestBidder: true,
  lot: {
    internalID: "123",
    bidCount: 1,
    soldStatus: "Passed",
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
    sale: {
      endAt: "2020-08-05T15:00:00+00:00",
      status: "closed",
    },
  },
}

const lotStandingFixture = (overrides = {}) => {
  return (merge({}, defaultLotStanding, overrides) as unknown) as ClosedLotStanding_lotStanding
}

describe(ClosedLotStanding, () => {
  describe("result message", () => {
    it("says 'You won!' if the user won the lot", () => {
      const tree = renderWithWrappers_legacy(
        <ClosedLotStanding lotStanding={lotStandingFixture({ isHighestBidder: true, lot: { soldStatus: "Sold" } })} />
      )
      expect(extractText(tree.root)).toContain("You won!")
    })

    it("says 'Outbid' if the the lot sold to someone else", () => {
      const tree = renderWithWrappers_legacy(
        <ClosedLotStanding lotStanding={lotStandingFixture({ isHighestBidder: false, lot: { soldStatus: "Sold" } })} />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })

    it("says 'Passed' if the lot did not sell at all", () => {
      const tree = renderWithWrappers_legacy(
        <ClosedLotStanding lotStanding={lotStandingFixture({ isHighestBidder: true, lot: { soldStatus: "Passed" } })} />
      )
      expect(extractText(tree.root)).toContain("Passed")
    })
  })

  describe("artwork badge", () => {
    it("has a little star badge if the user won the lot", () => {
      expect(
        renderWithWrappers_legacy(
          <ClosedLotStanding lotStanding={lotStandingFixture({ isHighestBidder: true, lot: { soldStatus: "Sold" } })} />
        ).root.findAllByType(StarCircleFill).length
      ).toBe(1)
    })
  })

  describe("closing time", () => {
    it("renders the time the sale ended by default", () => {
      const tree = renderWithWrappers_legacy(<ClosedLotStanding lotStanding={lotStandingFixture()} />)
      expect(extractText(tree.root)).toContain("Closed Aug 5")
    })
  })

  describe("selling price", () => {
    it("shows selling price", () => {
      const tree = renderWithWrappers_legacy(<ClosedLotStanding lotStanding={lotStandingFixture()} />)
      expect(extractText(tree.root)).toContain("CHF 1,800")
    })
  })
})
