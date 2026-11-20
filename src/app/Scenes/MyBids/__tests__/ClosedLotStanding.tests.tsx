import { screen } from "@testing-library/react-native"
import { ClosedLotStanding_saleArtwork$data } from "__generated__/ClosedLotStanding_saleArtwork.graphql"
import { ClosedLotStanding } from "app/Scenes/MyBids/Components/ClosedLotStanding"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { merge } from "lodash"

jest.mock("@artsy/icons/native", () => {
  const { View } = require("react-native")
  return {
    ...jest.requireActual("@artsy/icons/native"),
    StarCircleFillIcon: () => <View testID="star-circle-fill-icon" />,
  }
})

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
    it("says 'You won!' if the user won the lot", async () => {
      await renderWithWrappers(
        <ClosedLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { soldStatus: "Sold" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("You won!", { exact: false })
    })

    it("says 'Outbid' if the the lot sold to someone else", async () => {
      await renderWithWrappers(
        <ClosedLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: false,
            lotState: { soldStatus: "Sold" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("Outbid", { exact: false })
    })

    it("says 'Passed' if the lot did not sell at all", async () => {
      await renderWithWrappers(
        <ClosedLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { soldStatus: "Passed" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("Passed", { exact: false })
    })
  })

  describe("artwork badge", () => {
    it("has a little star badge if the user won the lot", async () => {
      await renderWithWrappers(
        <ClosedLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { soldStatus: "Sold" },
          })}
        />
      )

      expect(screen.getAllByTestId("star-circle-fill-icon")).toHaveLength(1)
    })
  })

  describe("closing time", () => {
    it("renders the time the sale ended by default", async () => {
      await renderWithWrappers(<ClosedLotStanding saleArtwork={saleArtworkFixture()} />)
      expect(screen.root).toHaveTextContent("Closed Aug 5", { exact: false })
    })
  })

  describe("selling price", () => {
    it("shows selling price", async () => {
      await renderWithWrappers(<ClosedLotStanding saleArtwork={saleArtworkFixture()} />)
      expect(screen.root).toHaveTextContent("$100", { exact: false })
    })
  })
})
