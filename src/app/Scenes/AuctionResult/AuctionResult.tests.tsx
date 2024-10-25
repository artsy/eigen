import { screen } from "@testing-library/react-native"
import { AuctionResult_artist$data } from "__generated__/AuctionResult_artist.graphql"
import { AuctionResult_auctionResult$data } from "__generated__/AuctionResult_auctionResult.graphql"
import { AuctionResultQueryRenderer } from "app/Scenes/AuctionResult/AuctionResult"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Image } from "react-native"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

describe("Activity", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()

    const getSizeMock = jest.spyOn(Image, "getSize")
    getSizeMock.mockImplementation(() => {
      /* do nothing */
    })
  })

  it("renders items", async () => {
    renderWithHookWrappersTL(
      <AuctionResultQueryRenderer
        auctionResultInternalID="auction-result-id"
        artistID="artist-id"
      />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
      AuctionResult: () => auctionResultFixture,
      Artist: () => artistFixture,
    })

    await flushPromiseQueue()

    expect(screen.getAllByText("Pulp Fiction")).toBeTruthy()
    expect(screen.getAllByText("Bonhams")).toBeTruthy()
    expect(screen.getAllByText("Pre-sale Estimate")).toBeTruthy()
    expect(screen.getAllByText("£70,000–£100,000")).toBeTruthy()
    expect(screen.getAllByText("London, New Bond Street")).toBeTruthy()
    expect(screen.getAllByText("Lot number")).toBeTruthy()
  })
})

const auctionResultFixture: CleanRelayFragment<AuctionResult_auctionResult$data> = {
  artistID: "4dd1584de0091e000100207c",
  boughtIn: false,
  categoryText: "Print",
  currency: "GBP",
  dateText: "2004",
  dimensionText: "47.6 x 68.8 cm",
  dimensions: { height: 47.6, width: 68.8 },
  estimate: { display: "£70,000–£100,000", high: 10000000, low: 7000000 },
  id: "QXVjdGlvblJlc3VsdDoxMDAxNTM4",
  images: {
    larger: {
      aspectRatio: 1,
      height: null,
      url: "https://d2v80f5yrouhh2.cloudfront.net/3Q2wEQyQIuP9Swc1pOXUlw/larger.jpg",
      width: null,
    },
  },
  internalID: "1001538",
  isUpcoming: true,
  location: "London, New Bond Street",
  lotNumber: "1234",
  mediumText: "signed",
  organization: "Bonhams",
  performance: { mid: null },
  priceRealized: { cents: null, centsUSD: null, display: null, displayUSD: null },
  saleDate: "2023-03-29T11:00:00+02:00",
  saleTitle: "British. Cool.",
  title: "Pulp Fiction",
}

const artistFixture: CleanRelayFragment<AuctionResult_artist$data> = {
  href: "/artist/banksy",
  name: "Banksy",
}
