import { SearchScreenQuery } from "app/Scenes/Search/Search2"
import { useState } from "react"
import { useLazyLoadQuery, useRelayEnvironment } from "react-relay"
import {
  FetchPolicy,
  fetchQuery,
  GraphQLTaggedNode,
  OperationType,
  VariablesOf,
} from "relay-runtime"

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
      fetchPolicy: "store-only",
    },
    variables,
  })

  const data = useLazyLoadQuery<TQuery>(query, queryArgs.variables, queryArgs.options)

  const refetch = (updatedVariables: VariablesOf<TQuery>) => {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)

    fetchQuery(environment, SearchScreenQuery, updatedVariables).subscribe({
      complete: () => {
        setIsRefreshing(false)

        setQueryArgs((prev) => ({
          options: {
            fetchKey: prev.options.fetchKey + 1,
            fetchPolicy: prev.options.fetchPolicy,
          },
          variables: updatedVariables,
        }))
      },
      error: () => {
        setIsRefreshing(false)
      },
    })
  }

  return { data, refetch }
}
