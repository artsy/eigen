import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkScreenHeaderTestQuery } from "__generated__/ArtworkScreenHeaderTestQuery.graphql"
import { ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { goBack } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
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

  it("renders the header", () => {
    renderWithRelay({
      Artwork: () => ({
        artists: [{ name: "test" }],
      }),
    })

    expect(screen.queryByLabelText("Artwork page header")).toBeTruthy()
    expect(screen.queryByLabelText("Go back")).toBeTruthy()
    expect(screen.queryByText("Create Alert")).toBeTruthy()
  })

  it("calls go back when the back button is pressed", () => {
    renderWithRelay({})

    expect(screen.queryByLabelText("Go back")).toBeTruthy()

    fireEvent.press(screen.getByLabelText("Go back"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  describe("Create alert button", () => {
    it("renders the header but not the create alert button if the artwork doesn't have an associated artist", () => {
      renderWithRelay({
        Artwork: () => ({
          artists: [],
        }),
      })

      expect(screen.queryByLabelText("Go back")).toBeTruthy()
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
})
