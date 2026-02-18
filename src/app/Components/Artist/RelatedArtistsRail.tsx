import { Flex, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { ArtistAbout_artist$data } from "__generated__/ArtistAbout_artist.graphql"
import { RelatedArtistsRail_artists$key } from "__generated__/RelatedArtistsRail_artists.graphql"
import { RelatedArtistsRailCell } from "app/Components/Artist/RelatedArtistsRailCell"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface RelatedArtistsRailProps {
  artists: RelatedArtistsRail_artists$key
  artist: ArtistAbout_artist$data
}

export const RelatedArtistsRail: React.FC<RelatedArtistsRailProps> = ({ artists, artist }) => {
  const artistsData = useFragment(artistsQuery, artists)

  const space = useSpace()

  if (!artistsData) {
    return null
  }

  return (
    <Flex>
      <Text pb={4} px={2}>
        Related Artists
      </Text>
      <FlatList
        data={artistsData}
        renderItem={({ item, index }) => (
          <RelatedArtistsRailCell relatedArtist={item} index={index} artist={artist} />
        )}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        ListFooterComponent={() => <Spacer x={4} />}
        keyExtractor={(item) => `related-artists-rail-item-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginHorizontal: space(2) }}
      />
    </Flex>
  )
}

const artistsQuery = graphql`
  fragment RelatedArtistsRail_artists on Artist @relay(plural: true) {
    id
    ...RelatedArtistsRailCell_relatedArtist
  }
`
