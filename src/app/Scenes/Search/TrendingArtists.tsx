import { TrendingArtists_query$key } from "__generated__/TrendingArtists_query.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { Spacer, Text } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { AutosuggestSearchResult } from "./components/AutosuggestSearchResult"
import { SearchResultList } from "./components/SearchResultList"

interface TrendingArtistsProps {
  data: TrendingArtists_query$key
}

export const TrendingArtists: React.FC<TrendingArtistsProps> = ({ data }) => {
  const result = useFragment(trendingArtistsFragment, data)
  const nodes = extractNodes(result.curatedTrendingArtists)

  return (
    <>
      <Text variant="sm">Trending Artists</Text>
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

const trendingArtistsFragment = graphql`
  fragment TrendingArtists_query on Query {
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
