import { Theme } from "@artsy/palette"
import {
  FeaturedCollectionsTestsQuery,
  FeaturedCollectionsTestsQueryRawResponse,
} from "__generated__/FeaturedCollectionsTestsQuery.graphql"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import {
  CollectionGroup,
  FeaturedCollectionPrice,
  FeaturedCollectionsRail,
  FeaturedCollectionsRailContainer,
  FeaturedCollectionTitle,
  ImageWrapper,
} from "lib/Scenes/Collection/Components/CollectionHubsRails/FeaturedCollections/FeaturedCollectionsRail"
import React from "react"
import { TouchableHighlight } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))
jest.mock("react-tracking")

describe("Featured Collections Rail", () => {
  const trackEvent = jest.fn()
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
    const mockTracking = useTracking as jest.Mock
    mockTracking.mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = () => (
    <QueryRenderer<FeaturedCollectionsTestsQuery>
      environment={env}
      query={graphql`
        query FeaturedCollectionsTestsQuery @raw_response_type {
          marketingCollection(slug: "post-war") {
            ...FeaturedCollectionsRail_collection
            linkedCollections {
              groupType
              ...FeaturedCollectionsRail_collectionGroup
            }
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.marketingCollection) {
          return (
            <Theme>
              <FeaturedCollectionsRailContainer
                collection={props.marketingCollection}
                collectionGroup={props.marketingCollection.linkedCollections[0]}
              />
            </Theme>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...FeaturedCollectionsFixture,
        },
      })
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(FeaturedCollectionsRail)).toHaveLength(1)
  })

  it("correctly tracks when a collection is tapped", () => {
    const wrapper = getWrapper()
    wrapper.root.findAllByType(TouchableHighlight)[0].props.onPress()

    expect(trackEvent).toBeCalledWith({
      action_type: "tappedCollectionGroup",
      context_module: "curatedHighlightsRail",
      context_screen_owner_id: "hub-collection",
      context_screen_owner_slug: "hub-collection-slug",
      context_screen_owner_type: "Collection",
      destination_screen_owner_id: "featured-collection-id-1",
      destination_screen_owner_slug: "featured-collection-1",
      destination_screen_owner_type: "Collection",
      horizontal_slide_position: 1,
      type: "thumbnail",
    })
  })

  describe("Featured Collections Rail", () => {
    let props: any /* STRICTNESS_MIGRATION */
    beforeEach(() => {
      props = {
        collectionGroup: FeaturedCollectionsFixture?.marketingCollection?.linkedCollections[0],
        collection: FeaturedCollectionsFixture?.marketingCollection,
      }
    })

    it("renders the Featured Collections Series rail component", () => {
      const wrapper = mount(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      )

      expect(wrapper.find(CollectionGroup)).toHaveLength(1)
    })

    it("renders three collections in the Featured Collections Series", () => {
      const wrapper = mount(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      )

      expect(wrapper.find(ImageWrapper)).toHaveLength(3)
    })

    it("renders the collection hub rail title", () => {
      const wrapper = mount(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      )

      expect(
        wrapper
          .find(CollectionGroup)
          .at(0)
          .text()
      ).toBe("Curated Highlights")
    })

    it("renders each Featured Collection's title", () => {
      const wrapper = mount(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      )

      expect(
        wrapper
          .find(FeaturedCollectionTitle)
          .at(0)
          .text()
      ).toBe("First Featured Collection")

      expect(
        wrapper
          .find(FeaturedCollectionTitle)
          .at(1)
          .text()
      ).toBe("Second Featured Collection")

      expect(
        wrapper
          .find(FeaturedCollectionTitle)
          .at(2)
          .text()
      ).toBe("Third Featured Collection")
    })

    it("renders each Featured Collections's price guidance metadata", () => {
      const wrapper = mount(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      )

      expect(
        wrapper
          .find(FeaturedCollectionPrice)
          .at(0)
          .text()
      ).toBe("From $15,000")

      expect(
        wrapper
          .find(FeaturedCollectionPrice)
          .at(1)
          .text()
      ).toBe("From $25,000")

      expect(
        wrapper
          .find(FeaturedCollectionPrice)
          .at(2)
          .text()
      ).toBe("From $35,000")
    })

    xit("navigates to a new collection when tapped", () => {
      const wrapper = mount(
        <Theme>
          <FeaturedCollectionsRail {...props} />
        </Theme>
      )

      wrapper
        .find(TouchableHighlight)
        .at(0)
        .props()
        .onPress()

      expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
        expect.anything(),
        "/collection/featured-collection-1"
      )

      wrapper
        .find(TouchableHighlight)
        .at(1)
        .props()
        .onPress()

      expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
        expect.anything(),
        "/collection/featured-collection-2"
      )

      wrapper
        .find(TouchableHighlight)
        .at(2)
        .props()
        .onPress()

      expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
        expect.anything(),
        "/collection/featured-collection-3"
      )
    })
  })
})

const FeaturedCollectionsFixture: FeaturedCollectionsTestsQueryRawResponse = {
  marketingCollection: {
    id: "hub-collection",
    slug: "hub-collection-slug",
    linkedCollections: [
      {
        groupType: "FeaturedCollections",
        name: "Curated Highlights",
        members: [
          {
            slug: "featured-collection-1",
            id: "featured-collection-id-1",
            title: "First Featured Collection",
            priceGuidance: 15000,
            descriptionMarkdown: "Featured collection 1 description",
            featuredCollectionArtworks: {
              id: null,
              edges: [
                {
                  node: {
                    id: null,
                    image: {
                      url: "https://featured-collection-one/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            slug: "featured-collection-2",
            id: "featured-collection-id-2",
            title: "Second Featured Collection",
            priceGuidance: 25000,
            descriptionMarkdown: "Featured collection 2 description",
            featuredCollectionArtworks: {
              id: null,
              edges: [
                {
                  node: {
                    id: null,
                    image: {
                      url: "https://featured-collection-two/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            slug: "featured-collection-1",
            id: "featured-collection-id-3",
            title: "Third Featured Collection",
            priceGuidance: 35000,
            descriptionMarkdown: "Featured collection 3 description",
            featuredCollectionArtworks: {
              id: null,
              edges: [
                {
                  node: {
                    id: null,
                    image: {
                      url: "https://featured-collection-three /medium.jpg",
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
