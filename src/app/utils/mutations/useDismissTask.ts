import { useDismissTaskMutation } from "__generated__/useDismissTaskMutation.graphql"
import { useMutation, graphql } from "react-relay"

export const useDismissTask = () => {
  return useMutation<useDismissTaskMutation>(DismissTaskMutation)
}

const DismissTaskMutation = graphql`
  mutation useDismissTaskMutation($taskID: String!) {
    dismissTask(input: { id: $taskID }) {
      homeViewTasksSection {
        ...HomeViewSectionTasks_section
      }
      taskOrError {
        __typename
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
