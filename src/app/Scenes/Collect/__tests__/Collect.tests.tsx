import { RouteProp } from "@react-navigation/native"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { CollectQuery } from "__generated__/CollectQuery.graphql"
import { Collect, prepareCollectVariables } from "app/Scenes/Collect/Collect"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const mockRoute = {
  key: "collect-screen",
  name: "Collect",
  params: {},
} as RouteProp<any, any>

const { renderWithRelay } = setupTestWrapper<CollectQuery>({
  Component: () => <Collect route={mockRoute} navigation={{} as any} />,
})

describe("Collect", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the screen with header", () => {
    renderWithRelay()

    expect(screen.getByText("Collect")).toBeOnTheScreen()
    expect(screen.getByText("Collect art and design online")).toBeOnTheScreen()
  })

  it("renders a filter button", () => {
    renderWithRelay()

    expect(screen.getByText("Sort & Filter")).toBeOnTheScreen()
  })

  it("shows an empty state when no artworks are available", async () => {
    renderWithRelay({
      Viewer: () => ({
        artworksConnection: {
          edges: [],
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("PlaceholderGrid"))

    expect(screen.getByText("No artworks found")).toBeOnTheScreen()
  })

  it("opens the filter modal when filter button is pressed", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.queryByTestId("PlaceholderGrid"))

    const filterButton = screen.getByText("Sort & Filter")
    fireEvent.press(filterButton)

    // The ArtworkFilterNavigator should be visible after pressing the filter button
    expect(screen.getByTestId("artwork-filter-navigator")).toBeOnTheScreen()
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

  describe("CollectContent", () => {
    it("renders artworks when data is available", async () => {
      renderWithRelay({
        Viewer: () => ({
          artworksConnection: {
            edges: [
              {
                node: {
                  id: "artwork-1",
                  title: "Artwork 1",
                  artist: {
                    name: "Artist 1",
                  },
                  image: {
                    url: "https://example.com/image.jpg",
                  },
                },
              },
              {
                node: {
                  id: "artwork-2",
                  title: "Artwork 2",
                  artist: {
                    name: "Artist 2",
                  },
                  image: {
                    url: "https://example.com/image2.jpg",
                  },
                },
              },
            ],
          },
        }),
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("PlaceholderGrid"))

      expect(screen.getByText("Artwork 1")).toBeOnTheScreen()
      expect(screen.getByText("Artwork 2")).toBeOnTheScreen()
    })

    it("handles load more when scrolling", async () => {
      const { mockResolveLastOperation } = renderWithRelay({
        Viewer: () => ({
          artworksConnection: {
            edges: [
              {
                node: {
                  id: "artwork-1",
                  title: "Artwork 1",
                  artist: {
                    name: "Artist 1",
                  },
                  image: {
                    url: "https://example.com/image.jpg",
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

      await waitForElementToBeRemoved(() => screen.queryByTestId("PlaceholderGrid"))

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
                  title: "Artwork 2",
                  artist: {
                    name: "Artist 2",
                  },
                  image: {
                    url: "https://example.com/image2.jpg",
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

      expect(screen.getByText("Artwork 2")).toBeOnTheScreen()
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

      await waitForElementToBeRemoved(() => screen.queryByTestId("PlaceholderGrid"))

      const filterButton = screen.getByText("Sort & Filter")
      fireEvent.press(filterButton)

      // Verify filter options are available in the modal
      expect(screen.getByText("Medium")).toBeOnTheScreen()
      expect(screen.getByText("Artists")).toBeOnTheScreen()
    })
  })
})
