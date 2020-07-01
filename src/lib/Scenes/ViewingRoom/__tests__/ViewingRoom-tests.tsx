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
import { ViewingRoomArtworkRailContainer } from "../Components/ViewingRoomArtworkRail"
import { ViewingRoomSubsections } from "../Components/ViewingRoomSubsections"
import { ViewingRoomViewWorksButtonContainer } from "../Components/ViewingRoomViewWorksButton"
import { ClosedNotice, tracks, ViewingRoomFragmentContainer } from "../ViewingRoom"

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

  describe("not yet open", () => {
    it("does not render normal sections", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ status: "scheduled" }),
        })
        return result
      })

      expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(0)
      expect(tree.root.findAllByProps({ "data-test-id": "intro-statement" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ "data-test-id": "pull-quote" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ "data-test-id": "body" })).toHaveLength(0)
      expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(0)
    })
    it("renders an 'opening soon' message", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ status: "scheduled" }),
        })
        return result
      })
      expect(extractText(tree.root.findByType(ClosedNotice))).toContain(
        "This viewing room is not yet open. We invite you to view this gallery’s current works."
      )
    })
  })

  describe("currently open", () => {
    const defaultProps = {
      status: "live",
    }
    it("renders an intro statement", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ introStatement: "Foo", ...defaultProps }),
        })
        console.log("VRVRVR ", result)
        return result
      })
      expect(extractText(tree.root.findByProps({ "data-test-id": "intro-statement" }))).toEqual("Foo")
    })
    it("renders an artwork rail", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ ...defaultProps }),
        })
        return result
      })
      expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(1)
    })
    it("renders a pull quote", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ pullQuote: "Foo", ...defaultProps }),
        })
        return result
      })
      expect(extractText(tree.root.findByProps({ "data-test-id": "pull-quote" }))).toEqual("Foo")
    })
    it("renders a body", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ body: "Foo", ...defaultProps }),
        })
        return result
      })
      expect(extractText(tree.root.findByProps({ "data-test-id": "body" }))).toEqual("Foo")
    })
    it("renders the subsections", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ ...defaultProps }),
        })
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
            ...defaultProps,
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
        action_type: Schema.ActionTypes.Impression,
        ...tracks.context("2955ab33-c205-44ea-93d2-514cd7ee2bcd", "gallery-name-viewing-room-name"),
      })
    })
  })

  describe("closed (past end datetime)", () => {
    it("does not render normal sections", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ status: "closed" }),
        })
        return result
      })

      expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(0)
      expect(tree.root.findAllByProps({ "data-test-id": "intro-statement" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ "data-test-id": "pull-quote" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ "data-test-id": "body" })).toHaveLength(0)
      expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(0)
    })
    it("renders a 'closed' message", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation(operation => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ status: "closed" }),
        })
        return result
      })

      expect(extractText(tree.root.findByType(ClosedNotice))).toContain(
        "This viewing room is now closed. We invite you to view this gallery’s current works."
      )
    })
  })
})
