import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { TaskTestQuery } from "__generated__/TaskTestQuery.graphql"
import { Task } from "app/Components/Tasks/Task"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockDismissTask = jest.fn()
const mockAcknowledgeTask = jest.fn()

const mockOnOpenTask = jest.fn()

jest.mock("app/utils/mutations/useDismissTask", () => ({
  useDismissTask: () => [mockDismissTask],
}))

jest.mock("app/utils/mutations/useAcknowledgeTask.ts", () => ({
  useAcknowledgeTask: () => [mockAcknowledgeTask],
}))

describe("Task Component", () => {
  const { renderWithRelay } = setupTestWrapper<TaskTestQuery>({
    Component: ({ me }) => {
      return <Task task={me!.tasks![0]!} onOpenTask={mockOnOpenTask} />
    },
    query: graphql`
      query TaskTestQuery @relay_test_operation {
        me {
          tasks {
            ...Task_task
          }
        }
      }
    `,
  })

  it("should render without crashing", () => {
    renderWithRelay({ Task: () => mockTask })

    expect(screen.getByText("Test Task")).toBeOnTheScreen()
    expect(screen.getByText("Test Message")).toBeOnTheScreen()
  })

  it("should call the onOpenTask function when swiped", async () => {
    renderWithRelay({ Task: () => mockTask })

    const taskElement = screen.getByText("Test Task") // Assuming the text is inside a parent node that handles the swipe

    fireEvent(taskElement, "onSwipeableWillOpen", { direction: "right" })

    await waitFor(() => expect(mockOnOpenTask).toHaveBeenCalled())
  })

  it("should dismiss when the task is cleared", async () => {
    renderWithRelay({ Task: () => mockTask })

    const clearButton = screen.getByText("Clear")

    fireEvent.press(clearButton)

    expect(mockDismissTask).toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedClearTask",
      context_module: "actNow",
      context_screen_owner_type: "home",
      destination_path: "www.test.com",
      task_id: "one",
      task_type: "send_wire",
    })
  })

  it("should acknowledge the task when pressed", async () => {
    renderWithRelay({ Task: () => mockTask })

    fireEvent.press(screen.getByText("Test Task"))

    await waitFor(() => expect(mockAcknowledgeTask).toHaveBeenCalled())
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedTaskGroup",
      context_module: "actNow",
      context_screen_owner_type: "home",
      destination_path: "www.test.com",
      task_id: "one",
      task_type: "send_wire",
      type: "thumbnail",
    })
  })
})

const mockTask = {
  internalID: "one",
  imageUrl: "www.test.com/img.jpeg",
  title: "Test Task",
  message: "Test Message",
  actionLink: "www.test.com",
  actionMessage: "Test Action",
  taskType: "send_wire",
}
