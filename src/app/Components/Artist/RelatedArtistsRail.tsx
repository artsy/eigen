import { Flex, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { RelatedArtistsRail_artists$key } from "__generated__/RelatedArtistsRail_artists.graphql"
import { RelatedArtistsRailCell } from "app/Components/Artist/RelatedArtistsRailCell"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface RelatedArtistsRailProps {
  artists: RelatedArtistsRail_artists$key
}

export const RelatedArtistsRail: React.FC<RelatedArtistsRailProps> = ({ artists }) => {
  const data = useFragment(query, artists)
  const space = useSpace()

  if (!data) {
    return null
  }

  return (
    <Flex>
      <Text pb={4} px={2}>
        Related Artists
      </Text>

      <FlatList
        data={data}
        renderItem={({ item }) => <RelatedArtistsRailCell artist={item} />}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        keyExtractor={(item) => `related-artists-rail-item-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginHorizontal: space(2) }}
      />
    </Flex>
  )
}

const query = graphql`
  fragment RelatedArtistsRail_artists on Artist @relay(plural: true) {
    id
    ...RelatedArtistsRailCell_artist
  }
`
