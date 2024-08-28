import { screen } from "@testing-library/react-native"
import { SalesRailHomeViewSectionTestsQuery } from "__generated__/SalesRailHomeViewSectionTestsQuery.graphql"
import { SalesRailHomeViewSection } from "app/Scenes/HomeView/Sections/SalesRailHomeViewSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SalesRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<SalesRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <SalesRailHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query SalesRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-auctions") {
            ... on SalesRailHomeViewSection {
              ...SalesRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      SalesRailHomeViewSection: () => ({
        component: {
          title: "Auctions",
          behaviors: {
            viewAll: {
              href: "/auctions",
              buttonText: "Browse All Auctions",
            },
          },
        },
        salesConnection: {
          edges: [
            {
              node: {
                name: "sale 1",
              },
            },
            {
              node: {
                name: "sale 2",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Auctions")).toBeOnTheScreen()
    expect(screen.getByText("Browse All Auctions")).toBeOnTheScreen()
    expect(screen.getByText("sale 1")).toBeOnTheScreen()
    expect(screen.getByText("sale 2")).toBeOnTheScreen()
  })
})
