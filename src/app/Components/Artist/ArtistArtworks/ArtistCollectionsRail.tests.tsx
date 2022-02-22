import { ArtistCollectionsRailTestsQueryRawResponse } from "__generated__/ArtistCollectionsRailTestsQuery.graphql"
import { GenericArtistSeriesRail } from "app/Components/GenericArtistSeriesRail"
import { CardRailCard } from "app/Components/Home/CardRailCard"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { ArtistCollectionsRailFragmentContainer } from "./ArtistCollectionsRail"

jest.unmock("react-relay")

describe("Artist Series Rail", () => {
  const getWrapper = async () => {
    return renderRelayTree({
      Component: (props: any) => {
        return (
          <GlobalStoreProvider>
            <Theme>
              <ArtistCollectionsRailFragmentContainer
                collections={props.marketingCollections}
                {...props}
              />
            </Theme>
          </GlobalStoreProvider>
        )
      },
      query: graphql`
        query ArtistCollectionsRailTestsQuery @raw_response_type {
          artist(id: "david-hockney") {
            ...ArtistCollectionsRail_artist
          }
          marketingCollections {
            ...ArtistCollectionsRail_collections
          }
        }
      `,
      mockData: {
        artist: artistMockData,
        marketingCollections: collectionsMockData,
      },
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error with all props", async () => {
    const wrapper = await getWrapper()
    expect(wrapper.find(GenericArtistSeriesRail)).toHaveLength(1)
  })

  it("tracks clicks to a collection", async () => {
    const wrapper = await getWrapper()

    wrapper.find(CardRailCard).at(0).simulate("click")

    expect(mockTrackEvent).toBeCalledWith({
      action_type: "tappedCollectionGroup",
      context_module: "artistSeriesRail",
      context_screen_owner_id: "artist0",
      context_screen_owner_slug: "david-hockney",
      context_screen_owner_type: "Artist",
      destination_screen_owner_id: "coll0",
      destination_screen_owner_slug: "cindy-sherman-untitled-film-stills",
      destination_screen_owner_type: "Collection",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })
})

const artistMockData: ArtistCollectionsRailTestsQueryRawResponse["artist"] = {
  id: "sdfsdfsdfsdf",
  internalID: "artist0",
  slug: "david-hockney",
}

const collectionsMockData: ArtistCollectionsRailTestsQueryRawResponse["marketingCollections"] = [
  {
    id: "coll0",
    slug: "cindy-sherman-untitled-film-stills",
    title: "Cindy Sherman: Untitled Film Stills",
    priceGuidance: 20000,
    artworksConnection: {
      id: "conn0",
      edges: [
        {
          node: {
            id: "artwork0",
            title: "Untitled (Film Still) Tray",
            image: {
              url: "https://cindy-sherman-untitled-film-stills/medium.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork1",
            title: "Untitled (Film Still) Tray 2",
            image: {
              url: "https://cindy-sherman-untitled-film-stills-2/medium.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork2",
            title: "Untitled (Film Still) Tray 3",
            image: {
              url: "https://cindy-sherman-untitled-film-stills-3/medium.jpg",
            },
          },
        },
      ],
    },
  },
  {
    id: "coll2",
    slug: "damien-hirst-butterflies",
    title: "Damien Hirst: Butterflies",
    priceGuidance: 7500,
    artworksConnection: {
      id: "conn2",
      edges: [
        {
          node: {
            id: "artwork0",
            title: "Untitled (Film Still) Tray",
            image: {
              url: "https://damien-hirst-butterflies/larger.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork1",
            title: "Untitled (Film Still) Tray 2",
            image: {
              url: "https://damien-hirst-butterflies-2/larger.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork2",
            title: "Untitled (Film Still) Tray 3",
            image: {
              url: "https://damien-hirst-butterflies-3/larger.jpg",
            },
          },
        },
      ],
    },
  },
  {
    id: "coll1",
    slug: "hunt-slonem-bunnies",
    title: "Hunt Slonem: Bunnies",
    priceGuidance: 2000,
    artworksConnection: {
      id: "conn1",
      edges: [
        {
          node: {
            id: "artwork0",
            title: "Untitled",
            image: {
              url: "https://hunt-slonem-bunnies/medium.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork1",
            title: "Untitled2",
            image: {
              url: "https://hunt-slonem-bunnies-2/medium.jpg",
            },
          },
        },
        {
          node: {
            id: "artwork2",
            title: "Untitled3",
            image: {
              url: "https://hunt-slonem-bunnies-3/medium.jpg",
            },
          },
        },
      ],
    },
  },
]
