import { fireEvent, screen } from "@testing-library/react-native"
import { ActivityRailTestQuery } from "__generated__/ActivityRailTestQuery.graphql"
import { ActivityRail } from "app/Scenes/HomeView/Components/ActivityRail"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ActivityRail", () => {
  const { renderWithRelay } = setupTestWrapper<ActivityRailTestQuery>({
    Component: ({ viewer }) => {
      return <ActivityRail title="Latest Activity Rail" viewer={viewer!} />
    },
    query: graphql`
      query ActivityRailTestQuery @relay_test_operation {
        viewer {
          ...ActivityRail_viewer
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({
      Viewer: () => ({
        notificationsConnection: {
          edges: [{ node: { internalID: "id-1", notificationType: "ARTWORK_ALERT" } }],
        },
      }),
    })

    expect(screen.getByText("Latest Activity Rail")).toBeOnTheScreen()
    expect(screen.getByText(/mock-value-for-field-"headline"/)).toBeOnTheScreen()
  })

  it("handles header press", () => {
    renderWithRelay({
      Viewer: () => ({
        notificationsConnection: {
          edges: [{ node: { internalID: "id-1", notificationType: "ARTWORK_ALERT" } }],
        },
      }),
    })

    fireEvent.press(screen.getByText("Latest Activity Rail"))

    expect(navigate).toHaveBeenCalledWith("/notifications")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedActivityGroup",
      context_module: "activityRail",
      context_screen_owner_id: undefined,
      context_screen_owner_slug: undefined,
      context_screen_owner_type: "home",
      destination_screen_owner_id: undefined,
      destination_screen_owner_slug: undefined,
      destination_screen_owner_type: "activities",
      horizontal_slide_position: undefined,
      module_height: undefined,
      type: "header",
    })
  })

  it("handles See All press", () => {
    renderWithRelay({
      Viewer: () => ({
        notificationsConnection: {
          edges: [{ node: { internalID: "id-1", notificationType: "ARTWORK_ALERT" } }],
        },
      }),
    })

    fireEvent.press(screen.getByText("See All"))

    expect(navigate).toHaveBeenCalledWith("/notifications")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedActivityGroup",
      context_module: "activityRail",
      context_screen_owner_id: undefined,
      context_screen_owner_slug: undefined,
      context_screen_owner_type: "home",
      destination_screen_owner_id: undefined,
      destination_screen_owner_slug: undefined,
      destination_screen_owner_type: "activities",
      horizontal_slide_position: undefined,
      module_height: undefined,
      type: "viewAll",
    })
  })

  it("handles item press", () => {
    renderWithRelay({
      Viewer: () => ({
        notificationsConnection: {
          edges: [{ node: { internalID: "id-1", notificationType: "ARTWORK_ALERT" } }],
        },
      }),
    })
    ;(navigate as jest.Mock).mockClear()

    fireEvent.press(screen.getByText(/mock-value-for-field-"headline"/))

    expect(navigate).toHaveBeenCalledWith("/notification/id-1")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedActivityGroup",
      context_module: "activityRail",
      context_screen_owner_type: "home",
      destination_screen_owner_type: "vanityurlentity",
      horizontal_slide_position: 0,
      module_height: "single",
      type: "thumbnail",
    })
  })

  describe("when there are no notifications", () => {
    it("does not render", () => {
      renderWithRelay({
        Viewer: () => ({
          notificationsConnection: { edges: [] },
        }),
      })

      expect(screen.queryByText("Latest Activity Rail")).not.toBeOnTheScreen()
    })
  })
})
