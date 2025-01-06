import { useDismissTaskMutation } from "__generated__/useDismissTaskMutation.graphql"
import {
  // ConnectionHandler,
  useMutation,
  graphql,
} from "react-relay"

export const useDismissTask = () => {
  return useMutation<useDismissTaskMutation>(DismissTaskMutation)

  // optimisticResponse: {
  //   dismissTask: {
  //     taskOrError: {
  //       __typename: "DismissTaskSuccess",
  //       task: {
  //         internalID: taskID,
  //       },
  //       tasksConnection: {
  //         edges: filteredTasks.map((task) => ({ node: task })), // Provide an optimistic response
  //       },
  //     },
  //   },
  // },
  // updater: (store) => {
  //   const payload = store.getRootField("dismissTask")
  //   const taskOrError = payload?.getLinkedRecord("taskOrError")
  //   const newTasksConnection = taskOrError?.getLinkedRecord("tasksConnection")

  //   console.log("*** newTasksConnection", newTasksConnection)
  //   if (!newTasksConnection) {
  //     return
  //   }

  //   const homeViewTaskSection = store
  //     .getRoot()
  //     .getLinkedRecord("homeView")
  //     ?.getLinkedRecord("section", { id: "home-view-section-tasks" })

  //   if (!homeViewTaskSection) {
  //     return
  //   }

  //   console.log("*** homeViewTaskSection", homeViewTaskSection)
  //   const key = "HomeViewSectionTasks_tasksConnection"
  //   const tasksConnection = ConnectionHandler.getConnection(homeViewTaskSection, key)
  //   // const payload = store.getRootField("dismissTask")
  //   // const taskOrError = payload?.getLinkedRecord("taskOrError")

  //   if (tasksConnection) {
  //     // const me = store.getRoot().getLinkedRecord("viewer")
  //     // const connection =
  //     // me && ConnectionHandler.getConnection(me, "HomeViewSectionTasks_tasksConnection")
  //     if (tasksConnection) {
  //       // Update the connection with the new tasksConnection
  //       const edges = newTasksConnection.getLinkedRecords("edges")
  //       console.log("*** edges", edges)
  //       tasksConnection.setLinkedRecords(edges, "edges")
  //     }
  //   }
  // },
}

const DismissTaskMutation = graphql`
  mutation useDismissTaskMutation($taskID: String!) {
    dismissTask(input: { id: $taskID }) {
      taskOrError {
        __typename
        ... on DismissTaskSuccess {
          task {
            internalID
          }
          homeViewTasksSection {
            ...HomeViewSectionTasks_section
          }
        }

        ... on DismissTaskFailure {
          mutationError {
            error
          }
        }
      }
    }
  }
`
