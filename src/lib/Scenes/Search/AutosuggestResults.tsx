import { Flex, Serif, space } from "@artsy/palette"
import { AutosuggestResults_results } from "__generated__/AutosuggestResults_results.graphql"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useEffect, useMemo, useRef } from "react"
import React from "react"
import { FlatList } from "react-native"
import Sentry from "react-native-sentry"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { SearchResult } from "./SearchResult"

export type AutosuggestResult = AutosuggestResults_results["results"]["edges"][0]["node"]

const INITIAL_BATCH_SIZE = 16
const SUBSEQUENT_BATCH_SIZE = 64

const AutosuggestResultsFlatList: React.FC<{
  query: string
  // if results are null that means we are waiting on a response from MP
  results: AutosuggestResults_results | null
  relay: RelayPaginationProp
}> = ({ query, results: latestResults, relay }) => {
  const results = useRef(latestResults)

  // if the user just typed and we didn't get a response from MP yet latestResults will
  // be null. In that case we don't want to re-render as empty so just re-use the old results
  results.current = latestResults || results.current

  const flatListRef = useRef<FlatList<any>>()
  const shouldLoadMore = useRef(false)

  const loadMore = useMemo(() => {
    let isLoadingMore = false
    return () => {
      if (!isLoadingMore && relay.hasMore()) {
        isLoadingMore = true
        relay.loadMore(SUBSEQUENT_BATCH_SIZE, () => {
          isLoadingMore = false
        })
      }
    }
  }, [])

  useEffect(() => {
    // whenever the query changes make sure we scroll back to the top
    if (query) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true })
      // also disable loading more until the user explicitly begins to scroll
      shouldLoadMore.current = false
    }
  }, [query])

  const nodes = useMemo(() => results.current?.results.edges.map(e => ({ ...e.node, key: e.node.href })), [
    results.current,
  ])

  const noResults = results.current && results.current.results.edges.length === 0

  const hasMoreResults = results.current && results.current.results.edges.length > 0 && relay.hasMore()
  const ListFooterComponent = useMemo(() => {
    return () => (
      <Flex alignItems="center" justifyContent="center" p={3}>
        {hasMoreResults ? <Spinner /> : null}
      </Flex>
    )
  }, [hasMoreResults])

  return (
    <FlatList<AutosuggestResult>
      ref={flatListRef}
      style={{ flex: 1, padding: space(2) }}
      data={nodes}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={
        noResults
          ? () => {
              return <Serif size="3">We couldn't find anything for “{query}”</Serif>
            }
          : null
      }
      renderItem={({ item }) => {
        return (
          <Flex mb={2}>
            <SearchResult highlight={query} result={item} />
          </Flex>
        )
      }}
      onScrollBeginDrag={() => {
        if (!shouldLoadMore.current) {
          // load second page straight away
          loadMore()
          shouldLoadMore.current = true
        }
      }}
      onEndReached={() => {
        // onEndReached gets called a bit too readily, so we hide it
        // behind this flag which only gets set to true after the user has started scrolling
        if (shouldLoadMore.current) {
          loadMore()
        }
      }}
    />
  )
}

const AutosuggestResultsContainer = createPaginationContainer(
  AutosuggestResultsFlatList,
  {
    results: graphql`
      fragment AutosuggestResults_results on Query
        @argumentDefinitions(query: { type: "String!" }, count: { type: "Int!" }, cursor: { type: "String" }) {
        results: searchConnection(query: $query, mode: AUTOSUGGEST, first: $count, after: $cursor)
          @connection(key: "AutosuggestResults_results") {
          edges {
            node {
              imageUrl
              href
              displayLabel
              ... on SearchableItem {
                displayType
              }
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.results?.results
    },
    getFragmentVariables(vars, totalCount) {
      return {
        ...vars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query AutosuggestResultsPaginationQuery($query: String!, $count: Int, $cursor: String) {
        ...AutosuggestResults_results @arguments(query: $query, count: $count, cursor: $cursor)
      }
    `,
  }
)

export const AutosuggestResults: React.FC<{ query: string }> = React.memo(
  ({ query }) => {
    return (
      <QueryRenderer<AutosuggestResultsQuery>
        render={({ props, error }) => {
          if (error) {
            if (__DEV__) {
              console.error(error)
            } else {
              Sentry.captureMessage(error.stack)
            }
            return (
              <Flex p={2} alignItems="center" justifyContent="center">
                <Flex maxWidth={280}>
                  <Serif size="3" textAlign="center">
                    There seems to be a problem with the connection. Please try again soon.
                  </Serif>
                </Flex>
              </Flex>
            )
          }
          // props might be null if it's still loading but that's cool we don't want to create flicker.
          return <AutosuggestResultsContainer query={query} results={props} />
        }}
        variables={{ query, count: INITIAL_BATCH_SIZE }}
        query={graphql`
          query AutosuggestResultsQuery($query: String!, $count: Int) {
            ...AutosuggestResults_results @arguments(query: $query, count: $count)
          }
        `}
        environment={defaultEnvironment}
      />
    )
  },
  (a, b) => a.query === b.query
)
