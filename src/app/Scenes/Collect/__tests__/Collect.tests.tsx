import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { CollectQuery } from "__generated__/CollectQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { CollectContent, prepareCollectVariables } from "app/Scenes/Collect/Collect"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: {
      title: "Collect",
      subtitle: "Collect art and design online",
    },
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useIsFocused: () => true,
}))

const { renderWithRelay } = setupTestWrapper<CollectQuery>({
  Component: ({ viewer }) => (
    <ArtworkFiltersStoreProvider>
      <CollectContent viewer={viewer} />
    </ArtworkFiltersStoreProvider>
  ),
  query: graphql`
    query CollectTestQuery @relay_test_operation {
      viewer {
        ...CollectArtworks_viewer @arguments(input: {})
        ...CollectArtworks_viewerAggregations
      }
    }
  `,
})

describe("CollectContent", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders a filter button", () => {
    renderWithRelay()

    expect(screen.getByText("Sort & Filter")).toBeOnTheScreen()
  })

  it("shows an empty state when no artworks are available", () => {
    renderWithRelay({
      Viewer: () => ({
        artworksConnection: {
          edges: [],
        },
      }),
    })

    expect(screen.getByText("No artworks found")).toBeOnTheScreen()
  })

  it("opens the filter modal when filter button is pressed", async () => {
    renderWithRelay()

    const filterButton = screen.getByText("Sort & Filter")
    fireEvent.press(filterButton)

    // The ArtworkFilterNavigator should be visible after pressing the filter button
    await waitFor(() => {
      expect(screen.getByTestId("artwork-filter-navigator")).toBeOnTheScreen()
    })
  })

  describe("prepareCollectVariables", () => {
    it("should prepare filter variables correctly", () => {
      const params = {
        medium: "painting",
        price_range: "1000-5000",
        sort: "-decayed_merch",
      }

      const { input, filters } = prepareCollectVariables(params)

      expect(input).toBeDefined()
      expect(filters).toEqual([
        { displayText: "Medium", paramName: "medium", paramValue: "painting" },
        { displayText: "Price", paramName: "priceRange", paramValue: "1000-5000" },
        { displayText: "Sort By", paramName: "sort", paramValue: "-decayed_merch" },
      ])
    })

    it("should handle empty params", () => {
      const { input, filters } = prepareCollectVariables({})

      expect(input).toBeDefined()
      expect(filters).toEqual([])
    })
  })

  it("renders artworks when data is available", () => {
    renderWithRelay({
      Viewer: () => ({
        artworksConnection: {
          edges: [
            {
              node: {
                id: "artwork-1",
                slug: "artwork-1",
                title: "Artwork 1",
                image: {
                  aspectRatio: 1.0,
                },
              },
            },
            {
              node: {
                id: "artwork-2",
                slug: "artwork-2",
                title: "Artwork 2",
                image: {
                  aspectRatio: 1.0,
                },
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByTestId("masonry-artwork-grid")).toBeOnTheScreen()
  })

  it("handles load more when scrolling", () => {
    const { mockResolveLastOperation } = renderWithRelay({
      Viewer: () => ({
        artworksConnection: {
          edges: [
            {
              node: {
                id: "artwork-1",
                slug: "artwork-1",
                title: "Artwork 1",
                image: {
                  aspectRatio: 1.0,
                },
              },
            },
          ],
          pageInfo: {
            hasNextPage: true,
            endCursor: "end-cursor",
          },
        },
      }),
    })

    const grid = screen.getByTestId("masonry-artwork-grid")

    // Simulate reaching the end of the list
    fireEvent(grid, "onEndReached")

    // Verify that a new relay operation was triggered for pagination
    mockResolveLastOperation({
      Viewer: () => ({
        artworksConnection: {
          edges: [
            {
              node: {
                id: "artwork-2",
                slug: "artwork-2",
                title: "Artwork 2",
                image: {
                  aspectRatio: 1.0,
                },
              },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
      }),
    })

    expect(grid).toBeOnTheScreen()
  })

  it("uses artworks filter aggregations", async () => {
    renderWithRelay({
      Viewer: () => ({
        artworksConnectionAggregations: {
          aggregations: [
            {
              slice: "MEDIUM",
              counts: [
                { name: "Painting", value: "painting" },
                { name: "Sculpture", value: "sculpture" },
              ],
            },
            {
              slice: "ARTIST",
              counts: [
                { name: "Artist 1", value: "artist-1" },
                { name: "Artist 2", value: "artist-2" },
              ],
            },
          ],
        },
      }),
    })

    const filterButton = screen.getByText("Sort & Filter")
    fireEvent.press(filterButton)

    // Verify filter modal opens
    await waitFor(() => {
      expect(screen.getByTestId("artwork-filter-navigator")).toBeOnTheScreen()
    })
  })
})
