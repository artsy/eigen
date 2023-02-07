import { Flex, Spacer, useSpace, Text } from "@artsy/palette-mobile"
import { ElasticSearchResultsQuery } from "__generated__/ElasticSearchResultsQuery.graphql"
import { ElasticSearchResults_searchConnection$key } from "__generated__/ElasticSearchResults_searchConnection.graphql"
import { ElasticSearchResult } from "app/Scenes/Search/components/ElasticSearchResult"
import { AlgoliaSearchPlaceholder } from "app/Scenes/Search/components/placeholders/AlgoliaSearchPlaceholder"
import { ELASTIC_PILL_KEY_TO_SEARCH_ENTITY } from "app/Scenes/Search/constants"
import { PillType } from "app/Scenes/Search/types"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface SearchResults2Props {
  query: string
  selectedPill: PillType
}

export const SearchResults2: React.FC<SearchResults2Props> = ({ query, selectedPill }) => {
  const space = useSpace()
  const selectedEntity = ELASTIC_PILL_KEY_TO_SEARCH_ENTITY?.[selectedPill.key]

  const queryData = useLazyLoadQuery<ElasticSearchResultsQuery>(elasticSearchResultsQuery, {
    query,
    first: 10,
    entities: [selectedEntity],
  })

  const { data } = usePaginationFragment<
    ElasticSearchResultsQuery,
    ElasticSearchResults_searchConnection$key
  >(searchResultsFragment, queryData)

  const hits = extractNodes(data?.searchConnection)

  return (
    <FlatList
      contentContainerStyle={{ paddingVertical: space("1"), paddingHorizontal: space("2") }}
      data={hits}
      keyExtractor={(item, index) => item.internalID ?? index.toString()}
      // TODO: add analytics
      renderItem={({ item }) => (
        <ElasticSearchResult result={item} selectedPill={selectedPill} query={query} />
      )}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      // TODO: change that with the default empty component
      ListEmptyComponent={() => <Text>No results</Text>}
      ListFooterComponent={
        <Flex alignItems="center" my={2}>
          {/* TODO: add loading */}
          {/* {loading ? <Spinner /> : null} */}
        </Flex>
      }
    />
  )
}

export const ElasticSearchResults2Screen: React.FC<SearchResults2Props> = (props) => (
  // TODO: Add the correct placeholder
  <Suspense
    fallback={
      <ProvidePlaceholderContext>
        <AlgoliaSearchPlaceholder hasRoundedImages={props.selectedPill.key === "artist"} />
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
