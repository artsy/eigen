import { CollectionTestsQuery } from "__generated__/CollectionTestsQuery.graphql"
import { AnimatedBottomButton } from "lib/Components/AnimatedBottomButton"
import { FilterArtworkButton } from "lib/Components/FilterModal"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { CollectionContainer } from "../Collection"

jest.unmock("react-relay")

describe("Collection", () => {
  let environment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<CollectionTestsQuery>
      environment={environment}
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
          // @ts-ignore STRICTNESS_MIGRATION
          return <CollectionContainer collection={props.marketingCollection} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("does not display a filter artworks button by default", () => {
    const root = renderWithWrappers(<TestRenderer />).root

    expect(root.findAllByType(AnimatedBottomButton)).toHaveLength(0)
    expect(root.findAllByType(FilterArtworkButton)).toHaveLength(0)
  })

  /**  TODO: Pair with MX to complete get these assertions to pass
   * How do we mock an update to the state object and the Native Emission Module to
   * get these components to render
   */
  xit("does display a filter artworks button when artworks grid when artworks grid is in view", () => {
    // expect(root.findAllByType(AnimatedBottomButton)).toHaveLength(1)
    // expect(root.findAllByType(FilterArtworkButton)).toHaveLength(1)
  })
})
