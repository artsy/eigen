import { ReloadIcon } from "@artsy/icons/native"
import { Button, Flex, Spacer, Text, quoteLeft, quoteRight } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { ListRenderItem } from "@shopify/flash-list"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import { AutosuggestResults_results$data } from "__generated__/AutosuggestResults_results.graphql"
import { AutosuggestResultsPlaceholder } from "app/Components/AutosuggestResults/AutosuggestResultsPlaceholder"
import { InfiniteScrollFlashList } from "app/Components/InfiniteScrollFlashList"
import Spinner from "app/Components/Spinner"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import {
  AutosuggestSearchResult,
  OnResultPress,
  TrackResultPress,
} from "app/Scenes/Search/components/AutosuggestSearchResult"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Keyboard } from "react-native"
import { isTablet } from "react-native-device-info"
import { QueryRenderer, RelayPaginationProp, createPaginationContainer, graphql } from "react-relay"
import usePrevious from "react-use/lib/usePrevious"

export type AutosuggestResult = NonNullable<
  NonNullable<
    NonNullable<NonNullable<AutosuggestResults_results$data["results"]>["edges"]>[0]
  >["node"]
>

const INITIAL_BATCH_SIZE = 32
const SUBSEQUENT_BATCH_SIZE = 64

const AutosuggestResultsFlatList: React.FC<{
  // if results are null that means we are waiting on a response from MP
  CustomListItemComponent?: React.FC<{ item: AutosuggestResult; highlight: string }>
  CustomPlaceholderComponent?: React.ComponentType<any>
  HeaderComponent?: React.ComponentType<any>
  ListEmptyComponent?: React.ComponentType<any>
  ListFooterComponent?: React.ComponentType<any>
  ListHeaderComponent?: React.ComponentType<any>
  numColumns?: number
  onResultPress?: OnResultPress
  prependResults?: AutosuggestResult[]
  query: string
  relay: RelayPaginationProp
  results: AutosuggestResults_results$data | null
  showQuickNavigationButtons?: boolean
  showResultType?: boolean
  trackResultPress?: TrackResultPress
}> = ({
  CustomListItemComponent,
  CustomPlaceholderComponent,
  HeaderComponent = null,
  ListEmptyComponent = EmptyList,
  ListFooterComponent,
  ListHeaderComponent = () => <Spacer y={2} />,
  numColumns = 1,
  onResultPress,
  prependResults = [],
  query,
  relay,
  results: latestResults,
  showQuickNavigationButtons,
  showResultType = false,
  trackResultPress,
}) => {
  const [shouldShowLoadingPlaceholder, setShouldShowLoadingPlaceholder] = useState(true)
  const loadMore = useCallback(() => relay.loadMore(SUBSEQUENT_BATCH_SIZE), [])
  const { inputRef } = useContext(SearchContext)
  // We only want to load more results after the user has started scrolling, and unfortunately
  // FlatList calls onEndReached right after mounting because the default threshold is quite
  // generous. We want that generosity during a scroll but most of the time a user will not
  // scroll at all so to begin with we only want to fetch enough content to fill the screen.
  // So we're using this flag to 'gate' loadMore
  const userHasStartedScrolling = useRef(false)
  const onScrollBeginDrag = useCallback(() => {
    // blurs the input
    inputRef.current?.blur()
    // dismisses the keyboard
    Keyboard.dismiss()

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
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true })
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

  const nodes: AutosuggestResult[] = useMemo(() => {
    const excludedIDs = prependResults.map((result) => result.internalID)

    const edges =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      results.current?.results?.edges?.map((e, i) => ({ ...e?.node!, key: e?.node?.href! + i })) ??
      []
    const filteredEdges = edges.filter((node) => !excludedIDs.includes(node.internalID))

    return filteredEdges
  }, [results.current, prependResults])

  const allNodes = [...prependResults, ...nodes]

  // We want to show a loading spinner at the bottom so long as there are more results to be had
  const hasMoreResults =
    results.current &&
    !!results.current.results?.edges?.length &&
    results.current.results?.edges?.length > 0 &&
    relay.hasMore()

  const noResults = results.current && allNodes.length === 0

  const showHeaderComponent = HeaderComponent && !!(allNodes.length > 0)

  const ListFooterComponentWithLoadingIndicator = useMemo(() => {
    return () => (
      <Flex pb={6}>
        {hasMoreResults ? (
          <Flex justifyContent="center" mt={1}>
            <Spinner />
          </Flex>
        ) : (
          !noResults && !!ListFooterComponent && <ListFooterComponent />
        )}
      </Flex>
    )
  }, [hasMoreResults, noResults, ListFooterComponent])

  // Store query in a ref so renderItem always has access to the latest value
  const queryRef = useRef(query)
  queryRef.current = query

  const renderItem: ListRenderItem<AutosuggestResult> = useCallback(({ item, index }) => {
    if (CustomListItemComponent) {
      return <CustomListItemComponent item={item} highlight={queryRef.current} />
    }

    return (
      <Flex mb={2}>
        <AutosuggestSearchResult
          highlight={queryRef.current}
          result={item}
          showResultType={showResultType}
          onResultPress={onResultPress}
          showQuickNavigationButtons={showQuickNavigationButtons}
          trackResultPress={trackResultPress}
          itemIndex={index}
        />
      </Flex>
    )
  }, [])

  if (shouldShowLoadingPlaceholder) {
    return (
      <ProvidePlaceholderContext>
        {!!HeaderComponent && <HeaderComponent />}
        {!!ListHeaderComponent && <ListHeaderComponent />}
        {CustomPlaceholderComponent ? (
          <CustomPlaceholderComponent />
        ) : (
          <AutosuggestResultsPlaceholder showResultType={showResultType} />
        )}
      </ProvidePlaceholderContext>
    )
  }

  return (
    <Flex style={{ width: "100%", height: "100%" }} pb={2}>
      {!!showHeaderComponent && <HeaderComponent />}
      <InfiniteScrollFlashList<AutosuggestResult>
        ListHeaderComponent={ListHeaderComponent}
        listRef={flatListRef}
        initialNumToRender={isTablet() ? 24 : 12}
        data={allNodes}
        extraData={query}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ListFooterComponentWithLoadingIndicator}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        numColumns={numColumns}
        ListEmptyComponent={noResults ? () => <ListEmptyComponent query={query} /> : null}
        renderItem={renderItem}
        onScrollBeginDrag={onScrollBeginDrag}
        onEndReached={onEndReached}
      />
    </Flex>
  )
}

const EmptyList: React.FC<{ query: string }> = ({ query }) => {
  return (
    <>
      <Spacer y={1} />
      <Spacer y={2} />
      <Text variant="sm-display" textAlign="center">
        Sorry, we couldn’t find anything for {quoteLeft}
        {query}.{quoteRight}
      </Text>
      <Text variant="sm-display" color="mono60" textAlign="center">
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
                counts {
                  artworks
                }
                targetSupply {
                  isP1
                  isTargetSupply
                }
                formattedNationalityAndBirthday
                internalID
                initials
                isPersonalArtist
                slug
                statuses {
                  artworks
                  auctionLots
                }
                coverArtwork {
                  imageUrl
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
  CustomListItemComponent?: React.FC<{ item: AutosuggestResult; highlight: string }>
  CustomPlaceholderComponent?: React.ComponentType<any>
  entities?: AutosuggestResultsQuery["variables"]["entities"]
  HeaderComponent?: React.ComponentType<any>
  ListEmptyComponent?: React.ComponentType<any>
  ListFooterComponent?: React.ComponentType<any>
  ListHeaderComponent?: React.ComponentType<any>
  numColumns?: number
  onResultPress?: OnResultPress
  prependResults?: any[]
  query: string
  showOnRetryErrorMessage?: boolean
  showQuickNavigationButtons?: boolean
  showResultType?: boolean
  trackResultPress?: TrackResultPress
}> = React.memo(
  ({
    CustomListItemComponent,
    CustomPlaceholderComponent,
    entities,
    HeaderComponent,
    ListEmptyComponent,
    ListFooterComponent,
    ListHeaderComponent,
    numColumns = 1,
    onResultPress,
    prependResults,
    query,
    showOnRetryErrorMessage,
    showQuickNavigationButtons,
    showResultType,
    trackResultPress,
  }) => {
    const [hasClickedRetry, setHasClickedRetry] = useState(false)

    return (
      <QueryRenderer<AutosuggestResultsQuery>
        render={({ props, error, retry }) => {
          if (error) {
            if (__DEV__) {
              console.error(error)
            } else {
              captureMessage(`AutosuggestResultsQuery ${error.message}`)
            }

            if (showOnRetryErrorMessage && retry) {
              return (
                <Flex py={4}>
                  <Text variant="sm-display" textAlign="center">
                    Something went wrong.
                  </Text>
                  <Text variant="sm-display" color="mono60" textAlign="center">
                    Please adjust your query or try again shortly.
                  </Text>

                  <Spacer y={2} />

                  {!hasClickedRetry && (
                    <Flex alignItems="center">
                      <Button
                        onPress={() => {
                          retry()
                          setTimeout(() => {
                            setHasClickedRetry(true)
                          }, 300)
                        }}
                        variant="text"
                      >
                        <ReloadIcon height={25} width={25} />
                      </Button>
                    </Flex>
                  )}
                </Flex>
              )
            }

            return (
              <Flex py={4}>
                <Text variant="sm" color="mono60">
                  There seems to be a problem with the connection.
                </Text>
                <Text variant="sm-display" color="mono60" textAlign="center">
                  Please try again shortly.
                </Text>
              </Flex>
            )
          }
          return (
            <AutosuggestResultsContainer
              query={query}
              prependResults={prependResults}
              results={props}
              showResultType={showResultType}
              showQuickNavigationButtons={showQuickNavigationButtons}
              onResultPress={onResultPress}
              trackResultPress={trackResultPress}
              ListEmptyComponent={ListEmptyComponent}
              ListHeaderComponent={ListHeaderComponent}
              HeaderComponent={HeaderComponent}
              ListFooterComponent={ListFooterComponent}
              CustomListItemComponent={CustomListItemComponent}
              CustomPlaceholderComponent={CustomPlaceholderComponent}
              numColumns={numColumns}
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
        environment={getRelayEnvironment()}
      />
    )
  },
  (a, b) => a.query === b.query
)
