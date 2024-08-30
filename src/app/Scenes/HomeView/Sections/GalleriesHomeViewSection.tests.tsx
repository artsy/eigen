import { fireEvent, screen } from "@testing-library/react-native"
import { GalleriesHomeViewSectionTestsQuery } from "__generated__/GalleriesHomeViewSectionTestsQuery.graphql"
import { GalleriesHomeViewSection } from "app/Scenes/HomeView/Sections/GalleriesHomeViewSection"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("GalleriesHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<GalleriesHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <GalleriesHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query GalleriesHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-galleries-near-you") {
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
      HomeViewComponent: () => ({
        title: "Galleries Near You",
        href: "/galleries-for-you",
        backgroundImageURL: "https://url.com/image.jpg",
        description: "Follow these local galleries for updates on artists you love.",
        behaviors: {
          viewAll: {
            href: "/galleries-for-you",
            buttonText: "Explore",
          },
        },
      }),
    })

    expect(screen.getByText("Galleries Near You")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Explore"))
    expect(navigate).toHaveBeenCalledWith("/galleries-for-you")
  })
})
