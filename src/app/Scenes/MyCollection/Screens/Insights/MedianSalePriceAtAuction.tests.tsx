import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { useLazyLoadQuery } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import {
  MedianSalePriceAtAuction,
  MedianSalePriceAtAuctionScreenQuery,
} from "./MedianSalePriceAtAuction"

jest.unmock("react-relay")

describe("MedianSalePriceAtAuction", () => {
  const TestRenderer = () => {
    useLazyLoadQuery<MedianSalePriceAtAuctionQuery>(MedianSalePriceAtAuctionScreenQuery, {
      artistID: "artist-id",
      artistId: "artist-id",
      medium: "medium",
    })

    return <MedianSalePriceAtAuction artistID="artist-id" initialCategory="Painting" />
  }

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("renders title", async () => {
    const { getByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({ data: mockResult })
    })

    await flushPromiseQueue()

    expect(getByTestId("Median_Auction_Price_title")).toBeTruthy()
  })
})

const mockResult = {
  artist: {
    internalID: "artist-id",
    name: "Artist Name",
    imageUrl: "image-url",
  },
  me: {
    myCollectionInfo: {
      artistsCount: 3,
    },
  },
}
