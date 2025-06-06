import { screen } from "@testing-library/react-native"
import { CollectionArtworksTestsQuery } from "__generated__/CollectionArtworksTestsQuery.graphql"
import {
  FilterArray,
  filterArtworksParams,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  CollectionArtworksFragmentContainer as CollectionArtworks,
  CURATORS_PICKS_SLUGS,
} from "app/Scenes/Collection/Screens/CollectionArtworks"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CollectionArtworks", () => {
  const { renderWithRelay } = setupTestWrapper<CollectionArtworksTestsQuery>({
    Component: ({ marketingCollection }) => (
      <ArtworkFiltersStoreProvider>
        <CollectionArtworks collection={marketingCollection!} />
      </ArtworkFiltersStoreProvider>
    ),
    query: graphql`
      query CollectionArtworksTestsQuery @relay_test_operation {
        marketingCollection(slug: "street-art-now") {
          ...CollectionArtworks_collection
        }
      }
    `,
  })

  it("returns zero state component when there are no artworks to display", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        collectionArtworks: {
          edges: [],
          counts: { total: 0 },
        },
      }),
    })

    expect(screen.getByText(/No results found/)).toBeOnTheScreen()
    expect(screen.getByText(/Please try another search./)).toBeOnTheScreen()
    expect(screen.getByText(/Clear filters/)).toBeOnTheScreen()
  })

  it("returns artworks", () => {
    renderWithRelay({
      MarketingCollection: () => ({
        collectionArtworks: {
          counts: { total: 123 },
        },
      }),
    })

    expect(screen.getByText("Showing 123 works")).toBeOnTheScreen()
  })

  fdescribe("collector signals", () => {
    it("renders the collector signals", () => {
      renderWithRelay({
        MarketingCollection: () => ({
          collectionArtworks: {
            counts: { total: 123 },
            edges: [
              {
                node: {
                  title: "Artwork Title",
                  collectorSignals: {
                    curatorsPick: true,
                  },
                },
              },
            ],
          },
        }),
      })

      expect(screen.getByText("Showing 123 works")).toBeOnTheScreen()
      expect(screen.getByText("Artwork Title")).toBeOnTheScreen()
      expect(screen.getByText("Curators’ Pick")).toBeOnTheScreen()
    })

    CURATORS_PICKS_SLUGS.forEach((slug) => {
      it(`does not render the collector signals for ${slug} collection`, () => {
        renderWithRelay({
          MarketingCollection: () => ({
            slug,
            collectionArtworks: {
              counts: { total: 123 },
              edges: [
                {
                  node: {
                    title: "Artwork Title",
                    collectorSignals: {
                      curatorsPick: true,
                    },
                  },
                },
              ],
            },
          }),
        })

        expect(screen.getByText("Showing 123 works")).toBeOnTheScreen()
        expect(screen.getByText("Artwork Title")).toBeOnTheScreen()
        expect(screen.queryByText("Curators’ Pick")).not.toBeOnTheScreen()
      })
    })
  })
})

describe("filterArtworksParams", () => {
  it("returns the default", () => {
    const appliedFilters: FilterArray = []
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-decayed_merch",
      medium: "*",
      priceRange: "*-*",
      estimateRange: "",
      includeArtworksByFollowedArtists: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
      inquireableOnly: false,
    })
  })

  it("returns the value of appliedFilter", () => {
    const appliedFilters: FilterArray = [
      {
        displayText: "Recently Added",
        paramName: FilterParamName.sort,
        paramValue: "-published_at",
      },
    ]
    expect(filterArtworksParams(appliedFilters)).toEqual({
      sort: "-published_at",
      medium: "*",
      priceRange: "*-*",
      estimateRange: "",
      includeArtworksByFollowedArtists: false,
      atAuction: false,
      acquireable: false,
      offerable: false,
      inquireableOnly: false,
    })
  })
})
