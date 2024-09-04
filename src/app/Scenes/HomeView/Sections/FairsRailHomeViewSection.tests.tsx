import { screen } from "@testing-library/react-native"
import { FairsRailHomeViewSectionTestsQuery } from "__generated__/FairsRailHomeViewSectionTestsQuery.graphql"
import { FairsRailHomeViewSection } from "app/Scenes/HomeView/Sections/FairsRailHomeViewSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FairsRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<FairsRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <FairsRailHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query FairsRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-latest-auction-results") {
            ... on FairsRailHomeViewSection {
              ...FairsRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders nothing when there are no fairs", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Fairs for You",
        desriptions: "The most exciting fairs in the world",
      }),
      FairConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of fairs", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "Fairs for You",
        description: "The most exciting fairs in the world",
      }),
      FairConnection: () => ({
        edges: [
          {
            node: {
              name: "Fair 1",
            },
          },
          {
            node: {
              name: "Fair 2",
            },
          },
        ],
      }),
    })

    expect(screen.getByText("Fairs for You")).toBeOnTheScreen()
    expect(screen.getByText(/Fair 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Fair 2/)).toBeOnTheScreen()
  })
})
