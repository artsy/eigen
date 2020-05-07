import { ViewingRoomTestsQuery } from "__generated__/ViewingRoomTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema } from "lib/utils/track"
import React from "react"
import { FlatList, TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
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

  it("renders a button + calls tracking when pull quote enters viewport", () => {
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

    expect(tree.root.findAllByProps({ "data-test-id": "view-works" })).toHaveLength(0)

    act(() => {
      tree.root.findByType(FlatList).props.onViewableItemsChanged({ viewableItems: [{ item: { key: "pullQuote" } }] })
    })

    expect(extractText(tree.root.findByProps({ "data-test-id": "view-works" }))).toMatch("View works (42)")
    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      action_name: Schema.ActionNames.PullQuoteImpression,
      context_screen: Schema.PageNames.ViewingRoom,
      context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      context_screen_owner_id: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
      context_screen_owner_slug: "gallery-name-viewing-room-name",
    })
  })

  it("navigates to artworks page on button press", () => {
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

    act(() => {
      tree.root.findByType(FlatList).props.onViewableItemsChanged({ viewableItems: [{ item: { key: "pullQuote" } }] })
    })

    tree.root.findByType(TouchableWithoutFeedback).props.onPress()

    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      action_name: Schema.ActionNames.TappedViewWorksButton,
      destination_screen: Schema.PageNames.ViewingRoomArtworks,
      destination_screen_owner_id: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
      destination_screen_owner_slug: "gallery-name-viewing-room-name",
      context_screen: Schema.PageNames.ViewingRoom,
      context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      context_screen_owner_id: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
      context_screen_owner_slug: "gallery-name-viewing-room-name",
    })
  })
})
