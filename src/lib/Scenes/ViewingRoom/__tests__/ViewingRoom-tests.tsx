import { ViewingRoomTestsQuery } from "__generated__/ViewingRoomTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema } from "lib/utils/track"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomArtworkRail } from "../Components/ViewingRoomArtworkRail"
import { ViewingRoomSubsections } from "../Components/ViewingRoomSubsections"
import { ViewingRoomViewWorksButtonContainer } from "../Components/ViewingRoomViewWorksButton"
import { tracks, ViewingRoomFragmentContainer } from "../ViewingRoom"

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

  it("renders a button + calls tracking when body enters viewport", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          artworksForCount: { totalCount: 42 },
          slug: "gallery-name-viewing-room-name",
          internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        }),
      })
      return result
    })

    expect(tree.root.findAllByType(ViewingRoomViewWorksButtonContainer)).toHaveLength(0)

    act(() => {
      tree.root.findByType(FlatList).props.onViewableItemsChanged({ viewableItems: [{ item: { key: "body" } }] })
    })

    expect(tree.root.findAllByType(ViewingRoomViewWorksButtonContainer)).toHaveLength(1)
    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      action_name: Schema.ActionNames.BodyImpression,
      ...tracks.context("2955ab33-c205-44ea-93d2-514cd7ee2bcd", "gallery-name-viewing-room-name"),
    })
  })
})
