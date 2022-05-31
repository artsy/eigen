import { withStickyTabPage } from "app/Components/StickyTabPage/testHelpers"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionInsights } from "./MyCollectionInsights"

jest.unmock("react-relay")

describe("MyCollectionInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => withStickyTabPage(MyCollectionInsights)

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("when the step 1 of phase 1 feature flag is enabled ", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableMyCollectionInsightsPhase1Part1: true,
      })
    })

    it("shows market signal when they're available", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
      mockEnvironmentPayload(mockEnvironment, {
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
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
      mockEnvironmentPayload(mockEnvironment, {
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

  describe("when the step 1 of phase 1 feature flag is disabled ", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableMyCollectionInsightsPhase1Part1: false,
      })
    })

    it("shows market signal when they're available", async () => {
      const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
      mockEnvironmentPayload(mockEnvironment, {
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
    const { getByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
    mockEnvironmentPayload(mockEnvironment, {
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
