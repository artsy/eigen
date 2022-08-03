import { ArtistArticlesTestsQuery } from "__generated__/ArtistArticlesTestsQuery.graphql"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"

import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { ArtistArticles, ArtistArticlesContainer } from "./ArtistArticles"

describe("Artist Articles", () => {
  const TestRenderer = () => (
    <QueryRenderer<ArtistArticlesTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ArtistArticlesTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistArticles_artist
          }
        }
      `}
      variables={{ artistID: "banksy" }}
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
    resolveMostRecentRelayOperation(mockResolvers)
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ArtistArticles)).toHaveLength(1)
  })
})
