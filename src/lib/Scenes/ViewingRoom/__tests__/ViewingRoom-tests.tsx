import { Theme } from "@artsy/palette"
import { ViewingRoomTestsQuery } from "__generated__/ViewingRoomTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworkRail } from "../Components/ViewingRoomArtworkRail"
import { ViewingRoomSubsections } from "../Components/ViewingRoomSubsections"
import { ViewingRoomRenderer } from "../ViewingRoom"

jest.unmock("react-relay")

describe("ViewingRoom", () => {
  let mockEnvironment
  const TestRenderer = () => (
    <Theme>
      <QueryRenderer<ViewingRoomTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query ViewingRoomTestsQuery {
            viewingRoom(id: "unused") {
              ...ViewingRoom_viewingRoom
            }
          }
        `}
        render={renderWithLoadProgress(ViewingRoomRenderer)}
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
