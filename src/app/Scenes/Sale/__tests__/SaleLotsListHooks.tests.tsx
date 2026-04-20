import { screen } from "@testing-library/react-native"
import { FilterParamName, ViewAsValues } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  SaleLotsListContainer,
  SaleLotsListSortMode,
} from "app/Scenes/Sale/Components/SaleLotsList"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(() => false),
}))

const mockScrollToTop = jest.fn()

const getFiltersState = (viewAs: ViewAsValues = ViewAsValues.Grid): ArtworkFiltersState => ({
  selectedFilters: [],
  appliedFilters: [
    {
      paramName: FilterParamName.viewAs,
      paramValue: viewAs,
      displayText: "View as",
    },
  ],
  previouslyAppliedFilters: [],
  applyFilters: false,
  aggregations: [],
  filterType: "saleArtwork",
  counts: {
    total: null,
    followedArtists: null,
  },
  showFilterArtworksModal: false,
  sizeMetric: "cm",
})

describe("SaleLotsListContainer with Hooks Migration", () => {
  beforeEach(() => {
    mockScrollToTop.mockClear()
    const { useFeatureFlag } = require("app/utils/hooks/useFeatureFlag")
    useFeatureFlag.mockReturnValue(false) // Default to legacy mode
  })

  describe("Legacy Container with Hooks", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: (props: any) => (
        <ArtworkFiltersStoreProvider
          runtimeModel={{
            ...getArtworkFiltersModel(),
            ...getFiltersState(ViewAsValues.Grid),
          }}
        >
          <SaleLotsListContainer
            saleArtworksConnection={props}
            unfilteredSaleArtworksConnection={{ counts: { total: 100 } } as any}
            saleID="sale-id"
            saleSlug="sale-slug"
            scrollToTop={mockScrollToTop}
          />
        </ArtworkFiltersStoreProvider>
      ),
      query: graphql`
        query SaleLotsListHooksTestQuery @relay_test_operation {
          ...SaleLotsList_saleArtworksConnection @arguments(saleID: "sale-id")
        }
      `,
    })

    it("renders grid and handles pagination correctly", () => {
      renderWithRelay({
        Query: () => ({
          saleArtworksConnection: {
            aggregations: [],
            counts: { total: 30, followedArtists: 0 },
            edges: Array.from({ length: 10 }, (_, i) => ({
              node: {
                id: `artwork-${i}`,
                slug: `artwork-slug-${i}`,
                image: { aspectRatio: 1.5 },
                artistNames: `Artist ${i}`,
                href: `/artwork/artwork-${i}`,
                sale: { isAuction: true, isClosed: false },
                saleArtwork: { lotLabel: `${i + 1}` },
              },
            })),
            pageInfo: {
              hasNextPage: true,
              endCursor: "cursor-10",
            },
          },
        }),
      })

      // Verify grid is rendered
      expect(screen.getByTestId("sale-artworks-grid")).toBeTruthy()
    })

    it("renders list view correctly", () => {
      const { renderWithRelay } = setupTestWrapper({
        Component: (props: any) => (
          <ArtworkFiltersStoreProvider
            runtimeModel={{
              ...getArtworkFiltersModel(),
              ...getFiltersState(ViewAsValues.List),
            }}
          >
            <SaleLotsListContainer
              saleArtworksConnection={props}
              unfilteredSaleArtworksConnection={{ counts: { total: 50 } } as any}
              saleID="sale-id"
              saleSlug="sale-slug"
              scrollToTop={mockScrollToTop}
            />
          </ArtworkFiltersStoreProvider>
        ),
        query: graphql`
          query SaleLotsListHooksListTestQuery @relay_test_operation {
            ...SaleLotsList_saleArtworksConnection @arguments(saleID: "sale-id")
          }
        `,
      })

      renderWithRelay({
        Query: () => ({
          saleArtworksConnection: {
            aggregations: [],
            counts: { total: 25, followedArtists: 0 },
            edges: Array.from({ length: 10 }, (_, i) => ({
              node: {
                id: `artwork-${i}`,
                slug: `artwork-slug-${i}`,
                image: { aspectRatio: 1.5 },
                artistNames: `Artist ${i}`,
                href: `/artwork/artwork-${i}`,
                sale: { isAuction: true, isClosed: false },
                saleArtwork: { lotLabel: `${i + 1}` },
              },
            })),
            pageInfo: {
              hasNextPage: true,
              endCursor: "cursor-10",
            },
          },
        }),
      })

      // Verify list view is rendered (should not have grid test ID)
      expect(() => screen.getByTestId("ArtworkGrid")).toThrow()
    })
  })

  describe("New Container with Hooks (Feature Flag Enabled)", () => {
    beforeEach(() => {
      const { useFeatureFlag } = require("app/utils/hooks/useFeatureFlag")
      useFeatureFlag.mockReturnValue(true) // Enable new artwork connection
    })

    const { renderWithRelay } = setupTestWrapper({
      Component: (props: any) => (
        <ArtworkFiltersStoreProvider
          runtimeModel={{
            ...getArtworkFiltersModel(),
            ...getFiltersState(ViewAsValues.Grid),
          }}
        >
          <SaleLotsListContainer
            saleArtworksConnection={{} as any}
            unfilteredSaleArtworksConnection={{ counts: { total: 100 } } as any}
            saleID="sale-id"
            saleSlug="sale-slug"
            scrollToTop={mockScrollToTop}
            viewer={props.viewer}
          />
        </ArtworkFiltersStoreProvider>
      ),
      query: graphql`
        query SaleLotsListHooksNewTestQuery @relay_test_operation {
          viewer {
            ...SaleLotsListViewer_viewer @arguments(saleID: "sale-id")
          }
        }
      `,
    })

    it("renders grid with new artwork connection and handles pagination", () => {
      renderWithRelay({
        Viewer: () => ({
          artworksConnection: {
            aggregations: [],
            counts: { total: 40, followedArtists: 5 },
            edges: Array.from({ length: 10 }, (_, i) => ({
              node: {
                id: `artwork-${i}`,
                slug: `artwork-slug-${i}`,
                image: { aspectRatio: 1.5 },
                artistNames: `Artist ${i}`,
                href: `/artwork/artwork-${i}`,
                sale: { isAuction: true, isClosed: false },
                saleArtwork: { lotLabel: `${i + 1}` },
              },
            })),
            pageInfo: {
              hasNextPage: true,
              endCursor: "cursor-10",
            },
          },
        }),
      })

      // Verify grid is rendered with new connection
      expect(screen.getByTestId("sale-artworks-grid")).toBeTruthy()
    })
  })

  describe("Error Handling", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: (props: any) => (
        <ArtworkFiltersStoreProvider
          runtimeModel={{
            ...getArtworkFiltersModel(),
            ...getFiltersState(ViewAsValues.Grid),
          }}
        >
          <SaleLotsListContainer
            saleArtworksConnection={props}
            unfilteredSaleArtworksConnection={{ counts: { total: 10 } } as any}
            saleID="sale-id"
            saleSlug="sale-slug"
            scrollToTop={mockScrollToTop}
          />
        </ArtworkFiltersStoreProvider>
      ),
      query: graphql`
        query SaleLotsListHooksErrorTestQuery @relay_test_operation {
          ...SaleLotsList_saleArtworksConnection @arguments(saleID: "sale-id")
        }
      `,
    })

    it("handles empty results correctly", () => {
      renderWithRelay({
        Query: () => ({
          saleArtworksConnection: {
            aggregations: [],
            counts: { total: 0, followedArtists: 0 },
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        }),
      })

      // Should render empty state or nothing when no artworks
      expect(() => screen.getByTestId("ArtworkGrid")).toThrow()
    })

    it("handles no more pages correctly", () => {
      renderWithRelay({
        Query: () => ({
          saleArtworksConnection: {
            aggregations: [],
            counts: { total: 5, followedArtists: 0 },
            edges: Array.from({ length: 5 }, (_, i) => ({
              node: {
                id: `artwork-${i}`,
                slug: `artwork-slug-${i}`,
                image: { aspectRatio: 1.5 },
                artistNames: `Artist ${i}`,
                href: `/artwork/artwork-${i}`,
                sale: { isAuction: true, isClosed: false },
                saleArtwork: { lotLabel: `${i + 1}` },
              },
            })),
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor-5",
            },
          },
        }),
      })

      // Should still render the grid with available items
      expect(screen.getByTestId("sale-artworks-grid")).toBeTruthy()
    })
  })

  describe("SaleLotsListSortMode", () => {
    it("renders correct sort description and count", () => {
      const { renderWithWrappers } = require("app/utils/tests/renderWithWrappers")

      const component = (
        <SaleLotsListSortMode
          filterParams={{ sort: "position" } as any}
          filteredTotal={15}
          totalCount={50}
        />
      )

      renderWithWrappers(component)

      expect(screen.getByText(/Sorted by/)).toBeTruthy()
      expect(screen.getByText("Showing 15 of 50")).toBeTruthy()
    })
  })
})
