import { addCollectedArtwork } from "@artsy/cohesion"
import { fireEvent, RenderAPI } from "@testing-library/react-native"
import { MyCollectionTestsQuery } from "__generated__/MyCollectionTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { GridViewIcon } from "lib/Icons/GridViewIcon"
import { ListViewIcon } from "lib/Icons/ListViewIcon"
import { navigate } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act, ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkList } from "./Components/MyCollectionArtworkList"
import { MyCollectionSearchBar } from "./Components/MyCollectionSearchBar"
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
                staticHeaderContent={<></>}
                tabs={[
                  {
                    title: "My Collection",
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
      expect(extractText(tree.root)).toContain("Your art collection in your pocket.")
      expect(extractText(tree.root)).toContain(
        "Keep track of your collection all in one place and get market insights"
      )
    })

    it("navigates to MyCollectionArtworkForm when Add Artwork is pressed", () => {
      const addArtworkButton = tree.root.findByProps({ testID: "add-artwork-button-zero-state" })
      addArtworkButton.props.onPress()

      expect(navigate).toHaveBeenCalledWith(
        "my-collection/artworks/new",
        expect.objectContaining({ passProps: { mode: "add" } })
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

  describe("search bar", () => {
    let tree: ReactTestRenderer

    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionSearchBar: true })

      tree = getWrapper()
    })

    it("user can switch between grid and list view when search the bar is visible", async () => {
      const scrollView = tree.root.findByType(StickyTabPageScrollView)

      scrollView.props.onScrollBeginDrag()

      await flushPromiseQueue()

      expect(tree.root.findByType(MyCollectionSearchBar)).toBeDefined()

      act(() => fireEvent.press(tree.root.findByType(GridViewIcon)))

      expect(MyCollectionArtworkList).toBeDefined()

      act(() => fireEvent.press(tree.root.findByType(ListViewIcon)))

      expect(MyCollectionArtworkList).toBeDefined()
    })
  })

  describe("sorting and filtering", () => {
    it("filters and sorts without crashing", async () => {
      const renderApi = renderWithWrappersTL(<TestRenderer />)

      act(() => {
        mockEnvironment.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Me: () => ({
              myCollectionConnection: mockArtworkConnection,
            }),
          })
        )
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

const mockArtworkConnection = {
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
