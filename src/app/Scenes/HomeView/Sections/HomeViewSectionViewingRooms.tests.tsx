import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { HomeViewSectionViewingRoomsTestsQuery } from "__generated__/HomeViewSectionViewingRoomsTestsQuery.graphql"
import { HomeViewSectionViewingRooms } from "app/Scenes/HomeView/Sections/HomeViewSectionViewingRooms"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionViewingRooms", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionViewingRoomsTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <HomeViewSectionViewingRooms section={props.homeView.section} />
    },
    query: graphql`
      query HomeViewSectionViewingRoomsTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-viewing-rooms") {
            ... on HomeViewSectionViewingRooms {
              ...HomeViewSectionViewingRooms_section
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

  it("navigates and tracks individual viewing room taps", async () => {
    const { mockResolveLastOperation } = renderWithRelay({
      HomeViewSectionViewingRooms: () => ({
        internalID: "home-view-section-viewing-rooms",
        component: {
          title: "Viewing Rooms",
          behaviors: {
            viewAll: {
              href: "/viewing-rooms",
              buttonText: "View All",
            },
          },
        },
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

    fireEvent.press(screen.getByText("viewing room 1"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedViewingRoomGroup",
          "context_module": "home-view-section-viewing-rooms",
          "context_screen_owner_type": "home",
          "destination_screen_owner_id": "one",
          "destination_screen_owner_slug": "alessandro-pessoli-ardente-primavera-number-1",
          "destination_screen_owner_type": "viewingRoom",
          "type": "thumbnail",
        },
      ]
  `)
  })
})
