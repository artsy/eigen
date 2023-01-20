import { act, fireEvent } from "@testing-library/react-native"
import { CollectionArtistSeriesRailTestsQuery } from "__generated__/CollectionArtistSeriesRailTestsQuery.graphql"
import { GenericArtistSeriesRail } from "app/Components/GenericArtistSeriesRail"
import { CardRailCard } from "app/Components/Home/CardRailCard"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import {
  CollectionArtistSeriesRail,
  CollectionArtistSeriesRailContainer,
} from "app/Scenes/Collection/Components/CollectionHubsRails/ArtistSeries/CollectionArtistSeriesRail"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

describe("Artist Series Rail", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<CollectionArtistSeriesRailTestsQuery>
      environment={env}
      query={graphql`
        query CollectionArtistSeriesRailTestsQuery @raw_response_type {
          marketingCollection(slug: "photography") {
            ...CollectionArtistSeriesRail_collection
            linkedCollections {
              groupType
              ...CollectionArtistSeriesRail_collectionGroup
            }
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.marketingCollection) {
          return (
            <CollectionArtistSeriesRailContainer
              collection={props.marketingCollection}
              collectionGroup={props.marketingCollection.linkedCollections[0]}
            />
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...CollectionHubRailsArtistSeriesFixture,
        },
      })
    })
    return tree
  }

  beforeEach(() => {
    env = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(GenericArtistSeriesRail)).toHaveLength(1)
  })

  it("correctly tracks when a collection is tapped", () => {
    const wrapper = getWrapper()
    wrapper.root.findAllByType(CardRailCard)[0].props.onPress()

    expect(mockTrackEvent).toBeCalledWith({
      action_type: "tappedCollectionGroup",
      context_module: "artistSeriesRail",
      context_screen_owner_id: "collection0",
      context_screen_owner_slug: "cool-collection",
      context_screen_owner_type: "Collection",
      destination_screen_owner_id: "collection1",
      destination_screen_owner_slug: "cindy-sherman-untitled-film-stills",
      destination_screen_owner_type: "Collection",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  describe("Trending Artists Rail", () => {
    let props: any /* STRICTNESS_MIGRATION */
    beforeEach(() => {
      props = {
        collectionGroup:
          CollectionHubRailsArtistSeriesFixture?.marketingCollection?.linkedCollections[0],
        collection: CollectionHubRailsArtistSeriesFixture?.marketingCollection,
      }
    })

    it("renders three artist series in the Trending Artists Series", () => {
      const { queryByText } = renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(queryByText("Cindy Sherman: Untitled Film Stills")).toBeTruthy()
      expect(queryByText("Damien Hirst: Butterflies")).toBeTruthy()
      expect(queryByText("Hunt Slonem: Bunnies")).toBeTruthy()
    })

    it("renders three images of the correct size in an artist series", () => {
      const { UNSAFE_getAllByType } = renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(UNSAFE_getAllByType(ImageView)[0]).toHaveProp(
        "imageURL",
        "https://cindy-sherman-untitled-film-stills/medium.jpg"
      )
      expect(UNSAFE_getAllByType(ImageView)[0]).toHaveProp("height", 180)
      expect(UNSAFE_getAllByType(ImageView)[0]).toHaveProp("width", 180)

      expect(UNSAFE_getAllByType(ImageView)[1]).toHaveProp(
        "imageURL",
        "https://cindy-sherman-untitled-film-stills-2/medium.jpg"
      )
      expect(UNSAFE_getAllByType(ImageView)[1]).toHaveProp("height", 90)
      expect(UNSAFE_getAllByType(ImageView)[1]).toHaveProp("width", 90)

      expect(UNSAFE_getAllByType(ImageView)[2]).toHaveProp(
        "imageURL",
        "https://cindy-sherman-untitled-film-stills-3/medium.jpg"
      )
      expect(UNSAFE_getAllByType(ImageView)[2]).toHaveProp("height", 90)
      expect(UNSAFE_getAllByType(ImageView)[2]).toHaveProp("width", 90)
    })

    it("renders the collection hub rail title", () => {
      const { queryByText } = renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(queryByText("Trending Artist Series")).toBeTruthy()
    })

    it("renders each artist series' title", () => {
      const { queryByText } = renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(queryByText("Cindy Sherman: Untitled Film Stills")).toBeTruthy()
      expect(queryByText("Damien Hirst: Butterflies")).toBeTruthy()
      expect(queryByText("Hunt Slonem: Bunnies")).toBeTruthy()
    })

    it("renders each artist series' metadata", () => {
      const { queryByText } = renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(queryByText("From $20,000")).toBeTruthy()
      expect(queryByText("From $7,500")).toBeTruthy()
      expect(queryByText("From $2,000")).toBeTruthy()
    })

    it("navigates to a new collection when a series is tapped", () => {
      const { getByText } = renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      fireEvent.press(getByText("Cindy Sherman: Untitled Film Stills"))
      expect(navigate).toHaveBeenCalledWith("/collection/cindy-sherman-untitled-film-stills")

      fireEvent.press(getByText("Damien Hirst: Butterflies"))
      expect(navigate).toHaveBeenCalledWith("/collection/damien-hirst-butterflies")

      fireEvent.press(getByText("Hunt Slonem: Bunnies"))
      expect(navigate).toHaveBeenCalledWith("/collection/hunt-slonem-bunnies")
    })
  })
})

const CollectionHubRailsArtistSeriesFixture: CollectionArtistSeriesRailTestsQuery["rawResponse"] = {
  marketingCollection: {
    id: "collection0",
    slug: "cool-collection",
    linkedCollections: [
      {
        groupType: "ArtistSeries",
        name: "Trending Artist Series",
        members: [
          {
            slug: "cindy-sherman-untitled-film-stills",
            id: "collection1",
            title: "Cindy Sherman: Untitled Film Stills",
            priceGuidance: 20000,
            artworksConnection: {
              id: "conn1",
              edges: [
                {
                  node: {
                    id: "artwork1",
                    title: "Untitled (Film Still) Tray",
                    image: {
                      url: "https://cindy-sherman-untitled-film-stills/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork2",
                    title: "Untitled (Film Still) Tray 2",
                    image: {
                      url: "https://cindy-sherman-untitled-film-stills-2/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork3",
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
            slug: "damien-hirst-butterflies",
            id: "collection2",
            title: "Damien Hirst: Butterflies",
            priceGuidance: 7500,
            artworksConnection: {
              id: "conn2",
              edges: [
                {
                  node: {
                    id: "artwork4",
                    title: "Untitled (Film Still) Tray",
                    image: {
                      url: "https://damien-hirst-butterflies/larger.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork5",
                    title: "Untitled (Film Still) Tray 2",
                    image: {
                      url: "https://damien-hirst-butterflies-2/larger.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork6",
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
            slug: "hunt-slonem-bunnies",
            id: "collection3",
            title: "Hunt Slonem: Bunnies",
            priceGuidance: 2000,
            artworksConnection: {
              id: "conn3",
              edges: [
                {
                  node: {
                    id: "artwork7",
                    title: "Untitled",
                    image: {
                      url: "https://hunt-slonem-bunnies/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork8",
                    title: "Untitled2",
                    image: {
                      url: "https://hunt-slonem-bunnies-2/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork9",
                    title: "Untitled3",
                    image: {
                      url: "https://hunt-slonem-bunnies-3/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
}
