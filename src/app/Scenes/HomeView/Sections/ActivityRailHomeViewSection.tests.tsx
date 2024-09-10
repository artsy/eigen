import { fireEvent, screen } from "@testing-library/react-native"
import { ActivityRailHomeViewSectionTestsQuery } from "__generated__/ActivityRailHomeViewSectionTestsQuery.graphql"
import { ActivityRailHomeViewSection } from "app/Scenes/HomeView/Sections/ActivityRailHomeViewSection"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ActivityRailHomeViewSection", () => {
  const { renderWithRelay } = setupTestWrapper<ActivityRailHomeViewSectionTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <ActivityRailHomeViewSection section={props.homeView.section} />
    },
    query: graphql`
      query ActivityRailHomeViewSectionTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-latest-activity") {
            ... on ActivityRailHomeViewSection {
              ...ActivityRailHomeViewSection_section
            }
          }
        }
      }
    `,
  })

  it("is not rendered when there are no activities", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "Latest Activity",
      }),
      NotificationConnection: () => ({
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of activities", () => {
    renderWithRelay({
      ActivityRailHomeViewSection: () => ({
        internalID: "home-view-section-latest-activity",
        component: {
          title: "Latest Activity",
        },
        notificationsConnection: {
          edges: [
            {
              node: {
                internalID: "id-1",
                notificationType: "ARTWORK_ALERT",
                headline: "artwork alert",
              },
            },
            {
              node: {
                internalID: "id-2",
                notificationType: "VIEWING_ROOM_PUBLISHED",
                headline: "viewing room published",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText(/artwork alert/)).toBeOnTheScreen()
    expect(screen.getByText(/viewing room published/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/viewing room published/))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedActivityGroup",
            "context_module": "home-view-section-latest-activity",
            "context_screen_owner_type": "home",
            "destination_screen_owner_type": "vanityurlentity",
            "horizontal_slide_position": 1,
            "module_height": "single",
            "type": "thumbnail",
          },
        ]
      `)
  })
})
