import { useAcknowledgeTaskMutation } from "__generated__/useAcknowledgeTaskMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { graphql } from "react-relay"

export const useAcknowledgeTask = () => {
  return useMutation<useAcknowledgeTaskMutation>({
    mutation: AcknowledgeTaskMutation,
  })
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
