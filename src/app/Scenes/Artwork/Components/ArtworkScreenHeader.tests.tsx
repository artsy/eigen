import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkScreenHeaderTestQuery } from "__generated__/ArtworkScreenHeaderTestQuery.graphql"
import { ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { goBack } from "app/system/navigation/navigate"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtworkScreenHeaderFragmentContainer } from "./ArtworkScreenHeader"

describe("ArtworkScreenHeader", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkScreenHeaderTestQuery>({
    Component: (props) => {
      if (props?.artwork) {
        return (
          <ArtworkStoreProvider>
            <ArtworkScreenHeaderFragmentContainer artwork={props.artwork} />
          </ArtworkStoreProvider>
        )
      }
      return null
    },
    query: graphql`
      query ArtworkScreenHeaderTestQuery @relay_test_operation @raw_response_type {
        artwork(id: "some-artwork") {
          ...ArtworkScreenHeader_artwork
        }
      }
    `,
  })

  it("renders the header", async () => {
    renderWithRelay({
      Artwork: () => ({
        isSaved: false,
        artists: [{ name: "test" }],
      }),
    })

    await flushPromiseQueue()

    expect(screen.queryByLabelText("Artwork page header")).toBeTruthy()
    expect(screen.queryByLabelText("Go back")).toBeTruthy()
    expect(screen.queryByLabelText("Save artwork")).toBeTruthy()
    expect(screen.queryByText("Create Alert")).toBeTruthy()
  })

  it("calls go back when the back button is pressed", async () => {
    renderWithRelay({})

    await flushPromiseQueue()

    expect(screen.queryByLabelText("Go back")).toBeTruthy()

    fireEvent.press(screen.getByLabelText("Go back"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  describe("Create alert button", () => {
    it("renders the header but not the create alert button if the artwork doesn't have an associated artist", async () => {
      renderWithRelay({
        Artwork: () => ({
          isSaved: false,
          artists: [],
        }),
      })

      await flushPromiseQueue()

      expect(screen.queryByLabelText("Go back")).toBeTruthy()
      expect(screen.queryByLabelText("Save artwork")).toBeTruthy()
      expect(screen.queryByText("Create Alert")).toBeFalsy()
    })

    it("should correctly track event when `Create Alert` button is pressed", () => {
      const { getByText } = renderWithRelay({
        Artwork: () => ({
          internalID: "internalID-1",
          slug: "slug-1",
          artists: [{ name: "some-artist-name" }],
        }),
      })

      fireEvent.press(getByText("Create Alert"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedCreateAlert",
            "context_module": "ArtworkScreenHeader",
            "context_screen_owner_id": "internalID-1",
            "context_screen_owner_slug": "slug-1",
            "context_screen_owner_type": "artwork",
          },
        ]
      `)
    })
  })

  describe("Save button", () => {
    it("should trigger save mutation when user presses save button", async () => {
      const { env } = renderWithRelay({
        Artwork: () => ({
          isSaved: false,
        }),
      })

      await flushPromiseQueue()

      expect(screen.getByLabelText("Save artwork")).toBeTruthy()

      fireEvent.press(screen.getByLabelText("Save artwork"))

      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "ArtworkScreenHeaderSaveMutation"
      )
    })

    it("should track save event when user saves and artwork successfully", async () => {
      const { env } = renderWithRelay({
        Artwork: () => ({
          isSaved: false,
        }),
      })

      await flushPromiseQueue()

      fireEvent.press(screen.getByLabelText("Save artwork"))

      resolveMostRecentRelayOperation(env, {})

      await flushPromiseQueue()

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action_name": "artworkSave",
            "action_type": "success",
            "context_module": "ArtworkActions",
          },
        ]
      `)
    })
  })
})
