import { useAcknowledgeTaskMutation } from "__generated__/useAcknowledgeTaskMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useAcknowledgeTask = () => {
  return useMutation<useAcknowledgeTaskMutation>(AcknowledgeTaskMutation)
}

const AcknowledgeTaskMutation = graphql`
  mutation useAcknowledgeTaskMutation($taskID: String!) {
    ackTask(input: { id: $taskID }) {
      homeViewTasksSection {
        ...HomeViewSectionTasks_section
      }
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
