import { ArtworkTestsQuery } from "__generated__/ArtworkTestsQuery.graphql"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ArtworkContainer } from "../Artwork"
import { ContextCard } from "../Components/ContextCard"

const trackEvent = jest.fn()

jest.unmock("react-relay")

describe("Artwork", () => {
  let environment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = ({ isVisible = true }) => (
    <QueryRenderer<ArtworkTestsQuery>
      environment={environment}
      query={graphql`
        query ArtworkTestsQuery @relay_test_operation {
          artwork(id: "doesn't matter") {
            ...Artwork_artwork
          }
        }
      `}
      variables={{ hello: true }}
      render={({ props, error }) => {
        if (props) {
          return <ArtworkContainer artwork={props.artwork} isVisible={isVisible} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    environment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
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

  it("refetches on re-appear", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)

    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation)
    })

    expect(environment.mock.getAllOperations()).toHaveLength(0)

    tree.update(<TestRenderer isVisible={false} />)
    tree.update(<TestRenderer isVisible={true} />)

    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe("ArtworkRefetchQuery")
  })

  it("does not show a contextCard if the work is in a non-auction sale", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)

    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation, {
        Sale() {
          return {
            isAuction: false,
          }
        },
      })
    })

    expect(tree.root.findAllByType(ContextCard)).toHaveLength(0)
  })

  it("does show a contextCard if the work is in an auction", () => {
    const tree = ReactTestRenderer.create(<TestRenderer isVisible />)

    environment.mock.resolveMostRecentOperation(operation => {
      return MockPayloadGenerator.generate(operation, {
        Sale() {
          return {
            isAuction: true,
          }
        },
      })
    })

    expect(tree.root.findAllByType(ContextCard)).toHaveLength(1)
  })
})
