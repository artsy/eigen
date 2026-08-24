import { fireEvent, screen } from "@testing-library/react-native"
import { EventArtworkRailTestsQuery } from "__generated__/EventArtworkRailTestsQuery.graphql"
import { EventArtworkRail } from "app/Scenes/City/Components/Event/EventArtworkRail"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("EventArtworkRail", () => {
  const { renderWithRelay } = setupTestWrapper<EventArtworkRailTestsQuery>({
    Component: ({ show }) => (show ? <EventArtworkRail show={show} /> : null),
    query: graphql`
      query EventArtworkRailTestsQuery @relay_test_operation {
        show(id: "the-show-id") {
          ...EventArtworkRail_show
        }
      }
    `,
  })

  it("renders artworks from the show", () => {
    renderWithRelay({
      Show: () => ({
        artworksConnection: {
          edges: [
            {
              node: {
                artistNames: "Pacita Abad",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Pacita Abad")).toBeTruthy()
  })

  it("tracks taps on artworks in the rail", () => {
    renderWithRelay({
      Show: () => ({
        internalID: "show-id",
        slug: "some-show",
        artworksConnection: {
          edges: [
            {
              node: {
                internalID: "artwork1234",
                slug: "cool-artwork-1",
                collectorSignals: null,
              },
            },
          ],
        },
      }),
    })

    fireEvent.press(screen.getByTestId("artwork-cool-artwork-1"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedArtworkGroup",
        context_module: "otherWorksFromShowRail",
        context_screen_owner_type: "show",
        context_screen_owner_id: "show-id",
        context_screen_owner_slug: "some-show",
        destination_screen_owner_id: "artwork1234",
        destination_screen_owner_slug: "cool-artwork-1",
        destination_screen_owner_type: "artwork",
        type: "thumbnail",
      })
    )
  })
})
