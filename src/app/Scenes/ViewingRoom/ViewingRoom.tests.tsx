import { act } from "@testing-library/react-native"
import { ViewingRoomTestsQuery } from "__generated__/ViewingRoomTestsQuery.graphql"
import { AnimatedBottomButton } from "app/Components/AnimatedBottomButton"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { ViewingRoomArtworkRailContainer } from "./Components/ViewingRoomArtworkRail"
import { ViewingRoomSubsections } from "./Components/ViewingRoomSubsections"
import { ClosedNotice, tracks, ViewingRoomFragmentContainer } from "./ViewingRoom"

describe("ViewingRoom", () => {
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomTestsQuery>
      environment={getRelayEnvironment()}
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

  describe("not yet open", () => {
    it("does not render normal sections", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      resolveMostRecentRelayOperation({
        ViewingRoom: () => ({ status: "scheduled" }),
      })

      expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "intro-statement" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "pull-quote" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "body" })).toHaveLength(0)
      expect(tree.root.findByProps({ testID: "share-button" })).toBeTruthy()
      expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(0)
    })

    it("renders an 'opening soon' message", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      resolveMostRecentRelayOperation({
        ViewingRoom: () => ({ status: "scheduled" }),
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
        resolveMostRecentRelayOperation({
          ViewingRoom: () => ({
            introStatement: "Foo",
            pullQuote: "Bar",
            body: "Baz",
            artworks: null,
            ...defaultProps,
          }),
        })
        expect(extractText(tree.root.findByProps({ testID: "intro-statement" }))).toEqual("Foo")
        expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(0)
        expect(extractText(tree.root.findByProps({ testID: "pull-quote" }))).toEqual("Bar")
        expect(extractText(tree.root.findByProps({ testID: "body" }))).toEqual("Baz")
        expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(1)
        expect(tree.root.findByProps({ testID: "share-button" })).toBeTruthy()
      })
    })
    describe("with artworks", () => {
      it("renders all sections", () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)
        resolveMostRecentRelayOperation({
          ViewingRoom: () => ({
            introStatement: "Foo",
            pullQuote: "Bar",
            body: "Baz",
            artworks: { totalCount: 5 },
            ...defaultProps,
          }),
        })
        expect(extractText(tree.root.findByProps({ testID: "intro-statement" }))).toEqual("Foo")
        expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(1)
        expect(extractText(tree.root.findByProps({ testID: "pull-quote" }))).toEqual("Bar")
        expect(extractText(tree.root.findByProps({ testID: "body" }))).toEqual("Baz")
        expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(1)
        expect(tree.root.findByProps({ testID: "share-button" })).toBeTruthy()
      })

      it("renders a button + calls tracking when body enters viewport", () => {
        const tree = renderWithWrappersLEGACY(<TestRenderer />)
        resolveMostRecentRelayOperation({
          ViewingRoom: () => ({
            artworksForCount: { totalCount: 42 },
            slug: "gallery-name-viewing-room-name",
            internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
            ...defaultProps,
          }),
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
      resolveMostRecentRelayOperation({
        ViewingRoom: () => ({ status: "closed" }),
      })

      expect(tree.root.findAllByType(ViewingRoomArtworkRailContainer)).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "intro-statement" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "pull-quote" })).toHaveLength(0)
      expect(tree.root.findAllByProps({ testID: "body" })).toHaveLength(0)
      expect(tree.root.findAllByType(ViewingRoomSubsections)).toHaveLength(0)
      expect(tree.root.findByProps({ testID: "share-button" })).toBeTruthy()
    })

    it("renders a 'closed' message", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      resolveMostRecentRelayOperation({
        ViewingRoom: () => ({ status: "closed" }),
      })

      expect(extractText(tree.root.findByType(ClosedNotice))).toContain(
        "This viewing room is now closed. We invite you to view this gallery’s current works."
      )
    })
  })
})
