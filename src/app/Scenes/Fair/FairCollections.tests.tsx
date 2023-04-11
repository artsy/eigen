import { Text, TouchableWithScale } from "@artsy/palette-mobile"
import { FairCollectionsTestsQuery } from "__generated__/FairCollectionsTestsQuery.graphql"
import { FairCollectionsFragmentContainer } from "app/Scenes/Fair/Components/FairCollections"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("FairCollections", () => {
  const trackEvent = useTracking().trackEvent
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappersLEGACY(
      <QueryRenderer<FairCollectionsTestsQuery>
        environment={env}
        query={graphql`
          query FairCollectionsTestsQuery($fairID: String!) @relay_test_operation {
            fair(id: $fairID) {
              ...FairCollections_fair
            }
          }
        `}
        variables={{ fairID: "art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.fair) {
            return null
          }

          return <FairCollectionsFragmentContainer fair={props.fair} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )

    return tree
  }

  it("renders the 2 collections", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        marketingCollections: [
          {
            title: "Big Artists, Small Sculptures",
            category: "Collectible Sculptures",
          },
          {
            title: "Example Collection 2",
            category: "Subtitle 2",
          },
        ],
      }),
    })

    const links = wrapper.root.findAllByType(TouchableWithScale)
    expect(links).toHaveLength(2)

    const text = wrapper.root
      .findAllByType(Text)
      .map(({ props: { children } }) => children)
      .join()

    expect(text).toContain("Big Artists, Small Sculptures")
    expect(text).toContain("Collectible Sculptures")
    expect(text).toContain("Example Collection 2")
    expect(text).toContain("Subtitle 2")
  })

  it("tracks taps on collections", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "abc123",
        slug: "art-basel-hong-kong-2020",
        marketingCollections: [
          {
            slug: "collectible-sculptures",
          },
        ],
      }),
    })
    const collection = wrapper.root.findAllByType(TouchableWithScale)[0]
    act(() => collection.props.onPress())

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedCollectionGroup",
      context_module: "curatedHighlightsRail",
      context_screen_owner_type: "fair",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      destination_screen_owner_type: "collection",
      destination_screen_owner_id: "collectible-sculptures",
      destination_screen_owner_slug: "collectible-sculptures",
      type: "thumbnail",
    })
  })

  it("renders null if there are no collections", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        marketingCollections: [],
      }),
    })

    expect(wrapper.toJSON()).toBe(null)
  })
})
