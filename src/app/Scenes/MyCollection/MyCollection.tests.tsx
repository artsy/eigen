import { addCollectedArtwork } from "@artsy/cohesion"
import { fireEvent, RenderAPI } from "@testing-library/react-native"
import { MyCollectionTestsQuery } from "__generated__/MyCollectionTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"

import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Tab } from "../MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { MyCollectionContainer } from "./MyCollection"

jest.unmock("react-relay")

describe("MyCollection", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<MyCollectionTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query MyCollectionTestsQuery @relay_test_operation {
            me {
              ...MyCollection_me
            }
          }
        `}
        variables={{}}
        render={({ props }) => {
          if (props?.me) {
            return (
              <StickyTabPage
                tabs={[
                  {
                    title: "test",
                    content: <MyCollectionContainer me={props.me} />,
                  },
                ]}
              />
            )
          }
          return null
        }}
      />
    </ArtworkFiltersStoreProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()

    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableMyCollectionInsights: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  const getZeroStateWrapper = () =>
    getWrapper({
      Me: () => ({
        myCollectionConnection: {
          edges: [],
        },
      }),
    })

  describe("collection is empty", () => {
    let tree: ReactTestRenderer

    beforeEach(() => {
      tree = getZeroStateWrapper()
    })

    it("shows zerostate", () => {
      expect(extractText(tree.root)).toContain("Primed and ready for artworks.")
      expect(extractText(tree.root)).toContain(
        "Add works from your collection to access price and market insights."
      )
    })

    it("navigates to MyCollectionArtworkForm when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(navigate).toHaveBeenCalledWith(
        "my-collection/artworks/new",
        expect.objectContaining({
          passProps: { mode: "add", onSuccess: expect.anything(), source: Tab.collection },
        })
      )
    })

    it("tracks analytics event when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent).toHaveBeenCalledWith(addCollectedArtwork())
    })
  })

  describe("collection is not empty", () => {
    let tree: ReactTestRenderer
    beforeEach(() => {
      tree = getWrapper()
    })

    it("renders without throwing an error", () => {
      expect(tree.root.findByType(StickyTabPageScrollView)).toBeDefined()
      expect(tree.root.findByType(InfiniteScrollMyCollectionArtworksGridContainer)).toBeDefined()
    })
  })

  describe("sorting and filtering", () => {
    it("filters and sorts without crashing", async () => {
      const renderApi = renderWithWrappersTL(<TestRenderer />)

      act(() => {
        resolveMostRecentRelayOperation(mockEnvironment, {
          Me: () => ({
            myCollectionConnection,
          }),
        })
      })

      await applyFilter(renderApi, "Sort By", "Price Paid (High to Low)")
      await applyFilter(renderApi, "Artists", "Banksy")
      // await applyFilter(renderApi, "Rarity", "Unique")
      // await applyFilter(renderApi, "Medium", "Print")
      // await applyFilter(renderApi, "Price", "$0-1,000")
      // await applyFilter(renderApi, "Size", "Small (under 40cm)")
    })
  })
})

const applyFilter = async (renderApi: RenderAPI, filterName: string, filterOption: string) => {
  await flushPromiseQueue()
  act(() => fireEvent.press(renderApi.getByTestId("sort-and-filter-button")))
  act(() => fireEvent.press(renderApi.getByText(filterName)))
  act(() => fireEvent.press(renderApi.getByText(filterOption)))
  act(() => fireEvent.press(renderApi.getByText("Show Results")))
}

const myCollectionConnection = {
  edges: [
    {
      node: {
        id: "QXJ0d29yazo2MWMwOTk4ZWU0YjZjMzAwMGI3NmJmYjE=",
        medium: "Print",
        pricePaid: {
          minor: "2000",
        },
        attributionClass: {
          name: "Unique",
        },
        sizeBucket: null,
        width: 30,
        height: 20,
        artist: {
          name: "Banksy",
          internalID: "4dd1584de0091e000100207c",
          formattedNationalityAndBirthday: "British",
        },
      },
    },
  ],
}
