import { useDismissTaskMutation } from "__generated__/useDismissTaskMutation.graphql"
import { ConnectionHandler, graphql, useMutation, UseMutationConfig } from "react-relay"

type MutationConfig = UseMutationConfig<useDismissTaskMutation>
type MutationResult = [(config: MutationConfig) => void, boolean]

export const useDismissTask = (taskID: string): MutationResult => {
  const [initialCommit, isInProgress] = useMutation<useDismissTaskMutation>(DismissTaskMutation)

  const commit = (config: MutationConfig) => {
    return initialCommit({
      ...config,
      updater: (store, data) => {
        const response = data.dismissTask?.taskOrError
        const homeViewTaskSection = store
          .getRoot()
          .getLinkedRecord("homeView")
          ?.getLinkedRecord("section", { id: "home-view-section-tasks" })

        if (!homeViewTaskSection || !response) {
          return
        }

        const task = store.get(taskID)
        const key = "HomeViewSectionTasks_tasks"
        const tasksConnection = ConnectionHandler.getConnection(homeViewTaskSection, key)
        const mutationPayload = store.getRootField("dismissTask")
        const taskOrError = mutationPayload?.getLinkedRecord("taskOrError")
        const taskDismissed = taskOrError?.getLinkedRecord("task")

        if (!tasksConnection || !task || !taskDismissed) {
          return
        }

        if (!!taskDismissed) {
          ConnectionHandler.deleteNode(tasksConnection, taskID)
        }
      },
    })
  }

  return [commit, isInProgress]
}

const DismissTaskMutation = graphql`
  mutation useDismissTaskMutation($taskID: String!) {
    dismissTask(input: { id: $taskID }) {
      taskOrError {
        ... on DismissTaskSuccess {
          task {
            internalID
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
