import { useState } from "react"
import { GraphQLTaggedNode, useLazyLoadQuery, useRelayEnvironment } from "react-relay"
import { FetchPolicy, fetchQuery, OperationType, VariablesOf } from "relay-runtime"

interface QueryOptions {
  fetchKey: number
  fetchPolicy?: FetchPolicy
}

interface QueryArgs<T> {
  options: QueryOptions
  variables: T
}

export function useSearchQuery<TQuery extends OperationType>(
  query: GraphQLTaggedNode,
  variables: VariablesOf<TQuery>
) {
  const environment = useRelayEnvironment()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [queryArgs, setQueryArgs] = useState<QueryArgs<VariablesOf<TQuery>>>({
    options: {
      fetchKey: 0,
    },
    variables,
  })

  const data = useLazyLoadQuery<TQuery>(query, queryArgs.variables, {
    ...queryArgs.options,
    networkCacheConfig: { force: false },
  })

  const refetch = (updatedVariables: VariablesOf<TQuery>) => {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)

    fetchQuery(environment, query, updatedVariables).subscribe({
      complete: () => {
        setIsRefreshing(false)

        setQueryArgs((prev) => ({
          options: {
            fetchKey: prev.options.fetchKey + 1,
            fetchPolicy: "store-only",
          },
          variables: updatedVariables,
        }))
      },
      error: () => {
        setIsRefreshing(false)
      },
    })
  }

  return { data, refetch, isLoading: isRefreshing }
}
