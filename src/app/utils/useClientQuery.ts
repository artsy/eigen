import { useUpdateEffect } from "app/utils/useUpdateEffect"
import { useEffect, useRef, useState } from "react"
import { Environment, fetchQuery, GraphQLTaggedNode, useRelayEnvironment } from "react-relay"
import { CacheConfig, FetchQueryFetchPolicy, OperationType } from "relay-runtime"

/**
 * A more functional version of `fetchQuery`.
 *
 * Note! The data returned from this hook can be garbage collected at any time
 * so you might need to call `retain` on it.
 *
 * @see https://relay.dev/docs/api-reference/fetch-query/#behavior
 */

export const useClientQuery = <T extends OperationType>({
  environment,
  query,
  variables = {},
  cacheConfig = {},
  skip = false,
}: {
  environment?: Environment
  query: GraphQLTaggedNode
  variables?: T["variables"]
  cacheConfig?: {
    networkCacheConfig?: CacheConfig | null | undefined
    fetchPolicy?: FetchQueryFetchPolicy | null | undefined
  } | null
  skip?: boolean
}) => {
  const relayEnvironment = useRelayEnvironment()

  const [data, setData] = useState<T["response"] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  const key = useRef(JSON.stringify(variables))
  const prevKey = useRef(key.current)

  useUpdateEffect(() => {
    key.current = JSON.stringify(variables)
  }, [variables])

  useEffect(() => {
    if (key.current !== prevKey.current) {
      setData(null)
      setError(null)
      setLoading(true)

      prevKey.current = key.current
    }

    if (skip || data || error) return

    const exec = async () => {
      try {
        const res = await fetchQuery<T>(
          environment || relayEnvironment,
          query,
          variables,
          cacheConfig
        ).toPromise()

        setData(res)
        setLoading(false)
      } catch (err) {
        setError(err as any)
        setLoading(false)
      }
    }

    exec()

    // https://github.com/facebook/react/issues/25149
    // Excludes `T`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, query, relayEnvironment, variables])

  return { data, error, loading: skip ? false : loading }
}
