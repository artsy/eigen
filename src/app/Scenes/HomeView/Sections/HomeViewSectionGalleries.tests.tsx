import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionGalleriesTestsQuery } from "__generated__/HomeViewSectionGalleriesTestsQuery.graphql"
import { HomeViewSectionGalleries } from "app/Scenes/HomeView/Sections/HomeViewSectionGalleries"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionGalleries", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionGalleriesTestsQuery>({
    Component: (props) => {
      return <HomeViewSectionGalleries section={props.homeView.section} />
    },
    query: graphql`
      query HomeViewSectionGalleriesTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-galleries-near-you") @required(action: NONE) {
            ... on HomeViewSectionGalleries {
              ...HomeViewSectionGalleries_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      HomeViewSectionGalleries: () => ({
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
          "context_module": "<mock-value-for-field-"contextModule">",
          "context_screen_owner_type": "home",
          "subject": "Explore",
        },
      ]
    `)
    expect(navigate).toHaveBeenCalledWith("/galleries-for-you")
  })
})
