import { Flex, Spacer, Spinner, useSpace } from "@artsy/palette-mobile"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { EntitySearchResultsQuery } from "__generated__/EntitySearchResultsQuery.graphql"
import { EntitySearchResults_searchConnection$key } from "__generated__/EntitySearchResults_searchConnection.graphql"
import { SimpleErrorMessage } from "app/Components/ErrorView/SimpleErrorMessage"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { SearchResult } from "app/Scenes/Search/components/SearchResult"
import { SingleIndexEmptyResultsMessage } from "app/Scenes/Search/components/SingleIndexEmptyResultsMessage"
import { SingleIndexSearchPlaceholder } from "app/Scenes/Search/components/placeholders/SingleIndexSearchPlaceholder"
import { SEARCH_PILL_KEY_TO_SEARCH_ENTITY } from "app/Scenes/Search/constants"
import { PillType, SearchResultInterface } from "app/Scenes/Search/types"
import { extractNodes } from "app/utils/extractNodes"
import { Suspense, useCallback, useContext, useEffect, useRef } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Keyboard } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface SearchResultsProps {
  query: string
  selectedPill: PillType
}

const PAGE_SIZE = isTablet() ? 40 : 20
const ESTIMATED_ITEM_SIZE = 56

export const EntitySearchResults: React.FC<SearchResultsProps> = ({ query, selectedPill }) => {
  const space = useSpace()
  const flashListRef = useRef<FlashList<SearchResultInterface>>(null)
  const { inputRef } = useContext(SearchContext)

  const selectedEntity = SEARCH_PILL_KEY_TO_SEARCH_ENTITY?.[selectedPill.key]

  const queryData = useLazyLoadQuery<EntitySearchResultsQuery>(entitySearchResultsQuery, {
    query,
    first: PAGE_SIZE,
    entities: [selectedEntity],
  })

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    EntitySearchResultsQuery,
    EntitySearchResults_searchConnection$key
  >(entitySearchResultsFragment, queryData)

  const hits = (extractNodes(data?.searchConnection) as SearchResultInterface[]) ?? []

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(PAGE_SIZE)
  }

  const handleOnScrollBeginDrag = () => {
    inputRef.current?.blur()
    Keyboard.dismiss()
  }

  useEffect(() => {
    if (flashListRef.current) {
      flashListRef.current.scrollToOffset({ offset: 0, animated: true })
    }
  }, [query])

  // Store query and selectedPill in refs so renderItem always has access to the latest values
  const queryRef = useRef(query)
  queryRef.current = query
  const selectedPillRef = useRef(selectedPill)
  selectedPillRef.current = selectedPill

  const renderItem: ListRenderItem<SearchResultInterface> = useCallback(({ item, index }) => {
    return (
      <SearchResult
        result={item}
        selectedPill={selectedPillRef.current}
        query={queryRef.current}
        position={index}
      />
    )
  }, [])

  return (
    <FlashList
      accessibilityRole="list"
      accessibilityLabel={`${selectedPill.displayName} search results list`}
      ref={flashListRef}
      contentContainerStyle={{
        paddingTop: space(1),
        paddingHorizontal: space(2),
        paddingBottom: space(6),
      }}
      data={hits}
      extraData={{ query, selectedPill }}
      keyExtractor={(item, index) => item.internalID ?? index.toString()}
      renderItem={renderItem}
      estimatedItemSize={ESTIMATED_ITEM_SIZE}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={() => (
        <SingleIndexEmptyResultsMessage query={query} selectedPill={selectedPill} />
      )}
      ListFooterComponent={() => (
        <Flex alignItems="center" my={4}>
          {isLoadingNext ? <Spinner testID="spinner" /> : null}
        </Flex>
      )}
      onScrollBeginDrag={handleOnScrollBeginDrag}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  )
}

export const EntitySearchResultsScreen: React.FC<SearchResultsProps> = (props) => (
  <ErrorBoundary fallback={<SimpleErrorMessage />}>
    <Suspense
      fallback={
        <SingleIndexSearchPlaceholder hasRoundedImages={props.selectedPill.key === "artist"} />
      }
    >
      <EntitySearchResults {...props} />
    </Suspense>
  </ErrorBoundary>
)

const entitySearchResultsFragment = graphql`
  fragment EntitySearchResults_searchConnection on Query
  @refetchable(queryName: "EntitySearchResults_searchConnectionnRefetch")
  @argumentDefinitions(
    query: { type: "String!" }
    first: { type: "Int" }
    cursor: { type: "String" }
    page: { type: "Int" }
    entities: { type: "[SearchEntity]" }
  ) {
    searchConnection(
      mode: AUTOSUGGEST
      first: $first
      after: $cursor
      page: $page
      query: $query
      entities: $entities
    ) @connection(key: "EntitySearchResults_searchConnection") {
      edges {
        node {
          __typename
          displayLabel
          href
          imageUrl
          ... on SearchableItem {
            internalID
            slug
          }
        }
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`

const entitySearchResultsQuery = graphql`
  query EntitySearchResultsQuery(
    $query: String!
    $first: Int
    $cursor: String
    $entities: [SearchEntity]
    $page: Int
  ) {
    ...EntitySearchResults_searchConnection
      @arguments(query: $query, first: $first, cursor: $cursor, page: $page, entities: $entities)
  }
`
