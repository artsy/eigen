import { act, fireEvent, screen } from "@testing-library/react-native"
import { FeaturedCollectionsRailTestsQuery } from "__generated__/FeaturedCollectionsRailTestsQuery.graphql"
import {
  FeaturedCollectionsRail,
  FeaturedCollectionsRailContainer,
} from "app/Scenes/Collection/Components/CollectionHubsRails/FeaturedCollections/FeaturedCollectionsRail"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ComponentProps } from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("Featured Collections Rail", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = () => (
    <QueryRenderer<FeaturedCollectionsRailTestsQuery>
      environment={env}
      query={graphql`
        query FeaturedCollectionsRailTestsQuery @raw_response_type {
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
            <FeaturedCollectionsRailContainer
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

  const renderWithRelayFixture = () => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...FeaturedCollectionsFixture,
        },
      })
    })
  }

  it("renders without throwing an error", () => {
    renderWithRelayFixture()
    expect(screen.getByTestId("group")).toHaveTextContent("Curated Highlights")
    expect(screen.getAllByRole("button")).toHaveLength(3)
  })

  it("correctly tracks when a collection is tapped", () => {
    renderWithRelayFixture()
    fireEvent.press(screen.getAllByRole("button")[0])

    expect(mockTrackEvent).toBeCalledWith({
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
    let props: ComponentProps<typeof FeaturedCollectionsRail>
    beforeEach(() => {
      props = {
        collectionGroup: FeaturedCollectionsFixture?.marketingCollection?.linkedCollections[0],
        collection: FeaturedCollectionsFixture?.marketingCollection,
      } as unknown as ComponentProps<typeof FeaturedCollectionsRail>
    })

    it("renders three collections in the Featured Collections Series", () => {
      renderWithWrappers(<FeaturedCollectionsRail {...props} />)

      expect(screen.getAllByRole("button")).toHaveLength(3)
    })

    it("renders the collection hub rail title", () => {
      renderWithWrappers(<FeaturedCollectionsRail {...props} />)
      expect(screen.getByTestId("group")).toHaveTextContent("Curated Highlights", { exact: true })
    })

    it("renders each Featured Collection's title", () => {
      renderWithWrappers(<FeaturedCollectionsRail {...props} />)

      expect(screen.getByTestId("title-0")).toHaveTextContent("First Featured Collection", {
        exact: true,
      })
      expect(screen.getByTestId("title-1")).toHaveTextContent("Second Featured Collection", {
        exact: true,
      })
      expect(screen.getByTestId("title-2")).toHaveTextContent("Third Featured Collection", {
        exact: true,
      })
    })

    it("renders each Featured Collection's price guidance metadata", () => {
      renderWithWrappers(<FeaturedCollectionsRail {...props} />)

      expect(screen.getByTestId("price-0")).toHaveTextContent("From $15,000", { exact: true })
      expect(screen.getByTestId("price-1")).toHaveTextContent("From $25,000", { exact: true })
      expect(screen.getByTestId("price-2")).toHaveTextContent("From $35,000", { exact: true })
    })

    it("navigates to a new collection when tapped", () => {
      renderWithWrappers(<FeaturedCollectionsRail {...props} />)

      fireEvent.press(screen.getAllByRole("button")[0])

      expect(navigate).toHaveBeenCalledWith("/collection/featured-collection-1")
    })
  })
})

const FeaturedCollectionsFixture: FeaturedCollectionsRailTestsQuery["rawResponse"] = {
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
              id: "",
              edges: [
                {
                  node: {
                    id: "",
                    image: {
                      url: "https://featured-collection-one/medium.jpg",
                      blurhash: null,
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
              id: "",
              edges: [
                {
                  node: {
                    id: "",
                    image: {
                      url: "https://featured-collection-two/medium.jpg",
                      blurhash: null,
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
              id: "",
              edges: [
                {
                  node: {
                    id: "",
                    image: {
                      url: "https://featured-collection-three /medium.jpg",
                      blurhash: null,
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
