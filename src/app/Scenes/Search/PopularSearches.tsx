import { PopularSearches_query$key } from "__generated__/PopularSearches_query.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { Spacer, Text } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { AutosuggestSearchResult } from "./components/AutosuggestSearchResult"
import { SearchResultList } from "./components/SearchResultList"

interface PopularSearchesProps {
  data: PopularSearches_query$key
}

export const PopularSearches: React.FC<PopularSearchesProps> = ({ data }) => {
  const result = useFragment(popularSearchesFragment, data)
  const nodes = extractNodes(result.curatedTrendingArtists)

  return (
    <>
      <Text variant="sm">Popular Searches</Text>
      <Spacer mb={2} />
      <SearchResultList
        results={nodes.map((node) => (
          <AutosuggestSearchResult
            key={node.internalID}
            result={node as any}
            showResultType
            updateRecentSearchesOnTap={false}
          />
        ))}
      />
    </>
  )
}

const popularSearchesFragment = graphql`
  fragment PopularSearches_query on Query {
    curatedTrendingArtists(first: 3) {
      edges {
        node {
          __typename
          internalID
          slug
          displayLabel
          imageUrl
          href
        }
      }
    }
  }
`
