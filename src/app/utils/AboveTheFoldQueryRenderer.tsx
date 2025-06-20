import React, { useEffect, useMemo, useState } from "react"
import { QueryRenderer, Environment, GraphQLTaggedNode } from "react-relay"
import { CacheConfig, FetchPolicy, OperationType } from "relay-runtime"
import { MockEnvironment } from "relay-test-utils"
import { FallbackRenderer, renderWithPlaceholder } from "./renderWithPlaceholder"

interface AboveTheFoldQueryRendererProps<
  AboveQuery extends OperationType,
  BelowQuery extends OperationType,
> {
  environment: Environment | MockEnvironment
  above: {
    query: GraphQLTaggedNode
    variables: AboveQuery["variables"]
  }
  below: {
    query: GraphQLTaggedNode
    variables: BelowQuery["variables"]
  }
  render:
    | ((
        args: RenderArgs<{ above: AboveQuery["response"]; below: BelowQuery["response"] }>
      ) => React.ReactChild)
    // convenience option for using `renderWithPlaceholder` logic without too much boilerplate
    | {
        renderComponent: (args: {
          above: AboveQuery["response"]
          below: BelowQuery["response"] | null
        }) => React.ReactChild
        renderPlaceholder: () => React.ReactChild
      }
  fallback?: FallbackRenderer
  cacheConfig?: CacheConfig | null
  fetchPolicy?: FetchPolicy
  /** Fire below-the-fold query after the given timeout or when the above-the-fold query returns. */
  /** If 'belowTheFoldTimeout' is not set, the below-the-fold query will be fired when the above-the-fold query returns */
  belowTheFoldTimeout?: number
}

interface RenderArgs<Response> {
  props: Response | null
  error: Error | null
  retry: (() => void) | null
}

/**
 * Just like a normal QueryRenderer except that it takes two sets of (query+variables) and fetches
 * them sequentially. use for fetching 'above-the-fold' content first and 'below-the-fold' content later
 * in cases where the 'below-the-fold' content adds significant time to the query duration.
 * @param props
 */
export function AboveTheFoldQueryRenderer<
  AboveQuery extends OperationType,
  BelowQuery extends OperationType,
>(props: AboveTheFoldQueryRendererProps<AboveQuery, BelowQuery>) {
  const [aboveArgs, setAboveArgs] = useState<null | RenderArgs<AboveQuery["response"]>>(null)
  const [belowArgs, setBelowArgs] = useState<null | RenderArgs<BelowQuery["response"]>>(null)
  // We want to debounce the initial render in case there is a cache hit for both queries
  // If we didn't debounce we'd end up calling render twice in quick succession, once without below-the-fold data and then again with
  // That would create a some nasy jank
  const [hasFinishedDebouncing, setHasFinishedDebouncing] = useState(__TEST__)
  useEffect(() => {
    if (!__TEST__) {
      setTimeout(() => setHasFinishedDebouncing(true), 30)
    }
  }, [])

  // we should call render if we have all above the data already
  // we should also call render if we are no longer waiting for a debounce
  const shouldCallRender = aboveArgs?.props || hasFinishedDebouncing

  const render = useMemo(
    () =>
      typeof props.render === "function"
        ? props.render
        : renderWithPlaceholder({
            renderPlaceholder: props.render.renderPlaceholder,
            render: props.render.renderComponent,
            renderFallback: ({ retry }) =>
              props.fallback ? <props.fallback retry={retry} error={error ?? undefined} /> : null,
          }),
    [props.render]
  )

  const error = aboveArgs?.error || belowArgs?.error || null

  const retry = () => {
    aboveArgs?.retry?.()
    belowArgs?.retry?.()
  }

  const [renderBelowTheFold, setRenderBelowTheFold] = useState(false)

  useEffect(() => {
    if (props.belowTheFoldTimeout === undefined) {
      return
    }

    const immediate = setImmediate(() => setRenderBelowTheFold(true), props.belowTheFoldTimeout)

    return () => clearImmediate(immediate)
  }, [])

  return (
    <>
      <QueryRenderer
        environment={props.environment}
        query={props.above.query}
        variables={props.above.variables}
        render={(args) => {
          if (__TEST__) {
            setAboveArgs(args)
          } else {
            setImmediate(() => {
              setAboveArgs(args)
            })
          }
          return shouldCallRender
            ? render({
                // make props null if we haven't received the above-the-fold result yet
                // to make sure `renderWithPlaceholder` works properly
                props: aboveArgs?.props
                  ? { above: aboveArgs.props, below: belowArgs?.props || null }
                  : null,
                error,
                retry,
              })
            : null
        }}
        fetchPolicy={props.fetchPolicy}
        cacheConfig={props.cacheConfig || null}
      />
      {(!!renderBelowTheFold || !!aboveArgs?.props) && (
        <QueryRenderer
          environment={props.environment}
          query={props.below.query}
          variables={props.below.variables}
          render={(args) => {
            if (__TEST__) {
              setBelowArgs(args)
            } else {
              setImmediate(() => {
                setBelowArgs(args)
              })
            }
            return null
          }}
          fetchPolicy={props.fetchPolicy}
          cacheConfig={props.cacheConfig || null}
        />
      )}
    </>
  )
}
