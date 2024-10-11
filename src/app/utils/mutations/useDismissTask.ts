import { useDismissTaskMutation } from "__generated__/useDismissTaskMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { graphql } from "react-relay"

export const useDismissTask = () => {
  return useMutation<useDismissTaskMutation>({
    mutation: DismissTaskMutation,
  })
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
