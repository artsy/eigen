import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ViewingRoomsRailHomeViewSectionTestsQuery } from "__generated__/ViewingRoomsRailHomeViewSectionTestsQuery.graphql"
import { ViewingRoomsRailHomeViewSection } from "app/Scenes/HomeView/Sections/ViewingRoomsRailHomeViewSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ViewingRoomsRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<ViewingRoomsRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <ViewingRoomsRailHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query ViewingRoomsRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-viewing-rooms") {
            ... on ViewingRoomsRailHomeViewSection {
              ...ViewingRoomsRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    const { mockResolveLastOperation } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Viewing Rooms",
      }),
    })

    expect(screen.getByText("Viewing Rooms")).toBeOnTheScreen()

    mockResolveLastOperation({
      ViewingRoomConnection: () => ({
        edges: [
          {
            node: {
              title: "viewing room 1",
              href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
              slug: "alessandro-pessoli-ardente-primavera-number-1",
              internalID: "one",
            },
          },
          {
            node: {
              title: "viewing room 2",
              href: "/viewing-room/zero-dot-dot-dot-alessandro-pessoli/alessandro-pessoli-ardente-primavera-number-1",
              slug: "alessand-pessoli-ardente-primavera-number-1",
              internalID: "two",
            },
          },
        ],
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("viewing-room-rail-placeholder"))

    expect(screen.getByText("viewing room 1")).toBeOnTheScreen()
    expect(screen.getByText("viewing room 2")).toBeOnTheScreen()
  })
})
