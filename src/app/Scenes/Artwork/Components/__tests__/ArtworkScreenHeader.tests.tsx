import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkScreenHeaderTestQuery } from "__generated__/ArtworkScreenHeaderTestQuery.graphql"
import { ArtworkStoreProvider } from "app/Scenes/Artwork/ArtworkStore"
import { ArtworkScreenNavHeader } from "app/Scenes/Artwork/Components/ArtworkScreenNavHeader"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkScreenHeader", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkScreenHeaderTestQuery>({
    Component: (props) => {
      if (props?.artwork) {
        return (
          <ArtworkStoreProvider>
            <ArtworkScreenNavHeader artwork={props.artwork} />
          </ArtworkStoreProvider>
        )
      }
      return null
    },
    query: graphql`
      query ArtworkScreenHeaderTestQuery @relay_test_operation @raw_response_type {
        artwork(id: "some-artwork") {
          ...ArtworkScreenNavHeader_artwork
        }
      }
    `,
  })

  it("renders the header", () => {
    renderWithRelay({
      Artwork: () => ({
        isEligibleToCreateAlert: true,
      }),
    })

    expect(screen.getByLabelText("Artwork page header")).toBeTruthy()
    expect(screen.getByText("Create Alert")).toBeTruthy()
  })

  describe("Create alert button", () => {
    it("renders the header but not the create alert button if the artwork isn't eligible", () => {
      renderWithRelay({
        Artwork: () => ({
          isEligibleToCreateAlert: false,
        }),
      })

      expect(screen.queryByText("Create Alert")).toBeFalsy()
    })

    it("should correctly track event when `Create Alert` button is pressed", () => {
      renderWithRelay({
        Artwork: () => ({
          internalID: "internalID-1",
          slug: "slug-1",
          isEligibleToCreateAlert: true,
        }),
      })

      fireEvent.press(screen.getByText("Create Alert"))

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
