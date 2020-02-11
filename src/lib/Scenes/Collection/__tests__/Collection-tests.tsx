import { CollectionTestsQuery } from "__generated__/CollectionTestsQuery.graphql"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { CollectionContainer, FilterArtworkButton, FilterArtworkButtonContainer } from "../Collection"

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

  it("renders a snapshot", () => {
    const renderer = ReactTestRenderer.create(<TestRenderer />)
    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation)
    })
    expect(renderer.toJSON()).toMatchSnapshot()
  })

  it("does not display a filter artworks button by default", () => {
    const root = ReactTestRenderer.create(<TestRenderer />).root

    expect(root.findAllByType(FilterArtworkButtonContainer)).toHaveLength(0)
    expect(root.findAllByType(FilterArtworkButton)).toHaveLength(0)
  })

  /**  TODO: Pair with MX to complete get these assertions to pass
   * How do we mock an update to the state object and the Native Emission Module to
   * get these components to render
   */
  xit("does display a filter artworks button when artworks grid when artworks grid is in view", () => {
    // expect(root.findAllByType(FilterArtworkButtonContainer)).toHaveLength(1)
    // expect(root.findAllByType(FilterArtworkButton)).toHaveLength(1)
  })
})
