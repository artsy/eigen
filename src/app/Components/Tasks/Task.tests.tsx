import { screen } from "@testing-library/react-native"
import { TaskTestQuery } from "__generated__/TaskTestQuery.graphql"
import { Task } from "app/Components/Tasks/Task"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Task Component", () => {
  const mockClearTask = jest.fn()

  it("should render without crashing", () => {
    const { renderWithRelay } = setupTestWrapper<TaskTestQuery>({
      Component: ({ me }) => {
        const task = me?.tasks?.[0]

        if (!task) {
          return null
        }

        return <Task task={task} onClearTask={mockClearTask} />
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

    renderWithRelay({ Task: () => mockTask })

    expect(screen.getByText("Test Task")).toBeOnTheScreen()
    expect(screen.getByText("Test Message")).toBeOnTheScreen()
  })
})

const mockTask = {
  imageUrl: "www.test.com/img.jpeg",
  title: "Test Task",
  message: "Test Message",
  actionLink: "www.test.com",
  actionMessage: "Test Action",
}
