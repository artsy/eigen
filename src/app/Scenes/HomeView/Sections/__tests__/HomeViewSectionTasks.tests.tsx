import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { HomeViewSectionTasksTestsQuery } from "__generated__/HomeViewSectionTasksTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionTasks } from "app/Scenes/HomeView/Sections/HomeViewSectionTasks"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("HomeViewSectionTasks", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionTasksTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionTasks section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionTasksTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-tasks") {
            ... on HomeViewSectionTasks {
              ...HomeViewSectionTasks_section
            }
          }
        }
      }
    `,
  })

  it("renders the section properly", async () => {
    renderWithRelay({
      HomeViewSectionTasks: () => ({
        internalID: "home-view-section-recommended-tasks",
        component: {
          title: "Act Now",
        },
        tasksConnection: mockTasks,
      }),
    })

    expect(screen.getByText("Act Now")).toBeOnTheScreen()

    expect(screen.getByText("Task 1")).toBeOnTheScreen()
    expect(screen.getByText("Task Message 1")).toBeOnTheScreen()
  })

  it("navigates and tracks when tapping a task", async () => {
    renderWithRelay({
      HomeViewSectionTasks: () => ({
        internalID: "home-view-section-recommended-tasks",
        component: {
          title: "Act Now",
        },
        tasksConnection: mockTasks,
      }),
    })

    fireEvent.press(screen.getByText("Task 1"))

    expect(navigate).toHaveBeenCalledWith("/test-link")
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedNotification",
          "context_module": "actNow",
          "context_screen_owner_type": "home",
          "destination_path": "/test-link",
          "notification_category": "send_wire",
          "notification_id": "one",
        },
      ]
    `)
  })

  it("clears and tracks when clearing a dask", async () => {
    renderWithRelay({
      HomeViewSectionTasks: () => ({
        internalID: "home-view-section-recommended-tasks",
        component: {
          title: "Act Now",
        },
        tasksConnection: mockTasks,
      }),
    })

    fireEvent.press(screen.getByText("Clear"))

    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeOnTheScreen()
    })

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedClearNotification",
          "context_module": "actNow",
          "context_screen_owner_type": "home",
          "destination_path": "/test-link",
          "notification_category": "send_wire",
          "notification_id": "one",
        },
      ]
    `)
  })
})

const mockTasks = {
  edges: [
    {
      node: {
        actionLink: "/test-link",
        actionMessage: "View",
        imageUrl: "https://d2v80f5yrouhh2.cloudfront.net/1/1.jpg",
        internalID: "one",
        message: "Task Message 1",
        title: "Task 1",
        taskType: "send_wire",
      },
    },
  ],
}
