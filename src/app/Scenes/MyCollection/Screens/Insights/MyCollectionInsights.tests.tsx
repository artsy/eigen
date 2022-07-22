import { withStickyTabPage } from "app/Components/StickyTabPage/testHelpers"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { MyCollectionInsights } from "./MyCollectionInsights"

describe("MyCollectionInsights", () => {
  const TestRenderer = () => withStickyTabPage(MyCollectionInsights)

  describe("when the step 1 of phase 1 feature flag is enabled ", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableMyCollectionInsightsPhase1Part1: true,
      })
    })

    it("shows market signal when they're available", async () => {
      const { getByText } = renderWithRelayWrappers(<TestRenderer />, mockEnvironment)
      resolveMostRecentRelayOperation({
        Me: () => ({
          myCollectionConnection: myCollectionConnectionMock,
          myCollectionAuctionResults: myCollectionAuctionResultsMock,
          myCollectionInfo: myCollectionInfoMock,
        }),
      })

      await flushPromiseQueue()

      expect(getByText("Market Signals")).toBeTruthy()
    })

    it("shows insights overview", async () => {
      const { getByText } = renderWithRelayWrappers(<TestRenderer />, mockEnvironment)
      resolveMostRecentRelayOperation({
        Me: () => ({
          myCollectionConnection: myCollectionConnectionMock,
          myCollectionAuctionResults: myCollectionAuctionResultsMock,
          myCollectionInfo: myCollectionInfoMock,
        }),
      })

      await flushPromiseQueue()

      expect(getByText("Total Artworks")).toBeTruthy()
      expect(getByText("24")).toBeTruthy()
      expect(getByText("Total Artists")).toBeTruthy()
      expect(getByText("13")).toBeTruthy()
    })
  })

  // describe("no insights message", () => {
  //   it("shows message if there are no market insights", async () => {
  //     const { getByTestId } = renderWithRelayWrappers(<TestRenderer />, mockEnvironment)

  //     resolveMostRecentRelayOperation( {
  //       Me: () => ({ auctionResults: { totalCount: 0 } }),
  //     })

  //     await flushPromiseQueue()

  //     expect(getByTestId("artworks-have-no-insights-message")).toBeTruthy()
  //   })

  //   it("doesn't show the message if there are market insights", async () => {
  //     const { queryByTestId } = renderWithRelayWrappers(<TestRenderer />, mockEnvironment)

  //     resolveMostRecentRelayOperation( {
  //       Me: () => ({ auctionResults: { totalCount: 1 } }),
  //     })

  //     await flushPromiseQueue()

  //     expect(await queryByTestId("artworks-have-no-insights-message")).toBeFalsy()
  //   })

  //   it("doesn't show the message if there are market insights", async () => {
  //     const { queryByTestId } = renderWithRelayWrappers(<TestRenderer />, mockEnvironment)

  //     resolveMostRecentRelayOperation( {
  //       Me: () => ({ auctionResults: { totalCount: 1 } }),
  //     })

  //     await flushPromiseQueue()

  //     expect(await queryByTestId("artworks-have-no-insights-message")).toBeFalsy()
  //   })
  // })

  describe("when the step 1 of phase 1 feature flag is disabled ", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableMyCollectionInsightsPhase1Part1: false,
      })
    })

    it("shows market signal when they're available", async () => {
      const { getByText } = renderWithRelayWrappers(<TestRenderer />, mockEnvironment)
      resolveMostRecentRelayOperation({
        Me: () => ({
          myCollectionConnection: myCollectionConnectionMock,
          myCollectionAuctionResults: myCollectionAuctionResultsMock,
          myCollectionInfo: myCollectionInfoMock,
        }),
      })

      await flushPromiseQueue()

      expect(() => getByText("Market Signals")).toThrow()
    })
  })

  it("shows empty state when the user has no artworks in their collection", async () => {
    const { getByTestId } = renderWithRelayWrappers(<TestRenderer />, mockEnvironment)
    resolveMostRecentRelayOperation({
      Me: () => ({
        myCollectionConnection: { edges: [] },
        myCollectionAuctionResults: myCollectionAuctionResultsMock,
        myCollectionInfo: myCollectionInfoMock,
      }),
    })

    await flushPromiseQueue()

    expect(getByTestId("my-collection-insights-empty-state")).toBeTruthy()
  })
})

const myCollectionConnectionMock = {
  edges: [
    {
      node: {
        id: "random-id",
      },
    },
  ],
}

const myCollectionAuctionResultsMock = {
  totalCount: 1,
  edges: [
    {
      node: {
        id: "random-id",
      },
    },
  ],
}

const myCollectionInfoMock = {
  artworksCount: 24,
  artistsCount: 13,
}
