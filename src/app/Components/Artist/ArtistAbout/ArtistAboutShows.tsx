import { Spacer, Flex, Text, useScreenDimensions, useTheme } from "@artsy/palette-mobile"
import { ArtistAboutShows_artist$data } from "__generated__/ArtistAboutShows_artist.graphql"
import { ArtistAboutShow } from "app/Components/Artist/ArtistAbout/ArtistAboutShow"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artist: ArtistAboutShows_artist$data
}

const ArtistAboutShows: React.FC<Props> = ({ artist }) => {
  const shows = extractNodes(artist?.showsConnection)
  const { width } = useScreenDimensions()
  const { space } = useTheme()

  if (shows.length === 0 || !artist) {
    return null
  }

  return (
    <Flex>
      <Text variant="sm-display" pb={4}>
        Shows Featuring {artist.name}
      </Text>
      <FlatList
        data={shows}
        renderItem={({ item }) => <ArtistAboutShow show={item} />}
        ItemSeparatorComponent={() => <Spacer x={2} />}
        keyExtractor={(show) => show.internalID}
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{ paddingRight: space(4) }}
        style={{ width }}
      />
    </Flex>
  )
}

export const ArtistAboutShowsFragmentContainer = createFragmentContainer(ArtistAboutShows, {
  artist: graphql`
    fragment ArtistAboutShows_artist on Artist {
      name @required(action: NONE)
      slug @required(action: NONE)
      showsConnection(first: 12, sort: END_AT_ASC, status: "running") {
        edges {
          node {
            internalID
            ...ArtistAboutShow_show
          }
        }
      }
    }
  `,
})
