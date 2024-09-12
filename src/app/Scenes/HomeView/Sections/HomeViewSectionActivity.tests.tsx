import { fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionActivityTestsQuery } from "__generated__/HomeViewSectionActivityTestsQuery.graphql"
import { HomeViewSectionActivity } from "app/Scenes/HomeView/Sections/HomeViewSectionActivity"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionActivity", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionActivityTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return <HomeViewSectionActivity section={props.homeView.section} />
    },
    query: graphql`
      query HomeViewSectionActivityTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-latest-activity") {
            ... on HomeViewSectionActivity {
              ...HomeViewSectionActivity_section
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
      HomeViewSectionActivity: () => ({
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
                targetHref: "/artwork-room/id-1",
              },
            },
            {
              node: {
                internalID: "id-2",
                notificationType: "VIEWING_ROOM_PUBLISHED",
                headline: "viewing room published",
                targetHref: "/viewing-room/id-2",
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
            "context_module": "latestActivity",
            "context_screen_owner_type": "home",
            "destination_path": "/viewing-room/id-2",
            "horizontal_slide_position": 1,
            "module_height": "single",
            "type": "thumbnail",
          },
        ]
      `)
  })
})
