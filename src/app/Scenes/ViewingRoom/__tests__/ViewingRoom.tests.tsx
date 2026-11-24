import { act, fireEvent, screen } from "@testing-library/react-native"
import { ViewingRoomTestsQuery } from "__generated__/ViewingRoomTestsQuery.graphql"
import { tracks, ViewingRoomFragmentContainer } from "app/Scenes/ViewingRoom/ViewingRoom"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

// Render AnimatedBottomButton as a host view exposing `isVisible` so it can be asserted on
jest.mock("app/Components/AnimatedBottomButton", () => {
  const React = jest.requireActual("react")
  const { View } = jest.requireActual("react-native")
  return {
    AnimatedBottomButton: ({ isVisible, children }: any) =>
      React.createElement(View, { testID: "animated-bottom-button", isVisible }, children),
  }
})

// ViewingRoomArtworkRail renders a "<count> artworks" section title
const ARTWORK_RAIL_TITLE = /^\d* artworks?$/i

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
    it("does not render normal sections", async () => {
      await renderWithWrappers(<TestRenderer />)

      await act(async () => {
        mockEnvironment.mock.resolveMostRecentOperation((operation) => {
          const result = MockPayloadGenerator.generate(operation, {
            ViewingRoom: () => ({ status: "scheduled" }),
          })
          return result
        })
        await flushPromiseQueue()
      })

      expect(screen.queryByText(ARTWORK_RAIL_TITLE)).not.toBeOnTheScreen()
      expect(screen.queryByTestId("intro-statement")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("pull-quote")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("body")).not.toBeOnTheScreen()
      // ViewingRoomSubsections
      expect(screen.queryByTestId("subsection")).not.toBeOnTheScreen()
    })

    it("renders an 'opening soon' message", async () => {
      await renderWithWrappers(<TestRenderer />)

      await act(async () => {
        mockEnvironment.mock.resolveMostRecentOperation((operation) => {
          const result = MockPayloadGenerator.generate(operation, {
            ViewingRoom: () => ({ status: "scheduled" }),
          })
          return result
        })
        await flushPromiseQueue()
      })
      expect(
        screen.getByText(
          "This viewing room is not yet open. We invite you to view this gallery’s current works."
        )
      ).toBeOnTheScreen()
    })
  })

  describe("currently open", () => {
    const defaultProps = {
      status: "live",
    }
    describe("without any artworks", () => {
      it("doesn't render artworks rail", async () => {
        await renderWithWrappers(<TestRenderer />)

        await act(async () => {
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
          await flushPromiseQueue()
        })
        expect(screen.getByTestId("intro-statement")).toHaveTextContent("Foo", { exact: true })
        expect(screen.queryByText(ARTWORK_RAIL_TITLE)).not.toBeOnTheScreen()
        expect(screen.getByTestId("pull-quote")).toHaveTextContent("Bar", { exact: true })
        expect(screen.getByTestId("body")).toHaveTextContent("Baz", { exact: true })
        // ViewingRoomSubsections
        expect(screen.getAllByTestId("subsection")).toHaveLength(1)
      })
    })
    describe("with artworks", () => {
      it("renders all sections", async () => {
        await renderWithWrappers(<TestRenderer />)

        await act(async () => {
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
          await flushPromiseQueue()
        })
        expect(screen.getByTestId("intro-statement")).toHaveTextContent("Foo", { exact: true })
        expect(screen.getByText("5 Artworks")).toBeOnTheScreen()
        expect(screen.getByTestId("pull-quote")).toHaveTextContent("Bar", { exact: true })
        expect(screen.getByTestId("body")).toHaveTextContent("Baz", { exact: true })
        // ViewingRoomSubsections
        expect(screen.getAllByTestId("subsection")).toHaveLength(1)
      })

      it("renders a button + calls tracking when body enters viewport", async () => {
        await renderWithWrappers(<TestRenderer />)

        await act(async () => {
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
          await flushPromiseQueue()
        })

        expect(screen.getAllByTestId("animated-bottom-button")).toHaveLength(1)
        expect(screen.getByTestId("animated-bottom-button")).toHaveProp("isVisible", false)

        // The event bubbles up from a list item to the FlatList's `onViewableItemsChanged` handler
        await fireEvent(screen.getByTestId("body"), "viewableItemsChanged", {
          viewableItems: [{ item: { key: "body" } }],
        })

        expect(screen.getByTestId("animated-bottom-button")).toHaveProp("isVisible", true)
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
    it("renders share button and no subsections", async () => {
      await renderWithWrappers(<TestRenderer />)

      await act(async () => {
        mockEnvironment.mock.resolveMostRecentOperation((operation) => {
          const result = MockPayloadGenerator.generate(operation, {
            ViewingRoom: () => ({ status: "closed" }),
          })
          return result
        })
        await flushPromiseQueue()
      })

      expect(screen.queryByText(ARTWORK_RAIL_TITLE)).not.toBeOnTheScreen()
      expect(screen.queryByTestId("intro-statement")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("pull-quote")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("body")).not.toBeOnTheScreen()
      // ViewingRoomSubsections
      expect(screen.queryByTestId("subsection")).not.toBeOnTheScreen()
    })

    it("renders a 'closed' message", async () => {
      await renderWithWrappers(<TestRenderer />)

      await act(async () => {
        mockEnvironment.mock.resolveMostRecentOperation((operation) => {
          const result = MockPayloadGenerator.generate(operation, {
            ViewingRoom: () => ({ status: "closed" }),
          })
          return result
        })
        await flushPromiseQueue()
      })

      expect(
        screen.getByText(
          "This viewing room is now closed. We invite you to view this gallery’s current works."
        )
      ).toBeOnTheScreen()
    })
  })
})
