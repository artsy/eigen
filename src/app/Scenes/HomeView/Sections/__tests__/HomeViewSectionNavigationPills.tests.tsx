import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionNavigationPillsTestsQuery } from "__generated__/HomeViewSectionNavigationPillsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import {
  HomeViewSectionNavigationPills,
  NAVIGATION_LINKS_PLACEHOLDER,
} from "app/Scenes/HomeView/Sections/HomeViewSectionNavigationPills"
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
        navigationPills: NAVIGATION_LINKS_PLACEHOLDER,
      }),
    })

    NAVIGATION_LINKS_PLACEHOLDER.forEach((pill) => {
      expect(screen.getByText(pill.title)).toBeOnTheScreen()
    })
    fireEvent.press(screen.getByText(NAVIGATION_LINKS_PLACEHOLDER[0].title))
    expect(navigate).toHaveBeenCalledWith(NAVIGATION_LINKS_PLACEHOLDER[0].href)
  })
})
