import { fireEvent, screen, within } from "@testing-library/react-native"
import { HomeViewSectionNavigationPillsTestsQuery } from "__generated__/HomeViewSectionNavigationPillsTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionNavigationPills } from "app/Scenes/HomeView/Sections/HomeViewSectionNavigationPills"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

// Tag every rendered SVG with a testID so icons can be found within a pill
jest.mock("react-native-svg", () => {
  const React = jest.requireActual("react")
  const actual = jest.requireActual("react-native-svg")
  const ActualSvg = actual.default
  const MockSvg = React.forwardRef((props: any, ref: any) => (
    <ActualSvg testID="svg-icon" {...props} ref={ref} />
  ))
  return { ...actual, __esModule: true, default: MockSvg, Svg: MockSvg }
})

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

    let pill

    // supported icon
    expect(screen.getByText("Follows")).toBeOnTheScreen()
    pill = screen.getByTestId("pill-Follows")
    expect(within(pill).getAllByTestId("svg-icon")).toHaveLength(1)

    // unsupported icon
    expect(screen.getByText("A new feature")).toBeOnTheScreen()
    pill = screen.getByTestId("pill-A new feature")
    expect(within(pill).queryAllByTestId("svg-icon")).toHaveLength(0)

    // missing icon
    expect(screen.getByText("Icon-less feature")).toBeOnTheScreen()
    pill = screen.getByTestId("pill-Icon-less feature")
    expect(within(pill).queryAllByTestId("svg-icon")).toHaveLength(0)

    fireEvent.press(screen.getByText("Follows"))
    expect(navigate).toHaveBeenCalledWith("/favorites")
  })
})
