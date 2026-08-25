import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideEventArtworkRailTestsQuery } from "__generated__/CityGuideEventArtworkRailTestsQuery.graphql"
import { CityGuideEventArtworkRail } from "app/Scenes/CityGuide/Components/CityGuideEventArtworkRail"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("CityGuideEventArtworkRail", () => {
  const { renderWithRelay } = setupTestWrapper<CityGuideEventArtworkRailTestsQuery>({
    Component: ({ show }) => (show ? <CityGuideEventArtworkRail show={show} /> : null),
    query: graphql`
      query CityGuideEventArtworkRailTestsQuery @relay_test_operation {
        show(id: "the-show-id") {
          ...CityGuideEventArtworkRail_show
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
