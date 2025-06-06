import { MyCollectionInsights } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

describe("MyCollectionInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => <MyCollectionInsights />

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("when the step 1 of phase 1 feature flag is enabled ", () => {
    it("shows insights overview", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
      resolveMostRecentRelayOperation(mockEnvironment, {
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

  it("shows empty state when the user has no artworks in their collection", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        myCollectionConnection: { edges: [] },
        myCollectionAuctionResults: myCollectionAuctionResultsMock,
        myCollectionInfo: myCollectionInfoMock,
      }),
    })

    await flushPromiseQueue()

    expect(getByText("Gain deeper knowledge of your collection")).toBeTruthy()
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
