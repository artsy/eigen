import { Flex, Spacer, useSpace, Spinner } from "@artsy/palette-mobile"
import { EntitySearchResultsQuery } from "__generated__/EntitySearchResultsQuery.graphql"
import { EntitySearchResults_searchConnection$key } from "__generated__/EntitySearchResults_searchConnection.graphql"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { SearchResult } from "app/Scenes/Search/components/SearchResult"
import { SingleIndexEmptyResultsMessage } from "app/Scenes/Search/components/SingleIndexEmptyResultsMessage"
import { SingleIndexSearchPlaceholder } from "app/Scenes/Search/components/placeholders/SingleIndexSearchPlaceholder"
import { SEARCH_PILL_KEY_TO_SEARCH_ENTITY } from "app/Scenes/Search/constants"
import { PillType } from "app/Scenes/Search/types"
import { extractNodes } from "app/utils/extractNodes"
import { Suspense, useContext, useEffect, useRef } from "react"
import { FlatList, Keyboard } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface SearchResultsProps {
  query: string
  selectedPill: PillType
}

const PAGE_SIZE = isTablet() ? 20 : 10

export const EntitySearchResults: React.FC<SearchResultsProps> = ({ query, selectedPill }) => {
  const space = useSpace()
  const flatListRef = useRef<FlatList>(null)
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

  const hits = extractNodes(data?.searchConnection)

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
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true })
    }
  }, [query])

  return (
    <FlatList
      accessibilityRole="list"
      accessibilityLabel={`${selectedPill.displayName} search results list`}
      ref={flatListRef}
      contentContainerStyle={{ paddingVertical: space(1), paddingHorizontal: space(2) }}
      data={hits}
      keyExtractor={(item, index) => item.internalID ?? index.toString()}
      renderItem={({ item, index }) => (
        <SearchResult result={item} selectedPill={selectedPill} query={query} position={index} />
      )}
      initialNumToRender={PAGE_SIZE}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={() => (
        <SingleIndexEmptyResultsMessage query={query} selectedPill={selectedPill} />
      )}
      ListFooterComponent={
        <Flex alignItems="center" my={2}>
          {isLoadingNext ? <Spinner testID="spinner" /> : null}
        </Flex>
      }
      onScrollBeginDrag={handleOnScrollBeginDrag}
      onEndReached={handleLoadMore}
    />
  )
}

export const EntitySearchResultsScreen: React.FC<SearchResultsProps> = (props) => (
  <Suspense
    fallback={
      <SingleIndexSearchPlaceholder hasRoundedImages={props.selectedPill.key === "artist"} />
    }
  >
    <EntitySearchResults {...props} />
  </Suspense>
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
