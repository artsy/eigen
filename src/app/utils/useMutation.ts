import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, GraphQLTaggedNode } from "react-relay"
import { MutationParameters, SelectorStoreUpdater } from "relay-runtime"

export const useMutation = <T extends MutationParameters>({
  mutation,
  optimisticResponse,
  updater,
}: {
  mutation: GraphQLTaggedNode
  optimisticResponse?: (T["rawResponse"] extends {} ? T["rawResponse"] : never) | undefined
  updater?: SelectorStoreUpdater<T["response"]> | null | undefined
}) => {
  const relayEnvironment = getRelayEnvironment()

  const submitMutation = (props: {
    variables: T["variables"]
    rejectIf?: (res: T["response"]) => unknown
  }): Promise<T["response"]> => {
    const { variables = {}, rejectIf } = props

    return new Promise((resolve, reject) => {
      commitMutation<T>(relayEnvironment, {
        mutation,
        variables,
        updater: updater,
        optimisticResponse: optimisticResponse,
        onError: reject,
        onCompleted: (res, errors) => {
          if (errors !== null) {
            reject(errors)
            return
          }

          if (rejectIf?.(res)) {
            reject(rejectIf?.(res))
            return
          }

          resolve(res)
        },
      })
    })
  }

  return { submitMutation }
}
