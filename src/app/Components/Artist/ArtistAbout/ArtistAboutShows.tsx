import { ArtistAboutShows_artist } from "__generated__/ArtistAboutShows_artist.graphql"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useScreenDimensions } from "../../../utils/useScreenDimensions"
import { ArtistShowFragmentContainer } from "../ArtistShows/ArtistShow"

interface Props {
  artist: ArtistAboutShows_artist
}

const ArtistAboutShows: React.FC<Props> = ({ artist }) => {
  const currentShows = extractNodes(artist.currentShows)
  const upcomingShows = extractNodes(artist.upcomingShows)
  const currentAndUpcomingShows = [...currentShows, ...upcomingShows]

  const pastShows = extractNodes(artist.pastShows)
  const screenWidth = useScreenDimensions().width

  // We show the current and upcoming shows. If no current/upcoming, we show the 3 past shows
  // See https://artsyproduct.atlassian.net/browse/CX-743 for business rules
  const shownShows = currentAndUpcomingShows.length > 0 ? currentAndUpcomingShows : pastShows

  const userHasShows = currentAndUpcomingShows.length + pastShows.length

  if (userHasShows) {
    return (
      <Flex>
        <Text variant="md" mb={1}>
          Shows featuring {artist.name}
        </Text>
        <FlatList
          data={shownShows}
          renderItem={({ item }) => (
            <ArtistShowFragmentContainer
              show={item}
              styles={{
                container: {
                  width: 335,
                  marginRight: 15,
                },
                image: {
                  width: 335,
                  height: 220,
                  marginBottom: 10,
                },
              }}
            />
          )}
          ItemSeparatorComponent={() => <Spacer width={10} />}
          keyExtractor={(show) => show.id}
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{ left: -20, width: screenWidth }}
          contentContainerStyle={{ paddingBottom: 15, paddingLeft: 20 }}
        />
        {!!pastShows.length && (
          <Button
            variant="fillGray"
            onPress={() => navigate(`/artist/${artist?.slug!}/shows`)}
            size="small"
            block
          >
            See all past shows
          </Button>
        )}
      </Flex>
    )
  }

  // If the user has no past/current/upcoming shows
  return null
}

export const ArtistAboutShowsFragmentContainer = createFragmentContainer(ArtistAboutShows, {
  artist: graphql`
    fragment ArtistAboutShows_artist on Artist {
      name
      slug
      currentShows: showsConnection(status: "running", first: 10) {
        edges {
          node {
            id
            ...ArtistShow_show
          }
        }
      }
      upcomingShows: showsConnection(status: "upcoming", first: 10) {
        edges {
          node {
            id
            ...ArtistShow_show
          }
        }
      }
      pastShows: showsConnection(status: "closed", first: 3) {
        edges {
          node {
            id
            ...ArtistShow_show
          }
        }
      }
    }
  `,
})
