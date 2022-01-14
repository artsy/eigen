import { captureMessage } from "@sentry/react-native"
import { AutosuggestResults_results } from "__generated__/AutosuggestResults_results.graphql"
import {
  AutosuggestResultsQuery,
  AutosuggestResultsQueryVariables,
} from "__generated__/AutosuggestResultsQuery.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AutosuggestResultsPlaceholder } from "lib/Scenes/Search/components/placeholders/AutosuggestResultsPlaceholder"
import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Flex, quoteLeft, quoteRight, Separator, Spacer, Text, useSpace } from "palette"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import React from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"
import { AutosuggestSearchResult } from "./AutosuggestSearchResult"

export type AutosuggestResult = NonNullable<
  NonNullable<NonNullable<NonNullable<AutosuggestResults_results["results"]>["edges"]>[0]>["node"]
>

const INITIAL_BATCH_SIZE = 32
const SUBSEQUENT_BATCH_SIZE = 64

const AutosuggestResultsFlatList: React.FC<{
  query: string
  results: AutosuggestResults_results | null
  onResultPress: (result: AutosuggestResult) => void
  relay: RelayPaginationProp
}> = ({ query, results: latestResults, onResultPress, relay }) => {
  const space = useSpace()
  const [shouldShowLoadingPlaceholder, setShouldShowLoadingPlaceholder] = useState(true)
  const loadMore = useCallback(() => relay.loadMore(SUBSEQUENT_BATCH_SIZE), [])

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

  const results = useRef(latestResults)
  results.current = latestResults || results.current

  const nodes: AutosuggestResult[] = useMemo(
    () => results.current?.results?.edges?.map((e, i) => ({ ...e?.node!, key: e?.node?.href! + i })) ?? [],
    [results.current]
  )

  const noResults = results.current && results.current.results?.edges?.length === 0

  if (shouldShowLoadingPlaceholder) {
    return (
      <ProvidePlaceholderContext>
        <AutosuggestResultsPlaceholder showResultType={false} />
      </ProvidePlaceholderContext>
    )
  }

  return (
    <AboveTheFoldFlatList<AutosuggestResult>
      listRef={flatListRef}
      style={{
        flex: 1,
        padding: space(2),
        borderStyle: "solid",
        borderColor: "#707070",
        borderWidth: 1,
        marginTop: 3,
      }}
      data={nodes}
      showsVerticalScrollIndicator
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        noResults
          ? () => {
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
          : null
      }
      renderItem={({ item, index }) => {
        return (
          <Flex mb={1}>
            <AutosuggestSearchResult highlight={query} result={item} onResultPress={onResultPress} itemIndex={index} />
            <Separator mt={1} />
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
      @argumentDefinitions(
        query: { type: "String!" }
        count: { type: "Int!" }
        cursor: { type: "String" }
        entities: { type: "[SearchEntity]", defaultValue: [ARTIST, ARTWORK, FAIR, GENE, SALE, PROFILE, COLLECTION] }
      ) {
        results: searchConnection(query: $query, mode: AUTOSUGGEST, first: $count, after: $cursor, entities: $entities)
          @connection(key: "AutosuggestResults_results") {
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
      query AutosuggestResultsPaginationQuery($query: String!, $count: Int!, $cursor: String, $entities: [SearchEntity])
      @raw_response_type {
        ...AutosuggestResults_results @arguments(query: $query, count: $count, cursor: $cursor, entities: $entities)
      }
    `,
  }
)

export const AutosuggestResults: React.FC<{
  query: string
  entities: AutosuggestResultsQueryVariables["entities"]
  onResultPress: (result: AutosuggestResult) => void
}> = React.memo(
  ({ query, entities, onResultPress }) => {
    return (
      <QueryRenderer<AutosuggestResultsQuery>
        render={({ props, error }) => {
          if (error) {
            if (__DEV__) {
              console.error(error)
            } else {
              captureMessage(error.stack!)
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
          return <AutosuggestResultsContainer query={query} results={props} onResultPress={onResultPress} />
        }}
        variables={{
          query,
          count: INITIAL_BATCH_SIZE,
          entities,
        }}
        query={graphql`
          query AutosuggestResultsQuery($query: String!, $count: Int!, $entities: [SearchEntity]) @raw_response_type {
            ...AutosuggestResults_results @arguments(query: $query, count: $count, entities: $entities)
          }
        `}
        environment={defaultEnvironment}
      />
    )
  },
  (a, b) => a.query === b.query
)
