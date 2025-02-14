import { Disposable, UseMutationConfig } from "react-relay"
import { MutationParameters } from "relay-runtime"

export function usePromisedMutation<T extends MutationParameters>(
  useMutation: () => [(config: UseMutationConfig<T>) => Disposable, boolean]
): [(args: UseMutationConfig<T>) => Promise<T["response"]>, boolean] {
  const [commit, isInFlight] = useMutation()

  return [
    async (args: UseMutationConfig<T>) => {
      return await new Promise((resolve, reject) => {
        commit({
          ...args,
          onCompleted: (response, errors) => {
            if (errors) {
              reject(errors)
            }
            resolve(response)
          },
          onError: (error) => reject(error),
        })
      })
    },
    isInFlight,
  ]
}
