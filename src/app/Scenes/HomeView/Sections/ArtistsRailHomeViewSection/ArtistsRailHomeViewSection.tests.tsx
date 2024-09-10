import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistsRailHomeViewSectionTestsQuery } from "__generated__/ArtistsRailHomeViewSectionTestsQuery.graphql"
import { ArtistsRailHomeViewSectionPaginationContainer } from "app/Scenes/HomeView/Sections/ArtistsRailHomeViewSection/ArtistsRailHomeViewSection"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistsRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistsRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <ArtistsRailHomeViewSectionPaginationContainer section={props.homeView.section} />
    },
    query: graphql`
      query ArtistsRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-recommended-artists") {
            ... on ArtistsRailHomeViewSection {
              ...ArtistsRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders nothing when no artists are available", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Recommended Artists",
      }),

      ArtistConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of artists", () => {
    renderWithRelay({
      ArtistsRailHomeViewSection: () => ({
        internalID: "home-view-section-recommended-artists",
        component: {
          title: "Recommended Artists",
        },
        artistsConnection: {
          edges: [
            {
              node: {
                internalID: "artist-1-id",
                slug: "artist-1-slug",
                name: "Artist 1",
                href: "/artist-1-href",
              },
            },
            {
              node: {
                internalID: "artist-2-id",
                slug: "artist-2-slug",
                name: "Artist 2",
                href: "/artist-2-href",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Recommended Artists")).toBeOnTheScreen()
    expect(screen.getByText(/Artist 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Artist 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Artist 2/))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedArtistGroup",
            "context_module": "home-view-section-recommended-artists",
            "context_screen_owner_id": undefined,
            "context_screen_owner_slug": undefined,
            "context_screen_owner_type": "home",
            "destination_screen_owner_id": "artist-2-id",
            "destination_screen_owner_slug": "artist-2-slug",
            "destination_screen_owner_type": "artist",
            "horizontal_slide_position": 1,
            "module_height": "double",
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/artist-2-href")
  })
})
