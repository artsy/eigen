import { Flex, Spacer, useSpace, Text, Spinner } from "@artsy/palette-mobile"
import { ElasticSearchResultsQuery } from "__generated__/ElasticSearchResultsQuery.graphql"
import { ElasticSearchResults_searchConnection$key } from "__generated__/ElasticSearchResults_searchConnection.graphql"
import { ElasticSearchResult } from "app/Scenes/Search/components/ElasticSearchResult"
import { SingleIndexSearchPlaceholder } from "app/Scenes/Search/components/placeholders/SingleIndexSearchPlaceholder"
import {
  ELASTIC_PILL_KEY_TO_SEARCH_ENTITY,
  SINGLE_INDICES_WITH_AN_ARTICLE,
} from "app/Scenes/Search/constants"
import { AlgoliaIndexKey, PillType } from "app/Scenes/Search/types"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { Box } from "palette"
import { Suspense, useEffect, useRef } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface SearchResults2Props {
  query: string
  selectedPill: PillType
}

const PAGE_SIZE = isPad() ? 20 : 10

export const SearchResults2: React.FC<SearchResults2Props> = ({ query, selectedPill }) => {
  const space = useSpace()
  const flatListRef = useRef<FlatList>(null)

  const selectedEntity = ELASTIC_PILL_KEY_TO_SEARCH_ENTITY?.[selectedPill.key]

  const queryData = useLazyLoadQuery<ElasticSearchResultsQuery>(elasticSearchResultsQuery, {
    query,
    first: PAGE_SIZE,
    entities: [selectedEntity],
  })

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    ElasticSearchResultsQuery,
    ElasticSearchResults_searchConnection$key
  >(searchResultsFragment, queryData)

  useEffect(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    })
  }, [selectedPill.indexName])

  const hits = extractNodes(data?.searchConnection)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(PAGE_SIZE)
  }

  return (
    <FlatList
      ref={flatListRef}
      contentContainerStyle={{ paddingVertical: space("1"), paddingHorizontal: space("2") }}
      data={hits}
      keyExtractor={(item, index) => item.internalID ?? index.toString()}
      renderItem={({ item }) => (
        <ElasticSearchResult result={item} selectedPill={selectedPill} query={query} />
      )}
      initialNumToRender={PAGE_SIZE}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={() => {
        // type casting to AlgoliaIndexKey to be removed when we remove algolia
        const article = SINGLE_INDICES_WITH_AN_ARTICLE.includes(selectedPill.key as AlgoliaIndexKey)
          ? "an"
          : "a"

        return (
          <Box px={2} py={1}>
            <Spacer mt={4} />
            <Text variant="sm-display" textAlign="center">
              Sorry, we couldn’t find {article} {selectedPill.displayName} for “{query}
              .”
            </Text>
            <Text variant="sm-display" color="black60" textAlign="center">
              Please try searching again with a different spelling.
            </Text>
          </Box>
        )
      }}
      ListFooterComponent={
        <Flex alignItems="center" my={2}>
          {isLoadingNext ? <Spinner /> : null}
        </Flex>
      }
      onEndReached={handleLoadMore}
    />
  )
}

export const ElasticSearchResults2Screen: React.FC<SearchResults2Props> = (props) => (
  <Suspense
    fallback={
      <ProvidePlaceholderContext>
        <SingleIndexSearchPlaceholder hasRoundedImages={props.selectedPill.key === "artist"} />
      </ProvidePlaceholderContext>
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
    entities: { type: "[SearchEntity]" }
  ) {
    searchConnection(
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
    $first: Int
    $cursor: String
    $entities: [SearchEntity]
    $page: Int
  ) {
    ...ElasticSearchResults_searchConnection
      @arguments(query: $query, first: $first, cursor: $cursor, page: $page, entities: $entities)
  }
`
