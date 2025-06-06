import { ViewingRoomTestsQuery } from "__generated__/ViewingRoomTestsQuery.graphql"
import { AnimatedBottomButton } from "app/Components/AnimatedBottomButton"
import { ViewingRoomArtworkRailContainer } from "app/Scenes/ViewingRoom/Components/ViewingRoomArtworkRail"
import { ViewingRoomSubsections } from "app/Scenes/ViewingRoom/Components/ViewingRoomSubsections"
import {
  ClosedNotice,
  tracks,
  ViewingRoomFragmentContainer,
} from "app/Scenes/ViewingRoom/ViewingRoom"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

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
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ status: "scheduled" }),
        })
        return result
      })

      expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "intro-statement" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "pull-quote" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "body" })).toHaveLength(0)
      expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(0)
    })

    it("renders an 'opening soon' message", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
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
    describe("without any artworks", () => {
      it("doesn't render artworks rail", () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)
        mockEnvironment.mock.resolveMostRecentOperation((operation) => {
          const result = MockPayloadGenerator.generate(operation, {
            ViewingRoom: () => ({
              introStatement: "Foo",
              pullQuote: "Bar",
              body: "Baz",
              artworks: null,
              ...defaultProps,
            }),
          })
          return result
        })
        expect(extractText(tree.root.findByProps({ testID: "intro-statement" }))).toEqual("Foo")
        expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(0)
        expect(extractText(tree.root.findByProps({ testID: "pull-quote" }))).toEqual("Bar")
        expect(extractText(tree.root.findByProps({ testID: "body" }))).toEqual("Baz")
        expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(1)
      })
    })
    describe("with artworks", () => {
      it("renders all sections", () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)
        mockEnvironment.mock.resolveMostRecentOperation((operation) => {
          const result = MockPayloadGenerator.generate(operation, {
            ViewingRoom: () => ({
              introStatement: "Foo",
              pullQuote: "Bar",
              body: "Baz",
              artworks: { totalCount: 5 },
              ...defaultProps,
            }),
          })
          return result
        })
        expect(extractText(tree.root.findByProps({ testID: "intro-statement" }))).toEqual("Foo")
        expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(1)
        expect(extractText(tree.root.findByProps({ testID: "pull-quote" }))).toEqual("Bar")
        expect(extractText(tree.root.findByProps({ testID: "body" }))).toEqual("Baz")
        expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(1)
      })

      it("renders a button + calls tracking when body enters viewport", () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)
        mockEnvironment.mock.resolveMostRecentOperation((operation) => {
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

        expect(tree.root.findAllByType(AnimatedBottomButton)).toHaveLength(1)
        expect(tree.root.findAllByType(AnimatedBottomButton)[0].props.isVisible).toBe(false)

        act(() => {
          tree.root
            .findByType(FlatList)
            .props.onViewableItemsChanged({ viewableItems: [{ item: { key: "body" } }] })
        })

        expect(tree.root.findAllByType(AnimatedBottomButton)[0].props.isVisible).toBe(true)
        expect(useTracking().trackEvent).toHaveBeenCalledWith(
          tracks.bodyImpression(
            "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
            "gallery-name-viewing-room-name"
          )
        )
      })
    })
  })

  describe("closed (past end datetime)", () => {
    it("renders share button and no subsections", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
        const result = MockPayloadGenerator.generate(operation, {
          ViewingRoom: () => ({ status: "closed" }),
        })
        return result
      })

      expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "intro-statement" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "pull-quote" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "body" })).toHaveLength(0)
      expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(0)
    })

    it("renders a 'closed' message", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      mockEnvironment.mock.resolveMostRecentOperation((operation) => {
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
