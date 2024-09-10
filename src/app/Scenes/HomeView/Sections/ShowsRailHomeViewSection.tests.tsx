import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ShowsRailHomeViewSectionTestsQuery } from "__generated__/ShowsRailHomeViewSectionTestsQuery.graphql"
import { ShowsRailHomeViewSection } from "app/Scenes/HomeView/Sections/ShowsRailHomeViewSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-native-community/geolocation", () => ({
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn((success, _) => {
    success({ coords: { latitude: 1, longitude: 2 } })
  }),
}))

describe("ShowsRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<ShowsRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <ShowsRailHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query ShowsRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-shows") {
            ... on ShowsRailHomeViewSection {
              ...ShowsRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    const { mockResolveLastOperation } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Shows for You",
      }),
    })

    mockResolveLastOperation({
      ShowConnection: () => ({
        edges: [
          {
            node: {
              name: "show 1",
            },
          },
          {
            node: {
              name: "show 2",
            },
          },
        ],
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("show-rail-placeholder"))

    expect(screen.getByText("Shows for You")).toBeOnTheScreen()
    expect(screen.getByText("show 1")).toBeOnTheScreen()
    expect(screen.getByText("show 2")).toBeOnTheScreen()
  })
})
