import { Flex, Serif, space } from "@artsy/palette"
import { AutosuggestResults_results } from "__generated__/AutosuggestResults_results.graphql"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useCallback, useEffect, useMemo, useRef } from "react"
import React from "react"
import { FlatList } from "react-native"
import { Sentry } from "react-native-sentry"
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
  const loadMore = useCallback(() => relay.loadMore(SUBSEQUENT_BATCH_SIZE), [])

  // We only want to load more results after the user has started scrolling, and unfortunately
  // FlatList calls onEndReached right after mounting because the default threshold is quite
  // generous. We want that generosity during a scroll but most of the time a user will not
  // scroll at all so to begin with we only want to fetch enough content to fill the screen.
  // So we're using this flag to 'gate' loadMore
  const userHasStartedScrolling = useRef(false)
  const onScrollBeginDrag = useCallback(() => {
    if (!userHasStartedScrolling.current) {
      userHasStartedScrolling.current = true
      // fetch second page immediately
      loadMore()
    }
  }, [])
  const onEndReached = useCallback(() => {
    if (userHasStartedScrolling.current) {
      loadMore()
    }
  }, [])
  useEffect(() => {
    if (query) {
      // the query changed, prevent loading more pages until the user starts scrolling
      userHasStartedScrolling.current = false
    }
  }, [query])

  // When the user has scrolled down some and then starts typing again we want to
  // take them back to the top of the results list. But if we do that immediately
  // after the query changed then janky behaviour ensues, so we need to wait for
  // the relevant results to be fetched and rendered. We know new results come
  // in when the previous results we encountered were `null` (when the query changed but
  /// the fetch/cache-lookup has not completed yet) so we can scroll the user back to
  // the top whenever that happens.
  const lastResults = usePreviousValue(latestResults, undefined)
  const flatListRef = useRef<FlatList<any>>()
  useEffect(() => {
    if (lastResults === null && latestResults !== null) {
      // results were updated after a new query, scroll user back to top
      flatListRef.current.scrollToOffset({ offset: 0, animated: true })
      // (we need to wait for the results to be updated to avoid janky behaviour that
      // happens when the results get updated during a scroll)
    }
  }, [lastResults])

  // if the latestResults are null then the query just changed but we didn't get a response
  // yet. We don't want to keep rendering whatever was there before rather than show a blank
  // screen for a split second.
  const results = useRef(latestResults)
  results.current = latestResults || results.current

  const nodes = useMemo(() => results.current?.results.edges.map(e => ({ ...e.node, key: e.node.href })), [
    results.current,
  ])

  // We want to show a loading spinner at the bottom so long as there are more results to be had
  const hasMoreResults = results.current && results.current.results.edges.length > 0 && relay.hasMore()
  const ListFooterComponent = useMemo(() => {
    return () => (
      <Flex justifyContent="center" p={3} pb={6}>
        {hasMoreResults ? <Spinner /> : null}
      </Flex>
    )
  }, [hasMoreResults])

  const noResults = results.current && results.current.results.edges.length === 0

  return (
    <FlatList<AutosuggestResult>
      ref={flatListRef}
      style={{ flex: 1, padding: space(2) }}
      data={nodes}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={ListFooterComponent}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
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
      onScrollBeginDrag={onScrollBeginDrag}
      onEndReached={onEndReached}
    />
  )
}

const AutosuggestResultsContainer = createPaginationContainer(
  AutosuggestResultsFlatList,
  {
    results: graphql`
      fragment AutosuggestResults_results on Query
        @argumentDefinitions(query: { type: "String!" }, count: { type: "Int!" }, cursor: { type: "String" }) {
        results: searchConnection(
          query: $query
          mode: AUTOSUGGEST
          first: $count
          after: $cursor
          entities: [ARTIST, ARTWORK, FAIR, GENE, SALE, PROFILE]
        ) @connection(key: "AutosuggestResults_results") {
          edges {
            node {
              imageUrl
              href
              displayLabel
              ... on SearchableItem {
                displayType
                slug
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
      query AutosuggestResultsPaginationQuery($query: String!, $count: Int!, $cursor: String) @raw_response_type {
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
                    There seems to be a problem with the connection. Please try again shortly.
                  </Serif>
                </Flex>
              </Flex>
            )
          }
          return <AutosuggestResultsContainer query={query} results={props} />
        }}
        variables={{ query, count: INITIAL_BATCH_SIZE }}
        query={graphql`
          query AutosuggestResultsQuery($query: String!, $count: Int!) @raw_response_type {
            ...AutosuggestResults_results @arguments(query: $query, count: $count)
          }
        `}
        environment={defaultEnvironment}
      />
    )
  },
  (a, b) => a.query === b.query
)

function usePreviousValue<T>(val: T, init: T) {
  const prev = useRef(init)
  const result = prev.current
  prev.current = val
  return result
}
