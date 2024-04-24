import {
  useCreateOrderMutation,
  useCreateOrderMutation$data,
  CommerceCreateOrderWithArtworkInput,
} from "__generated__/useCreateOrderMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useCreateOrder = () => {
  const [commit] = useMutation<useCreateOrderMutation>(MUTATION)

  const commitMutation = (input: CommerceCreateOrderWithArtworkInput) => {
    return new Promise<useCreateOrderMutation$data>((resolve, reject) => {
      commit({
        variables: { input },
        onCompleted(response) {
          resolve(response)
        },
        onError(e) {
          reject(e)
        },
      })
    })
  }

  return { commitMutation }
}

const MUTATION = graphql`
  mutation useCreateOrderMutation($input: CommerceCreateOrderWithArtworkInput!) {
    commerceCreateOrderWithArtwork(input: $input) {
      orderOrError {
        __typename
        ... on CommerceOrderWithMutationSuccess {
          order {
            internalID
            mode
          }
        }
        ... on CommerceOrderWithMutationFailure {
          error {
            type
            code
            data
          }
        }
      }
    }
  }
`
