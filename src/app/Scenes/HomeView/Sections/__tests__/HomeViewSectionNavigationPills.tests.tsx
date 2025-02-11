import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionNavigationPillsTestsQuery } from "__generated__/HomeViewSectionNavigationPillsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionNavigationPills } from "app/Scenes/HomeView/Sections/HomeViewSectionNavigationPills"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionNavigationPills", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionNavigationPillsTestsQuery>({
    Component: (props) => {
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionNavigationPills section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionNavigationPillsTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-quick-links") @required(action: NONE) {
            ... on HomeViewSectionNavigationPills {
              ...HomeViewSectionNavigationPills_section
            }
          }
        }
      }
    `,
  })

  it("renders the section pills properly", async () => {
    renderWithRelay({
      HomeViewSectionNavigationPills: () => ({
        navigationPills: [
          {
            icon: "FollowArtistIcon",
            title: "Follows",
            href: "/favorites",
            ownerType: "follows",
          },
          {
            icon: "NewAndUnsupportedIcon",
            title: "A new feature",
            href: "/new-feature",
            ownerType: "new-feature",
          },
          {
            icon: null,
            title: "Icon-less feature",
            href: "/iconless-feature",
            ownerType: "iconless-feature",
          },
        ],
      }),
    })

    expect(screen.getByText("Follows")).toBeOnTheScreen()
    expect(screen.getByTestId("pill-icon-FollowArtistIcon")).toBeOnTheScreen()

    expect(screen.getByText("A new feature")).toBeOnTheScreen()
    expect(screen.queryByTestId("pill-icon-NewAndUnsupportedIcon")).not.toBeOnTheScreen()

    expect(screen.getByText("Icon-less feature")).toBeOnTheScreen()

    // missing and unsupported icons should not be rendered
    expect(screen.queryAllByTestId(/pill-icon-/)).toHaveLength(1)

    fireEvent.press(screen.getByText("Follows"))
    expect(navigate).toHaveBeenCalledWith("/favorites")
  })
})
