import { ArtistSeriesTestsQuery, ArtistSeriesTestsQueryRawResponse } from "__generated__/ArtistSeriesTestsQuery.graphql"
import { ArtistSeries, ArtistSeriesFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeries"
import { ArtistSeriesArtworks } from "lib/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeader } from "lib/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMeta } from "lib/Scenes/ArtistSeries/ArtistSeriesMeta"
import { ArtistSeriesMoreSeries } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistSeriesListItem } from "../ArtistSeriesListItem"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

const trackEvent = useTracking().trackEvent

describe("Artist Series Rail", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesTestsQuery @raw_response_type {
          artistSeries(id: "pumpkins") {
            ...ArtistSeries_artistSeries
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          return <ArtistSeriesFragmentContainer artistSeries={props.artistSeries} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (testFixture: ArtistSeriesTestsQueryRawResponse) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...testFixture,
        },
      })
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper(ArtistSeriesFixture)
    expect(wrapper.root.findAllByType(ArtistSeries)).toHaveLength(1)
  })

  it("renders the necessary subcomponents", () => {
    const wrapper = getWrapper(ArtistSeriesFixture)
    expect(wrapper.root.findAllByType(ArtistSeriesHeader)).toHaveLength(1)
    expect(wrapper.root.findAllByType(ArtistSeriesMeta)).toHaveLength(1)
    expect(wrapper.root.findAllByType(ArtistSeriesArtworks)).toHaveLength(1)
    expect(wrapper.root.findAllByType(ArtistSeriesMoreSeries)).toHaveLength(1)
  })

  it("tracks clicks to the artist series group", () => {
    const wrapper = getWrapper(ArtistSeriesFixture)
    const artistSeriesButton = wrapper.root.findByType(ArtistSeriesListItem).findByType(TouchableOpacity)
    act(() => artistSeriesButton.props.onPress())

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtistSeriesGroup",
      context_module: "moreSeriesByThisArtist",
      context_screen_owner_id: "abc",
      context_screen_owner_slug: "more-pumpkins",
      context_screen_owner_type: "artistSeries",
      destination_screen_owner_id: "abc",
      destination_screen_owner_slug: "yayoi-kusama-other-fruits",
      destination_screen_owner_type: "artistSeries",
      horizontal_slide_position: 0,
      curation_boost: false,
      type: "thumbnail",
    })
  })

  describe("with an artist series without an artist", () => {
    it("does not render ArtistSeriesMoreSeries", () => {
      const wrapper = getWrapper(ArtistSeriesNoArtistFixture)
      expect(wrapper.root.findAllByType(ArtistSeriesMoreSeries)).toHaveLength(0)
    })
  })
})

const ArtistSeriesFixture: ArtistSeriesTestsQueryRawResponse = {
  artistSeries: {
    title: "These are the Pumpkins",
    slug: "more-pumpkins",
    internalID: "abc",
    description: "A deliciously artistic variety of painted pumpkins.",
    image: {
      url: "https://www.imagesofthispumpkin.net/pgn",
    },
    artistIDs: ["abc123"],
    artists: [
      {
        id: "an-id",
        internalID: "123456ASCFG",
        name: "Yayoi Kusama",
        slug: "yayoi-kusama",
        isFollowed: true,
        image: {
          url: "https://www.images.net/pumpkins",
        },
      },
    ],
    artist: [
      {
        id: "123456ASCFG",
        internalID: "fhaua1381",
        artistSeriesConnection: {
          totalCount: 1,
          edges: [
            {
              node: {
                slug: "yayoi-kusama-other-fruits",
                internalID: "abc",
                title: "Other Fruits",
                featured: false,
                artworksCountMessage: "22 available",
                image: {
                  url: "https://www.images.net/fruits",
                },
              },
            },
          ],
        },
      },
    ],
    artistSeriesArtworks: {
      pageInfo: {
        hasNextPage: false,
        startCursor: "ajdjabnz81",
        endCursor: "aknqa9d81",
      },
      id: null,
      counts: { total: 4 },
      edges: [
        {
          node: {
            id: "12345654321",
            internalID: "abc",
            slug: "pumpkins-1",
            image: null,
            title: "Pumpkins 1.0",
            date: null,
            saleMessage: null,
            artistNames: null,
            href: null,
            sale: null,
            saleArtwork: null,
            partner: null,
            __typename: "Artwork",
          },
          cursor: "123456789",
          id: "#8989141",
        },
      ],
    },
  },
}

const ArtistSeriesNoArtistFixture: ArtistSeriesTestsQueryRawResponse = {
  artistSeries: {
    title: "These are the Pumpkins",
    internalID: "abc",
    slug: "more-pumpkins",
    description: "A deliciously artistic variety of painted pumpkins.",
    image: {
      url: "https://www.imagesofthispumpkin.net/pgn",
    },
    artistIDs: [],
    artists: [],
    artist: [],
    artistSeriesArtworks: {
      pageInfo: {
        hasNextPage: false,
        startCursor: "ajdjabnz81",
        endCursor: "aknqa9d81",
      },
      id: null,
      counts: { total: 4 },
      edges: [
        {
          node: {
            id: "12345654321",
            internalID: "abc",
            slug: "pumpkins-1",
            image: null,
            title: "Pumpkins 1.0",
            date: null,
            saleMessage: null,
            artistNames: null,
            href: null,
            sale: null,
            saleArtwork: null,
            partner: null,
            __typename: "Artwork",
          },
          cursor: "123456789",
          id: "#8989141",
        },
      ],
    },
  },
}
