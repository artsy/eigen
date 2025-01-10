import { useDismissTaskMutation } from "__generated__/useDismissTaskMutation.graphql"
import { useMutation, graphql } from "react-relay"

export const useDismissTask = () => {
  return useMutation<useDismissTaskMutation>(DismissTaskMutation)
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
