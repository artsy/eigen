import {
  ArtworksInSeriesRailTestsQuery,
  ArtworksInSeriesRailTestsQueryRawResponse,
} from "__generated__/ArtworksInSeriesRailTestsQuery.graphql"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail/ArtworkTileRailCard"
import { navigate } from "lib/navigation/navigate"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworksInSeriesRail, ArtworksInSeriesRailFragmentContainer } from "./ArtworksInSeriesRail"

jest.unmock("react-relay")

describe("ArtworksInSeriesRail", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtworksInSeriesRailTestsQuery>
      environment={env}
      query={graphql`
        query ArtworksInSeriesRailTestsQuery @raw_response_type {
          artwork(id: "some-artwork") {
            ...ArtworksInSeriesRail_artwork
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.artwork) {
          return <ArtworksInSeriesRailFragmentContainer artwork={props.artwork} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...ArtworksInSeriesRailFixture,
        },
      })
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ArtworksInSeriesRail)).toHaveLength(1)
  })

  it("renders each artwork in the artist series", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ArtworkTileRailCard)).toHaveLength(5)
  })

  it("navigates to the artist series when the header is tapped", () => {
    const wrapper = getWrapper()
    const header = wrapper.root.findAllByType(TouchableOpacity)[0]
    header.props.onPress()
    expect(navigate).toHaveBeenCalledWith("/artist-series/alex-katz-departure")
  })

  it("tracks clicks to the View series button", () => {
    const wrapper = getWrapper()
    const header = wrapper.root.findAllByType(TouchableOpacity)[0]
    header.props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "moreFromThisSeries",
      context_screen_owner_id: "artwork124",
      context_screen_owner_slug: "my-cool-artwork",
      context_screen_owner_type: "artwork",
      destination_screen_owner_id: "katz124",
      destination_screen_owner_slug: "alex-katz-departure",
      destination_screen_owner_type: "artistSeries",
      type: "viewAll",
    })
  })

  it("tracks clicks on an individual artwork", () => {
    const wrapper = getWrapper()
    const firstArtwork = wrapper.root.findAllByType(ArtworkTileRailCard)[0]
    firstArtwork.props.onPress()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "moreFromThisSeries",
      context_screen_owner_id: "artwork124",
      context_screen_owner_slug: "my-cool-artwork",
      context_screen_owner_type: "artwork",
      destination_screen_owner_id: "5a20271ccd530e50722ae2df",
      destination_screen_owner_slug: "alex-katz-departure-28",
      destination_screen_owner_type: "artwork",
      type: "thumbnail",
    })
  })

  const ArtworksInSeriesRailFixture: ArtworksInSeriesRailTestsQueryRawResponse = {
    artwork: {
      id: "asdf123",
      internalID: "artwork124",
      slug: "my-cool-artwork",
      artistSeriesConnection: {
        edges: [
          {
            node: {
              slug: "alex-katz-departure",
              internalID: "katz124",
              filterArtworksConnection: {
                id: "abcabc",
                edges: [
                  {
                    node: {
                      id: "abc123",
                      slug: "alex-katz-departure-28",
                      internalID: "5a20271ccd530e50722ae2df",
                      href: "/artwork/alex-katz-departure-28",
                      artistNames: "Alex Katz",
                      image: {
                        imageURL:
                          "https://d32dm0rphc51dk.cloudfront.net/FCwTE6IvudGFVmnR9106xg/:version.jpg",
                        aspectRatio: 0.67,
                      },
                      sale: null,
                      saleArtwork: null,
                      saleMessage: "$20,000",
                      title: "Departure",
                      date: "2017",
                      partner: {
                        id: "abc123",
                        name: "Haw Contemporary",
                      },
                    },
                  },
                  {
                    node: {
                      id: "abc456",
                      slug: "alex-katz-departure-56",
                      internalID: "594c3b40b202a34d4f9810fe",
                      href: "/artwork/alex-katz-departure-56",
                      artistNames: "Alex Katz",
                      image: {
                        imageURL:
                          "https://d32dm0rphc51dk.cloudfront.net/PPclmZKx-vXZTSJdAEHUzw/:version.jpg",
                        aspectRatio: 0.67,
                      },
                      sale: null,
                      saleArtwork: null,
                      saleMessage: "$21,000",
                      title: "Departure",
                      date: "2017",
                      partner: {
                        id: "abc123",
                        name: "Newzones",
                      },
                    },
                  },
                  {
                    node: {
                      id: "abc789",
                      slug: "alex-katz-departure-2-ada",
                      internalID: "5daa29db5f3f9d000e059e00",
                      href: "/artwork/alex-katz-departure-2-ada",
                      artistNames: "Alex Katz",
                      image: {
                        imageURL:
                          "https://d32dm0rphc51dk.cloudfront.net/l9MiP2_A-_CoWimV4ZnNRA/:version.jpg",
                        aspectRatio: 0.5,
                      },
                      sale: null,
                      saleArtwork: null,
                      saleMessage: "Contact For Price",
                      title: "Departure 2 (Ada)",
                      date: "2017",
                      partner: {
                        id: "abc123",
                        name: "Kasmin",
                      },
                    },
                  },
                  {
                    node: {
                      id: "xyz123",
                      slug: "alex-katz-park-avenue-departure",
                      internalID: "5e7123b39d099c0011959efd",
                      href: "/artwork/alex-katz-park-avenue-departure",
                      artistNames: "Alex Katz",
                      image: {
                        imageURL:
                          "https://d32dm0rphc51dk.cloudfront.net/fz_V0Mj3GPFnKhMwujWB3g/:version.jpg",
                        aspectRatio: 0.67,
                      },
                      sale: null,
                      saleArtwork: null,
                      saleMessage: "Contact For Price",
                      title: "Park Avenue Departure",
                      date: "2019",
                      partner: {
                        id: "abc123",
                        name: "Kasmin",
                      },
                    },
                  },
                  {
                    node: {
                      id: "abc012",
                      slug: "alex-katz-departure-cut-out-2",
                      internalID: "5959da15c9dc2404d231179f",
                      href: "/artwork/alex-katz-departure-cut-out-2",
                      artistNames: "Alex Katz",
                      image: {
                        imageURL:
                          "https://d32dm0rphc51dk.cloudfront.net/IQp10TeWJi6CHJu-Nm6yrQ/:version.jpg",
                        aspectRatio: 0.7,
                      },
                      sale: null,
                      saleArtwork: null,
                      saleMessage: "Contact For Price",
                      title: "Departure (Cut-Out)",
                      date: "2017",
                      partner: {
                        id: "abc123",
                        name: "Meyerovich Gallery",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  }
})
