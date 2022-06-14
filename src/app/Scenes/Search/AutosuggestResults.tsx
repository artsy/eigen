import { captureMessage } from "@sentry/react-native"
import { AutosuggestResults_results$data } from "__generated__/AutosuggestResults_results.graphql"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import { LoadFailureView } from "app/Components/LoadFailureView"
import Spinner from "app/Components/Spinner"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { isPad } from "app/utils/hardware"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { Flex, quoteLeft, quoteRight, Spacer, Text, useSpace } from "palette"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"
import {
  AutosuggestSearchResult,
  OnResultPress,
  TrackResultPress,
} from "./components/AutosuggestSearchResult"
import { AutosuggestResultsPlaceholder } from "./components/placeholders/AutosuggestResultsPlaceholder"

export type AutosuggestResult = NonNullable<
  NonNullable<
    NonNullable<NonNullable<AutosuggestResults_results$data["results"]>["edges"]>[0]
  >["node"]
>

const INITIAL_BATCH_SIZE = 32
const SUBSEQUENT_BATCH_SIZE = 64

const AutosuggestResultsFlatList: React.FC<{
  query: string
  // if results are null that means we are waiting on a response from MP
  results: AutosuggestResults_results$data | null
  relay: RelayPaginationProp
  showResultType?: boolean
  showQuickNavigationButtons?: boolean
  onResultPress?: OnResultPress
  trackResultPress?: TrackResultPress
  ListEmptyComponent?: React.ComponentType<any>
}> = ({
  query,
  results: latestResults,
  relay,
  showResultType = false,
  showQuickNavigationButtons,
  onResultPress,
  trackResultPress,
  ListEmptyComponent = EmptyList,
}) => {
  const space = useSpace()
  const [shouldShowLoadingPlaceholder, setShouldShowLoadingPlaceholder] = useState(true)
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

  // Show loading placeholder for the first time
  useEffect(() => {
    if (latestResults !== null) {
      setShouldShowLoadingPlaceholder(false)
    }
  }, [latestResults])

  // When the user has scrolled down some and then starts typing again we want to
  // take them back to the top of the results list. But if we do that immediately
  // after the query changed then janky behaviour ensues, so we need to wait for
  // the relevant results to be fetched and rendered. We know new results come
  // in when the previous results we encountered were `null` (when the query changed but
  /// the fetch/cache-lookup has not completed yet) so we can scroll the user back to
  // the top whenever that happens.
  const lastResults = usePrevious(latestResults)
  const flatListRef = useRef<FlatList<any>>(null)
  useEffect(() => {
    if (lastResults === null && latestResults !== null) {
      // results were updated after a new query, scroll user back to top
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
      // (we need to wait for the results to be updated to avoid janky behaviour that
      // happens when the results get updated during a scroll)
    }
  }, [lastResults])

  // if the latestResults are null then the query just changed but we didn't get a response
  // yet. We don't want to keep rendering whatever was there before rather than show a blank
  // screen for a split second.
  const results = useRef(latestResults)
  results.current = latestResults || results.current

  const nodes: AutosuggestResult[] = useMemo(
    () =>
      results.current?.results?.edges?.map((e, i) => ({ ...e?.node!, key: e?.node?.href! + i })) ??
      [],
    [results.current]
  )

  // We want to show a loading spinner at the bottom so long as there are more results to be had
  const hasMoreResults =
    results.current && results.current.results?.edges?.length! > 0 && relay.hasMore()
  const ListFooterComponent = useMemo(() => {
    return () => (
      <Flex justifyContent="center" p={3} pb={6}>
        {hasMoreResults ? <Spinner /> : null}
      </Flex>
    )
  }, [hasMoreResults])

  const noResults = results.current && results.current.results?.edges?.length === 0

  if (shouldShowLoadingPlaceholder) {
    return (
      <ProvidePlaceholderContext>
        <AutosuggestResultsPlaceholder showResultType={showResultType} />
      </ProvidePlaceholderContext>
    )
  }

  return (
    <AboveTheFoldFlatList<AutosuggestResult>
      listRef={flatListRef}
      initialNumToRender={isPad() ? 24 : 12}
      style={{ flex: 1, padding: space(2) }}
      data={nodes}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={ListFooterComponent}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={noResults ? () => <ListEmptyComponent query={query} /> : null}
      renderItem={({ item, index }) => {
        return (
          <Flex mb={2}>
            <AutosuggestSearchResult
              highlight={query}
              result={item}
              showResultType={showResultType}
              onResultPress={onResultPress}
              showQuickNavigationButtons={showQuickNavigationButtons}
              trackResultPress={trackResultPress}
              itemIndex={index}
            />
          </Flex>
        )
      }}
      onScrollBeginDrag={onScrollBeginDrag}
      onEndReached={onEndReached}
    />
  )
}

const EmptyList: React.FC<{ query: string }> = ({ query }) => {
  return (
    <>
      <Spacer mt={1} />
      <Spacer mt={2} />
      <Text variant="md" textAlign="center">
        Sorry, we couldn’t find anything for {quoteLeft}
        {query}.{quoteRight}
      </Text>
      <Text variant="md" color="black60" textAlign="center">
        Please try searching again with a different spelling.
      </Text>
    </>
  )
}

const AutosuggestResultsContainer = createPaginationContainer(
  AutosuggestResultsFlatList,
  {
    results: graphql`
      fragment AutosuggestResults_results on Query
      @argumentDefinitions(
        query: { type: "String!" }
        count: { type: "Int!" }
        cursor: { type: "String" }
        entities: {
          type: "[SearchEntity]"
          defaultValue: [ARTIST, ARTWORK, FAIR, GENE, SALE, PROFILE, COLLECTION]
        }
      ) {
        results: searchConnection(
          query: $query
          mode: AUTOSUGGEST
          first: $count
          after: $cursor
          entities: $entities
        ) @connection(key: "AutosuggestResults_results") {
          edges {
            node {
              imageUrl
              href
              displayLabel
              __typename
              ... on SearchableItem {
                internalID
                displayType
                slug
              }
              ... on Artist {
                internalID
                formattedNationalityAndBirthday
                slug
                statuses {
                  artworks
                  auctionLots
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.results?.results
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query AutosuggestResultsPaginationQuery(
        $query: String!
        $count: Int!
        $cursor: String
        $entities: [SearchEntity]
      ) @raw_response_type {
        ...AutosuggestResults_results
          @arguments(query: $query, count: $count, cursor: $cursor, entities: $entities)
      }
    `,
  }
)

export const AutosuggestResults: React.FC<{
  query: string
  entities?: AutosuggestResultsQuery["variables"]["entities"]
  showResultType?: boolean
  showQuickNavigationButtons?: boolean
  showOnRetryErrorMessage?: boolean
  onResultPress?: OnResultPress
  trackResultPress?: TrackResultPress
  ListEmptyComponent?: React.ComponentType<any>
}> = React.memo(
  ({
    query,
    entities,
    showResultType,
    showQuickNavigationButtons,
    showOnRetryErrorMessage,
    onResultPress,
    trackResultPress,
    ListEmptyComponent,
  }) => {
    return (
      <QueryRenderer<AutosuggestResultsQuery>
        render={({ props, error, retry }) => {
          if (error) {
            if (__DEV__) {
              console.error(error)
            } else {
              captureMessage(error.stack!)
            }

            if (showOnRetryErrorMessage && retry) {
              return <LoadFailureView onRetry={retry} />
            }

            return (
              <Flex alignItems="center" justifyContent="center">
                <Flex maxWidth={280}>
                  <Text variant="sm" textAlign="center">
                    There seems to be a problem with the connection. Please try again shortly.
                  </Text>
                </Flex>
              </Flex>
            )
          }
          return (
            <AutosuggestResultsContainer
              query={query}
              results={props}
              showResultType={showResultType}
              showQuickNavigationButtons={showQuickNavigationButtons}
              onResultPress={onResultPress}
              trackResultPress={trackResultPress}
              ListEmptyComponent={ListEmptyComponent}
            />
          )
        }}
        variables={{
          query,
          count: INITIAL_BATCH_SIZE,
          entities,
        }}
        query={graphql`
          query AutosuggestResultsQuery($query: String!, $count: Int!, $entities: [SearchEntity])
          @raw_response_type {
            ...AutosuggestResults_results
              @arguments(query: $query, count: $count, entities: $entities)
          }
        `}
        environment={defaultEnvironment}
      />
    )
  },
  (a, b) => a.query === b.query
)
