import { PopularSearches_query$key } from "__generated__/PopularSearches_query.graphql"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Join, Spacer, Text } from "palette"
import { TouchableOpacity } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface PopularSearchesProps {
  data: PopularSearches_query$key
}

export const PopularSearches: React.FC<PopularSearchesProps> = ({ data }) => {
  const result = useFragment(popularSearchesFragment, data)
  const nodes = extractNodes(result.curatedTrendingArtists)

  const handlePress = (slug: string) => {
    navigate(`/artist/${slug}`)
  }

  return (
    <>
      <Text variant="sm">Popular Searches</Text>
      <Spacer mb={2} />
      <Join separator={<Spacer mb={2} />}>
        {nodes.map((node) => {
          return (
            <TouchableOpacity key={node.internalID} onPress={() => handlePress(node.slug)}>
              <Text variant="xs">{node.name}</Text>
              <Text variant="xs" color="black60">
                Artist
              </Text>
            </TouchableOpacity>
          )
        })}
      </Join>
    </>
  )
}

const popularSearchesFragment = graphql`
  fragment PopularSearches_query on Query {
    curatedTrendingArtists(first: 3) {
      edges {
        node {
          internalID
          slug
          name
        }
      }
    }
  }
`
