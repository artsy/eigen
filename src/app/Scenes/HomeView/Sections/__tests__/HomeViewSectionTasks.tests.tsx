import { fireEvent, screen, waitFor, within } from "@testing-library/react-native"
import { HomeViewSectionTasksTestsQuery } from "__generated__/HomeViewSectionTasksTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionTasks } from "app/Scenes/HomeView/Sections/HomeViewSectionTasks"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ReactTestInstance } from "react-test-renderer"

const swipeTaskOpen = async (task: ReactTestInstance) => {
  fireEvent(task, "onSwipeableWillOpen", { direction: "right" })
}

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

    fireEvent.press(screen.getByText("Show All"))

    expect(screen.getByText("Task 1")).toBeOnTheScreen()
    expect(screen.getByText("Task 2")).toBeOnTheScreen()
    expect(screen.getByText("Task Message 2")).toBeOnTheScreen()

    expect(screen.getByText("Show Less")).toBeOnTheScreen()
  })

  it("shouldn't render Show All button when there is only one task", () => {
    renderWithRelay({
      HomeViewSectionTasks: () => ({
        internalID: "home-view-section-recommended-tasks",
        component: {
          title: "Act Now",
        },
        tasksConnection: {
          edges: [
            {
              node: {
                actionLink: "/test-link",
                actionMessage: "View",
                imageUrl: "https://d2v80f5yrouhh2.cloudfront.net/1/1.jpg",
                message: "Task Message 1",
                title: "Task 1",
                taskType: "send_wire",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Act Now")).toBeOnTheScreen()
    expect(screen.getByText("Task 1")).toBeOnTheScreen()
    expect(screen.getByText("Task Message 1")).toBeOnTheScreen()
    expect(screen.queryByText("Show All")).not.toBeOnTheScreen()
  })

  it("navigates and tracks when tapping a task", async () => {
    const { mockResolveLastOperation } = renderWithRelay({
      HomeViewSectionTasks: () => ({
        internalID: "home-view-section-recommended-tasks",
        component: {
          title: "Act Now",
        },
        tasksConnection: mockTasks,
      }),
    })

    fireEvent.press(screen.getByText("Show All"))
    fireEvent.press(screen.getByText("Task 1"))

    await waitFor(() => {
      // mock reslove the mutation
      mockResolveLastOperation({})
    })

    expect(navigate).toHaveBeenCalledWith("/test-link")
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedTaskGroup",
          "context_module": "actNow",
          "context_screen_owner_type": "home",
          "destination_path": "/test-link",
          "task_id": "1",
          "task_type": "send_wire",
          "type": "thumbnail",
        },
      ]
    `)
  })

  it("clears and tracks when clearing a task", async () => {
    const { mockResolveLastOperation } = renderWithRelay({
      HomeViewSectionTasks: () => ({
        internalID: "home-view-section-recommended-tasks",
        component: {
          title: "Act Now",
        },
        tasksConnection: mockTasks,
      }),
    })

    expect(screen.getByText("Task 1")).toBeOnTheScreen()
    expect(screen.getByText("Task 2")).toBeOnTheScreen()
    const task1 = screen.getByTestId("user-task-1")
    swipeTaskOpen(task1)

    // Tap Clear on the first task
    fireEvent.press(within(task1).getByText("Clear"))

    await waitFor(() => {
      // mock reslove the mutation
      mockResolveLastOperation({})
    })

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "tappedClearTask",
          "context_module": "actNow",
          "context_screen_owner_type": "home",
          "destination_path": "/test-link",
          "task_id": "1",
          "task_type": "send_wire",
        },
      ]
    `)

    await waitFor(() => {
      expect(screen.queryByTestId("user-task-1")).not.toBeOnTheScreen()
    })
  })

  it("closes open tasks when collapsing the section", async () => {
    renderWithRelay({
      HomeViewSectionTasks: () => ({
        internalID: "home-view-section-recommended-tasks",
        component: {
          title: "Act Now",
        },
        tasksConnection: mockTasks,
      }),
    })

    fireEvent.press(screen.getByText("Show All"))
    const task2 = screen.getByTestId("user-task-2")

    await swipeTaskOpen(task2)

    await waitFor(() => {
      within(task2).getByText("Clear")
    })

    fireEvent.press(screen.getByText("Show Less"))

    await waitFor(() => {
      expect(() => screen.getByText("Clear")).toThrow()
    })
  })
})

const mockTasks = {
  edges: [
    {
      node: {
        actionLink: "/test-link",
        internalID: "1",
        actionMessage: "View",
        imageUrl: "https://d2v80f5yrouhh2.cloudfront.net/1/1.jpg",
        message: "Task Message 1",
        title: "Task 1",
        taskType: "send_wire",
      },
    },
    {
      node: {
        internalID: "2",
        actionLink: "/test-link2",
        actionMessage: "View",
        imageUrl: "https://d2v80f5yrouhh2.cloudfront.net/2/2.jpg",
        message: "Task Message 2",
        title: "Task 2",
      },
    },
  ],
}
