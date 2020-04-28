import { Theme } from "@artsy/palette"
import { ViewingRoomStatementTestsQuery } from "__generated__/ViewingRoomStatementTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworkRail } from "../ViewingRoomArtworkRail"
import { ViewingRoomStatementContainer } from "../ViewingRoomStatement"
import { ViewingRoomSubsections } from "../ViewingRoomSubsections"

jest.unmock("react-relay")

describe("ViewingRoomStatement", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
      <QueryRenderer<ViewingRoomStatementTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query ViewingRoomStatementTestsQuery {
            viewingRoom(id: "unused") {
              ...ViewingRoomStatement_viewingRoom
            }
          }
        `}
        render={renderWithLoadProgress(ViewingRoomStatementContainer)}
        variables={{}}
      />
    </Theme>
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it("renders an intro statement", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ introStatement: "Foo" }),
      })
      return result
    })
    expect(extractText(tree.root.findByProps({ "data-test-id": "intro-statement" }))).toEqual("Foo")
  })
  it("renders an artwork rail", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation)
      return result
    })
    expect(tree.root.findAllByType(ViewingRoomArtworkRail)).toHaveLength(1)
  })
  it("renders a pull quote", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ pullQuote: "Foo" }),
      })
      return result
    })
    expect(extractText(tree.root.findByProps({ "data-test-id": "pull-quote" }))).toEqual("Foo")
  })
  it("renders a body", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ body: "Foo" }),
      })
      return result
    })
    expect(extractText(tree.root.findByProps({ "data-test-id": "body" }))).toEqual("Foo")
  })
  it("renders the subsections", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation)
      return result
    })
    expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(1)
  })
  it("renders a button to view artworks", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({ artworksForCount: { totalCount: 42 } }),
      })
      return result
    })
    expect(extractText(tree.root.findByProps({ "data-test-id": "view-works" }))).toMatch("View works (42)")
  })
})
