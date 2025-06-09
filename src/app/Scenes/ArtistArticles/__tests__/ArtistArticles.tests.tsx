import { ArtistArticlesTestsQuery } from "__generated__/ArtistArticlesTestsQuery.graphql"
import { ArtistArticles, ArtistArticlesContainer } from "app/Scenes/ArtistArticles/ArtistArticles"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("Artist Articles", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistArticlesTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistArticlesTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistArticles_artist
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.artist) {
          return <ArtistArticlesContainer artist={props?.artist} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ArtistArticles)).toHaveLength(1)
  })
})
