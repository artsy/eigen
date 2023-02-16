import { Flex, Spacer, useSpace, Spinner } from "@artsy/palette-mobile"
import { ElasticSearchResultsQuery } from "__generated__/ElasticSearchResultsQuery.graphql"
import { ElasticSearchResults_searchConnection$key } from "__generated__/ElasticSearchResults_searchConnection.graphql"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { ElasticSearchResult } from "app/Scenes/Search/components/ElasticSearchResult"
import { SingleIndexEmptyResultsMessage } from "app/Scenes/Search/components/SingleIndexEmptyResultsMessage"
import { SingleIndexSearchPlaceholder } from "app/Scenes/Search/components/placeholders/SingleIndexSearchPlaceholder"
import { ELASTIC_PILL_KEY_TO_SEARCH_ENTITY } from "app/Scenes/Search/constants"
import { PillType } from "app/Scenes/Search/types"
import { useFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { Suspense, useContext, useEffect, useRef } from "react"
import { FlatList, Keyboard } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface SearchResults2Props {
  query: string
  selectedPill: PillType
}

const PAGE_SIZE = isPad() ? 20 : 10

export const SearchResults2: React.FC<SearchResults2Props> = ({ query, selectedPill }) => {
  const space = useSpace()
  const isAutosuggestModeEnabled = useFeatureFlag("AREnableAutosuggestModeESSearch")
  const flatListRef = useRef<FlatList>(null)
  const { inputRef } = useContext(SearchContext)

  const selectedEntity = ELASTIC_PILL_KEY_TO_SEARCH_ENTITY?.[selectedPill.key]

  const mode = isAutosuggestModeEnabled ? "AUTOSUGGEST" : "SITE"

  const queryData = useLazyLoadQuery<ElasticSearchResultsQuery>(elasticSearchResultsQuery, {
    query,
    first: PAGE_SIZE,
    entities: [selectedEntity],
    mode,
  })

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    ElasticSearchResultsQuery,
    ElasticSearchResults_searchConnection$key
  >(searchResultsFragment, queryData)

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
        <ElasticSearchResult
          result={item}
          selectedPill={selectedPill}
          query={query}
          position={index}
        />
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
          {isLoadingNext ? <Spinner /> : null}
        </Flex>
      }
      onScrollBeginDrag={handleOnScrollBeginDrag}
      onEndReached={handleLoadMore}
    />
  )
}

export const ElasticSearchResults2Screen: React.FC<SearchResults2Props> = (props) => (
  <Suspense
    fallback={
      <SingleIndexSearchPlaceholder hasRoundedImages={props.selectedPill.key === "artist"} />
    }
  >
    <SearchResults2 {...props} />
  </Suspense>
)

const searchResultsFragment = graphql`
  fragment ElasticSearchResults_searchConnection on Query
  @refetchable(queryName: "ElasticSearchResults_searchConnectionnRefetch")
  @argumentDefinitions(
    query: { type: "String!" }
    first: { type: "Int" }
    cursor: { type: "String" }
    page: { type: "Int" }
    mode: { type: "SearchMode" }
    entities: { type: "[SearchEntity]" }
  ) {
    searchConnection(
      mode: $mode
      first: $first
      after: $cursor
      page: $page
      query: $query
      entities: $entities
    ) @connection(key: "ElasticSearchResults_searchConnection") {
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

const elasticSearchResultsQuery = graphql`
  query ElasticSearchResultsQuery(
    $query: String!
    $mode: SearchMode
    $first: Int
    $cursor: String
    $entities: [SearchEntity]
    $page: Int
  ) {
    ...ElasticSearchResults_searchConnection
      @arguments(
        query: $query
        mode: $mode
        first: $first
        cursor: $cursor
        page: $page
        entities: $entities
      )
  }
`
