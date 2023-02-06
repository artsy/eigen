import { Flex, Text } from "@artsy/palette-mobile"
import { SearchResults2Query } from "__generated__/SearchResults2Query.graphql"
import { SearchResults2_searchConnection$key } from "__generated__/SearchResults2_searchConnection.graphql"
import { PillType } from "app/Scenes/Search/types"
import { extractNodes } from "app/utils/extractNodes"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface SearchResults2Props {
  query: string
  selectedPill: PillType
}

export const SearchResults2: React.FC<SearchResults2Props> = ({ query }) => {
  const queryData = useLazyLoadQuery<SearchResults2Query>(searchResultsQuery, {
    query,
    first: 10,
  })

  const { data } = usePaginationFragment<SearchResults2Query, SearchResults2_searchConnection$key>(
    searchResultsFragment,
    queryData
  )

  const hits = extractNodes(data?.searchConnection)

  return (
    <FlatList
      data={hits}
      keyExtractor={(_item, index) => index.toString()}
      renderItem={({ item }) => (
        <Flex>
          <Text>{item.displayLabel}</Text>
        </Flex>
      )}
    />
  )
}

export const SearchResults2Screen: React.FC<SearchResults2Props> = (props) => (
  <Suspense fallback={<Text>Loading</Text>}>
    <SearchResults2 {...props} />
  </Suspense>
)

const searchResultsFragment = graphql`
  fragment SearchResults2_searchConnection on Query
  @refetchable(queryName: "SearchResults2_searchConnectionRefetch")
  @argumentDefinitions(
    query: { type: "String!" }
    first: { type: "Int" }
    cursor: { type: "String" }
    page: { type: "Int" }
  ) {
    searchConnection(first: $first, after: $cursor, page: $page, query: $query, entities: [ARTIST])
      @connection(key: "SearchResults2_searchConnection") {
      edges {
        node {
          __typename
          displayLabel
          href
          imageUrl
          ... on SearchableItem {
            internalID
            displayType
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

const searchResultsQuery = graphql`
  query SearchResults2Query($query: String!, $first: Int, $cursor: String, $page: Int) {
    ...SearchResults2_searchConnection
      @arguments(query: $query, first: $first, cursor: $cursor, page: $page)
  }
`
