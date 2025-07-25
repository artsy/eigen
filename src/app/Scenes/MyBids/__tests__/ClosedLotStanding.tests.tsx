import { StarCircleFillIcon } from "@artsy/icons/native"
import { ClosedLotStanding_saleArtwork$data } from "__generated__/ClosedLotStanding_saleArtwork.graphql"
import { ClosedLotStanding } from "app/Scenes/MyBids/Components/ClosedLotStanding"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { merge } from "lodash"

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
    isLiveOpen: false,
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
  return merge({}, defaultSaleArtwork, overrides) as unknown as ClosedLotStanding_saleArtwork$data
}

describe(ClosedLotStanding, () => {
  describe("result message", () => {
    it("says 'You won!' if the user won the lot", () => {
      const tree = renderWithWrappersLEGACY(
        <ClosedLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { soldStatus: "Sold" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("You won!")
    })

    it("says 'Outbid' if the the lot sold to someone else", () => {
      const tree = renderWithWrappersLEGACY(
        <ClosedLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: false,
            lotState: { soldStatus: "Sold" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Outbid")
    })

    it("says 'Passed' if the lot did not sell at all", () => {
      const tree = renderWithWrappersLEGACY(
        <ClosedLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { soldStatus: "Passed" },
          })}
        />
      )
      expect(extractText(tree.root)).toContain("Passed")
    })
  })

  describe("artwork badge", () => {
    it("has a little star badge if the user won the lot", () => {
      expect(
        renderWithWrappersLEGACY(
          <ClosedLotStanding
            saleArtwork={saleArtworkFixture({
              isHighestBidder: true,
              lotState: { soldStatus: "Sold" },
            })}
          />
        ).root.findAllByType(StarCircleFillIcon).length
      ).toBe(1)
    })
  })

  describe("closing time", () => {
    it("renders the time the sale ended by default", () => {
      const tree = renderWithWrappersLEGACY(
        <ClosedLotStanding saleArtwork={saleArtworkFixture()} />
      )
      expect(extractText(tree.root)).toContain("Closed Aug 5")
    })
  })

  describe("selling price", () => {
    it("shows selling price", () => {
      const tree = renderWithWrappersLEGACY(
        <ClosedLotStanding saleArtwork={saleArtworkFixture()} />
      )
      expect(extractText(tree.root)).toContain("$100")
    })
  })
})
