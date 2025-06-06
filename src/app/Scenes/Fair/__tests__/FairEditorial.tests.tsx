import { Text, Touchable } from "@artsy/palette-mobile"
import { FairEditorialTestsQuery } from "__generated__/FairEditorialTestsQuery.graphql"
import { FairEditorialFragmentContainer } from "app/Scenes/Fair/Components/FairEditorial"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("FairEditorial", () => {
  const trackEvent = useTracking().trackEvent
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappersLEGACY(
      <QueryRenderer<FairEditorialTestsQuery>
        environment={env}
        query={graphql`
          query FairEditorialTestsQuery($fairID: String!) @relay_test_operation {
            fair(id: $fairID) {
              ...FairEditorial_fair
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

          return <FairEditorialFragmentContainer fair={props.fair} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )

    return tree
  }

  it("renders the 2 articles", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        articles: {
          totalCount: 2,
          edges: [
            {
              node: {
                title: "What Sold at Art Basel in Hong Kong’s Online Viewing Rooms",
              },
            },
            {
              node: {
                title: "In the Midst of COVID-19, Chinese Galleries Adapt and Persevere",
              },
            },
          ],
        },
      }),
    })

    const links = wrapper.root.findAllByType(Touchable)
    expect(links).toHaveLength(2)

    const text = wrapper.root
      .findAllByType(Text)
      .map(({ props: { children } }) => children)
      .join()

    expect(text).toContain("What Sold at Art Basel in Hong Kong’s Online Viewing Rooms")
    expect(text).toContain("In the Midst of COVID-19, Chinese Galleries Adapt and Persevere")
  })

  it("renders null if there are no articles", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        articles: {
          edges: [],
        },
      }),
    })

    expect(wrapper.toJSON()).toBe(null)
  })

  it("tracks article taps", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "def123",
        slug: "art-basel-hong-kong-2020",
        articles: {
          totalCount: 2,
          edges: [
            {
              node: {
                internalID: "xyz123",
                slug: "artsy-editorial-sold-art-basel-hong-kongs-online-viewing-rooms",
              },
            },
          ],
        },
      }),
    })
    const article = wrapper.root.findAllByType(Touchable)[0]
    act(() => article.props.onPress())

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArticleGroup",
      context_module: "relatedArticles",
      context_screen_owner_type: "fair",
      context_screen_owner_id: "def123",
      context_screen_owner_slug: "art-basel-hong-kong-2020",
      destination_screen_owner_type: "article",
      destination_screen_owner_id: "xyz123",
      destination_screen_owner_slug:
        "artsy-editorial-sold-art-basel-hong-kongs-online-viewing-rooms",
      type: "thumbnail",
    })
  })
})
