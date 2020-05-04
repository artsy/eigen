import { ViewingRoomTestsQuery } from "__generated__/ViewingRoomTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworkRail } from "../Components/ViewingRoomArtworkRail"
import { ViewingRoomSubsections } from "../Components/ViewingRoomSubsections"
import { ViewingRoomFragmentContainer } from "../ViewingRoom"

jest.unmock("react-relay")

describe("ViewingRoom", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ViewingRoomTestsQuery {
          viewingRoom(id: "unused") {
            ...ViewingRoom_viewingRoom
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
      variables={{}}
    />
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
    // TODO: add check that navigation + tracking has been called when tapping artworks/header
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
    expect(tree.root.findAllByProps({ "data-test-id": "view-works" })).toHaveLength(0)
    act(() => {
      tree.root.findByType(FlatList).props.onViewableItemsChanged({ viewableItems: [{ item: { key: "pullQuote" } }] })
    })
    // TODO: add check that tracking has been called
    expect(extractText(tree.root.findByProps({ "data-test-id": "view-works" }))).toMatch("View works (42)")
  })
})
