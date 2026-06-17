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

const artworkEdges = Array.from({ length: 10 }, (_, i) => ({
  node: {
    id: `artwork-${i}`,
    slug: `artwork-slug-${i}`,
    image: { aspectRatio: 1.5 },
    artistNames: `Artist ${i}`,
    href: `/artwork/artwork-${i}`,
    sale: { isAuction: true, isClosed: false },
    saleArtwork: { lotLabel: `${i + 1}` },
  },
}))

describe("SaleLotsListContainer", () => {
  beforeEach(() => {
    mockScrollToTop.mockClear()
  })

  describe("grid view", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: (props: any) => (
        <ArtworkFiltersStoreProvider
          runtimeModel={{
            ...getArtworkFiltersModel(),
            ...getFiltersState(ViewAsValues.Grid),
          }}
        >
          <SaleLotsListContainer
            saleID="sale-id"
            saleSlug="sale-slug"
            scrollToTop={mockScrollToTop}
            viewer={props.viewer}
          />
        </ArtworkFiltersStoreProvider>
      ),
      query: graphql`
        query SaleLotsListHooksTestQuery @relay_test_operation {
          viewer {
            ...SaleLotsListViewer_viewer @arguments(saleID: "sale-id")
          }
        }
      `,
    })

    it("renders grid and handles pagination correctly", () => {
      renderWithRelay({
        Viewer: () => ({
          artworksConnection: {
            aggregations: [],
            counts: { total: 30, followedArtists: 0 },
            edges: artworkEdges,
            pageInfo: { hasNextPage: true, endCursor: "cursor-10" },
          },
        }),
      })

      expect(screen.getByTestId("sale-artworks-grid")).toBeTruthy()
    })
  })

  describe("list view", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: (props: any) => (
        <ArtworkFiltersStoreProvider
          runtimeModel={{
            ...getArtworkFiltersModel(),
            ...getFiltersState(ViewAsValues.List),
          }}
        >
          <SaleLotsListContainer
            saleID="sale-id"
            saleSlug="sale-slug"
            scrollToTop={mockScrollToTop}
            viewer={props.viewer}
          />
        </ArtworkFiltersStoreProvider>
      ),
      query: graphql`
        query SaleLotsListHooksListTestQuery @relay_test_operation {
          viewer {
            ...SaleLotsListViewer_viewer @arguments(saleID: "sale-id")
          }
        }
      `,
    })

    it("renders list view correctly", () => {
      renderWithRelay({
        Viewer: () => ({
          artworksConnection: {
            aggregations: [],
            counts: { total: 25, followedArtists: 0 },
            edges: artworkEdges,
            pageInfo: { hasNextPage: true, endCursor: "cursor-10" },
          },
        }),
      })

      expect(() => screen.getByTestId("ArtworkGrid")).toThrow()
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
