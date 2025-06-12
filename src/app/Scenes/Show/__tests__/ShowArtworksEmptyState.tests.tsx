import { ShowArtworksEmptyStateTestsQuery } from "__generated__/ShowArtworksEmptyStateTestsQuery.graphql"
import { ShowArtworksEmptyStateFragmentContainer } from "app/Scenes/Show/Components/ShowArtworksEmptyState"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("ShowArtworksEmptyState", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ShowArtworksEmptyStateTestsQuery>
      environment={env}
      query={graphql`
        query ShowArtworksEmptyStateTestsQuery @relay_test_operation {
          show(id: "example-show-id") {
            ...ShowArtworksEmptyState_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowArtworksEmptyStateFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  describe("fair booth", () => {
    it("renders the correct message for non-closed fair booths", () => {
      const wrapper = getWrapper({ Show: () => ({ isFairBooth: true }) })
      const text = extractText(wrapper.root)

      expect(text).toContain(
        "This fair booth is currently unavailable. Please check back closer to the fair for artworks."
      )
    })

    it("renders the correct message for closed fair booths", () => {
      const wrapper = getWrapper({
        Show: () => ({ isFairBooth: true, status: "closed" }),
      })
      const text = extractText(wrapper.root)

      expect(text).toContain("This fair booth is currently unavailable.")
      expect(text).not.toContain("Please check back closer to the fair for artworks.")
    })
  })

  describe("show", () => {
    it("renders the correct message for non-closed shows", () => {
      const wrapper = getWrapper({ Show: () => ({ isFairBooth: false }) })
      const text = extractText(wrapper.root)

      expect(text).toContain(
        "This show is currently unavailable. Please check back closer to the show for artworks."
      )
    })

    it("renders the correct message for closed shows", () => {
      const wrapper = getWrapper({
        Show: () => ({ isFairBooth: false, status: "closed" }),
      })
      const text = extractText(wrapper.root)

      expect(text).toContain("This show is currently unavailable.")
      expect(text).not.toContain("Please check back closer to the show for artworks.")
    })
  })
})
