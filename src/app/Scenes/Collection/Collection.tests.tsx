import { CollectionTestsQuery } from "__generated__/CollectionTestsQuery.graphql"
import { AnimatedBottomButton } from "app/Components/AnimatedBottomButton"
import { FilterArtworkButton } from "app/Components/ArtworkFilter"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { CollectionContainer } from "./Collection"

describe("Collection", () => {
  const TestRenderer = () => (
    <QueryRenderer<CollectionTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query CollectionTestsQuery @relay_test_operation {
          marketingCollection(slug: "doesn't matter") {
            ...Collection_collection
          }
        }
      `}
      variables={{ hello: true }}
      render={({ props, error }) => {
        if (props) {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          return <CollectionContainer collection={props.marketingCollection} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("does not display a filter artworks button by default", () => {
    const root = renderWithWrappersLEGACY(<TestRenderer />).root

    expect(root.findAllByType(AnimatedBottomButton)).toHaveLength(0)
    expect(root.findAllByType(FilterArtworkButton)).toHaveLength(0)
  })
})
