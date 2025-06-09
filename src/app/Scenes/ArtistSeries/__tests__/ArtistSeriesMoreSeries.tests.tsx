import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtistSeriesMoreSeriesTestsQuery } from "__generated__/ArtistSeriesMoreSeriesTestsQuery.graphql"
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import {
  ArtistSeriesMoreSeries,
  ArtistSeriesMoreSeriesFragmentContainer,
} from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { RouterLink } from "app/system/navigation/RouterLink"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtistSeriesMoreSeries", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesMoreSeriesTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesMoreSeriesTestsQuery @raw_response_type {
          artistSeries(id: "pumpkins") {
            artist: artists(size: 1) {
              ...ArtistSeriesMoreSeries_artist
            }
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          const artist = props.artistSeries.artist?.[0]
          return (
            <ArtistSeriesMoreSeriesFragmentContainer
              artist={artist}
              artistSeriesHeader="This is a header"
              currentArtistSeriesExcluded
              contextScreenOwnerId="artist-series-id"
              contextScreenOwnerSlug="artist-series-slug"
              contextScreenOwnerType={OwnerType.artistSeries}
              contextModule={ContextModule.artistSeriesRail}
            />
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (testFixture: any) => {
    const { root } = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...testFixture,
        },
      })
    })
    return root
  }

  it("renders without throwing an error", async () => {
    const root = getWrapper(ArtistSeriesMoreSeriesFixture)
    expect(await root.findAllByType(ArtistSeriesMoreSeries)).toHaveLength(1)
  })

  it("renders the correct header text", async () => {
    const root = getWrapper(ArtistSeriesMoreSeriesFixture)
    const header = await root.findByProps({ testID: "header" })
    expect(header.props.children).toBe("This is a header")
  })

  describe("with at least one other series related to the artist to show", () => {
    it("renders the related artist series", async () => {
      const root = getWrapper(ArtistSeriesMoreSeriesFixture)
      expect(await root.findAllByType(ArtistSeriesListItem)).toHaveLength(5)
    })

    it("tracks an event on click", async () => {
      const root = getWrapper(ArtistSeriesMoreSeriesFixture)
      const artistSerieListItems = await root.findAllByType(ArtistSeriesListItem)
      const artistSeriesButton = artistSerieListItems[0].findByType(RouterLink)

      act(() => artistSeriesButton.props.onPress())

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "tappedArtistSeriesGroup",
        context_module: "artistSeriesRail",
        context_screen_owner_id: "artist-series-id",
        context_screen_owner_slug: "artist-series-slug",
        context_screen_owner_type: "artistSeries",
        destination_screen_owner_id: "da821a13-92fc-49c2-bbd5-bebb790f7020",
        destination_screen_owner_slug: "yayoi-kusama-plums",
        destination_screen_owner_type: "artistSeries",
        horizontal_slide_position: 0,
        curation_boost: true,
        type: "thumbnail",
      })
    })
  })

  describe("with no other series related to the artist to show", () => {
    it("does not render", async () => {
      const root = getWrapper(ArtistSeriesMoreSeriesNoSeriesFixture)
      expect(await root.findAllByType(ArtistSeriesListItem)).toHaveLength(0)
    })
  })

  describe("with greater than four series associated with an artist", () => {
    it("renders a view all button with a total count for all the series associated with the artist", async () => {
      const root = getWrapper(ArtistSeriesMoreSeriesFixture)
      const viewAllButton = await root.findByProps({ testID: "viewAll" })
      expect(viewAllButton.props.children).toBe("View All (6)")
    })
  })

  describe("with fewer than four series associated with an artist", () => {
    it("does not render a view all button", async () => {
      const root = getWrapper(ArtistSeriesMoreSeriesBelowViewAllThresholdFixture)
      expect(await root.findAllByProps({ testID: "viewAll" })).toHaveLength(0)
    })
  })
})

const ArtistSeriesMoreSeriesNoSeriesFixture: ArtistSeriesMoreSeriesTestsQuery["rawResponse"] = {
  artistSeries: {
    id: "abc123",
    artist: [
      {
        id: "abc123",
        slug: "a-slug",
        internalID: "ja292jf92",
        artistSeriesConnection: {
          totalCount: 0,
          edges: [],
        },
      },
    ],
  },
}

const ArtistSeriesMoreSeriesFixture: ArtistSeriesMoreSeriesTestsQuery["rawResponse"] = {
  artistSeries: {
    id: "abc123",
    artist: [
      {
        id: "abc123",
        internalID: "jahfadf981",
        slug: "yayoi-kusama",
        artistSeriesConnection: {
          totalCount: 5,
          edges: [
            {
              node: {
                id: "yayoi-kusama-plums",
                featured: true,
                slug: "yayoi-kusama-plums",
                internalID: "da821a13-92fc-49c2-bbd5-bebb790f7020",
                title: "plums",
                artworksCountMessage: "40 available",
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/bLKO-OQg8UOzKuKcKxXeWQ/main.jpg",
                },
              },
            },
            {
              node: {
                id: "yayoi-kusama-apricots",
                featured: true,
                slug: "yayoi-kusama-apricots",
                internalID: "ecfa5731-9d64-4bc2-9f9f-c427a9126064",
                title: "apricots",
                artworksCountMessage: "35 available",
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/Oymspr9llGzRC-lTZA8htA/main.jpg",
                },
              },
            },
            {
              node: {
                id: "yayoi-kusama-pumpkins",
                featured: true,
                slug: "yayoi-kusama-pumpkins",
                internalID: "58597ef5-3390-406b-b6d2-d4e308125d0d",
                title: "Pumpkins",
                artworksCountMessage: "25 available",
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/dL3hz4h6f_tMHQjVHsdO4w/medium.jpg",
                },
              },
            },
            {
              node: {
                id: "yayoi-kusama-apples",
                featured: true,
                slug: "yayoi-kusama-apples",
                internalID: "5856ee51-35eb-4b75-bb12-15a1cd7e012e",
                title: "apples",
                artworksCountMessage: "4 available",
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
                },
              },
            },
            {
              node: {
                id: "yayoi-kusama-dragonfruit",
                featured: true,
                slug: "yayoi-kusama-dragonfruit",
                internalID: "5856ee51-35eb-4b75-bb12-15a1cd18161",
                title: "dragonfruit",
                artworksCountMessage: "8 available",
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
                },
              },
            },
          ],
        },
      },
    ],
  },
}

const ArtistSeriesMoreSeriesBelowViewAllThresholdFixture: ArtistSeriesMoreSeriesTestsQuery["rawResponse"] =
  {
    artistSeries: {
      id: "abc123",
      artist: [
        {
          id: "abc123",
          internalID: "jahfadf981",
          slug: "yayoi-kusama",
          artistSeriesConnection: {
            totalCount: 3,
            edges: [
              {
                node: {
                  id: "yayoi-kusama-pumpkins",
                  featured: true,
                  slug: "yayoi-kusama-pumpkins",
                  internalID: "58597ef5-3390-406b-b6d2-d4e308125d0d",
                  title: "Pumpkins",
                  artworksCountMessage: "25 available",
                  image: {
                    url: "https://d32dm0rphc51dk.cloudfront.net/dL3hz4h6f_tMHQjVHsdO4w/medium.jpg",
                  },
                },
              },
              {
                node: {
                  id: "yayoi-kusama-apples",
                  featured: true,
                  slug: "yayoi-kusama-apples",
                  internalID: "5856ee51-35eb-4b75-bb12-15a1cd7e012e",
                  title: "apples",
                  artworksCountMessage: "4 available",
                  image: {
                    url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
                  },
                },
              },
              {
                node: {
                  id: "yayoi-kusama-dragonfruit",
                  featured: true,
                  slug: "yayoi-kusama-dragonfruit",
                  internalID: "5856ee51-35eb-4b75-bb12-15a1cd18161",
                  title: "dragonfruit",
                  artworksCountMessage: "8 available",
                  image: {
                    url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  }
