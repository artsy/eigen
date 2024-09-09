import { fireEvent, screen } from "@testing-library/react-native"
import { GalleriesHomeViewSectionTestsQuery } from "__generated__/GalleriesHomeViewSectionTestsQuery.graphql"
import { GalleriesHomeViewSection } from "app/Scenes/HomeView/Sections/GalleriesHomeViewSection"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("GalleriesHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<GalleriesHomeViewSectionTestsQuery>({
    Component: (props) => {
      return <GalleriesHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query GalleriesHomeViewSectionTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-galleries-near-you") @required(action: NONE) {
            ... on GalleriesHomeViewSection {
              ...GalleriesHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      GalleriesHomeViewSection: () => ({
        internalID: "home-view-section-galleries-near-you",
        component: {
          title: "Galleries Near You",
          backgroundImageURL: "https://url.com/image.jpg",
          description: "Follow these local galleries for updates on artists you love.",
          behaviors: {
            viewAll: {
              href: "/galleries-for-you",
            },
          },
        },
      }),
    })

    expect(screen.getByText("Galleries Near You")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Explore"))
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedShowMore",
          "context_module": "home-view-section-galleries-near-you",
          "context_screen_owner_type": "home",
          "destination_screen_owner_type": "galleriesForYou",
        },
      ]
    `)
    expect(navigate).toHaveBeenCalledWith("/galleries-for-you")
  })
})
