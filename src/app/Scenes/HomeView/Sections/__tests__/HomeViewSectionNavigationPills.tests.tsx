import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionNavigationPillsTestsQuery } from "__generated__/HomeViewSectionNavigationPillsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionNavigationPills } from "app/Scenes/HomeView/Sections/HomeViewSectionNavigationPills"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { RNSVGGroup } from "react-native-svg"
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

    let pill, icons

    // supported icon
    expect(screen.getByText("Follows")).toBeOnTheScreen()
    pill = screen.getByTestId("pill-Follows")
    icons = await pill.findAllByType(RNSVGGroup)
    expect(icons).toHaveLength(1)

    // unsupported icon
    expect(screen.getByText("A new feature")).toBeOnTheScreen()
    pill = screen.getByTestId("pill-A new feature")
    icons = await pill.findAllByType(RNSVGGroup)
    expect(icons).toHaveLength(0)

    // missing icon
    expect(screen.getByText("Icon-less feature")).toBeOnTheScreen()
    pill = screen.getByTestId("pill-Icon-less feature")
    icons = await pill.findAllByType(RNSVGGroup)
    expect(icons).toHaveLength(0)

    fireEvent.press(screen.getByText("Follows"))
    expect(navigate).toHaveBeenCalledWith("/favorites")
  })
})
