import { AverageSalePriceAtAuctionQuery } from "__generated__/AverageSalePriceAtAuctionQuery.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { useLazyLoadQuery } from "react-relay"
import { act } from "react-test-renderer"
import {
  AverageSalePriceAtAuction,
  AverageSalePriceAtAuctionScreenQuery,
} from "./AverageSalePriceAtAuction"
import { mockEnvironment } from "app/relay/defaultEnvironment"
import { screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native"
import { MockPayloadGenerator } from "relay-test-utils"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { waitForSuspenseToBeRemoved } from "app/tests/waitForSupenseToBeRemoved"

describe("AverageSalePriceAtAuction", () => {
  const TestRenderer = () => <AverageSalePriceAtAuction artistID="artist-id" />

  /// RELAY TEST RULES
  // 1, always async tests
  // 2, render, resolve(in act), await waitfor for expectations?
  // no hooks, xoris wait
  /// hooks, me  waitForSuspenseToBeRemoved
  //search, klama

  it("renders title", async () => {
    renderWithRelayWrappers(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation({
      Artist: () => ({
        internalID: "artist-id",
        name: "Artist Name",
        imageUrl: "image-url",
      }),
    })
    await waitForSuspenseToBeRemoved()

    expect(screen.getByTestId("Average_Auction_Price_title")).toBeTruthy()
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
