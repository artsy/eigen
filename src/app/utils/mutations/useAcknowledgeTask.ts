import { useAcknowledgeTaskMutation } from "__generated__/useAcknowledgeTaskMutation.graphql"
import { ConnectionHandler, graphql, useMutation, UseMutationConfig } from "react-relay"

type MutationConfig = UseMutationConfig<useAcknowledgeTaskMutation>
type MutationResult = [(config: MutationConfig) => void, boolean]

export const useAcknowledgeTask = (taskID: string): MutationResult => {
  const [initialCommit, isInProgress] =
    useMutation<useAcknowledgeTaskMutation>(AcknowledgeTaskMutation)

  const commit = (config: MutationConfig) => {
    return initialCommit({
      ...config,
      updater: (store, data) => {
        const response = data.ackTask?.taskOrError
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
        const mutationPayload = store.getRootField("ackTask")
        const taskOrError = mutationPayload?.getLinkedRecord("taskOrError")
        const taskAcknowledged = taskOrError?.getLinkedRecord("task")

        if (!tasksConnection || !task || !taskAcknowledged) {
          return
        }

        if (!!taskAcknowledged) {
          ConnectionHandler.deleteNode(tasksConnection, taskID)
        }
      },
    })
  }

  return [commit, isInProgress]
}

const AcknowledgeTaskMutation = graphql`
  mutation useAcknowledgeTaskMutation($taskID: String!) {
    ackTask(input: { id: $taskID }) {
      taskOrError {
        ... on AckTaskSuccess {
          task {
            internalID
          }
        }

        ... on AckTaskFailure {
          mutationError {
            error
          }
        }
      }
    }
  }
`
