import { Flex, Spacer, Spinner, useSpace } from "@artsy/palette-mobile"
import { SimilarArtistsRailQuery } from "__generated__/SimilarArtistsRailQuery.graphql"
import { SimilarArtistsRail_artist$key } from "__generated__/SimilarArtistsRail_artist.graphql"
import { SimilarArtistsRailCell } from "app/Components/Artist/SimilarArtistsRailCell"
import { CallapseWithTitle } from "app/Scenes/Favorites/Components/CollapseWithTitle"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { FlatList } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface SimilarArtistsRailProps {
  artist: SimilarArtistsRail_artist$key
  showSimilarArtists: boolean
}

export const SimilarArtistsRail: React.FC<SimilarArtistsRailProps> = ({
  artist: artistProp,
  showSimilarArtists,
}) => {
  const artist = useFragment(artistFragment, artistProp)
  const space = useSpace()

  const relatedArtists = extractNodes(artist.related?.suggestedConnection)

  if (!relatedArtists.length) {
    return null
  }

  if (!showSimilarArtists) {
    return null
  }

  return (
    <CallapseWithTitle title="Similar Artists" expanded>
      <Flex
        pb={2}
        mx={-2} // This is required to make sure the horizontal scroll isn't cut
      >
        <FlatList
          data={relatedArtists}
          renderItem={({ item, index }) => (
            <Flex>
              <SimilarArtistsRailCell
                relatedArtist={item}
                artistID={artist.internalID}
                artistSlug={artist.slug}
                index={index}
              />
            </Flex>
          )}
          ItemSeparatorComponent={() => <Spacer x={2} />}
          ListFooterComponent={<Spacer x={4} />}
          keyExtractor={(item) => `related-artists-rail-item-${item.internalID}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space(2) }}
        />
      </Flex>
    </CallapseWithTitle>
  )
}

const artistFragment = graphql`
  fragment SimilarArtistsRail_artist on Artist {
    internalID
    slug
    related {
      suggestedConnection(first: 10, excludeFollowedArtists: true) {
        edges {
          node {
            internalID
            ...SimilarArtistsRailCell_relatedArtist
          }
        }
      }
    }
  }
`

const similarArtistsRailQuery = graphql`
  query SimilarArtistsRailQuery($artistID: String!) {
    artist(id: $artistID) @required(action: LOG) {
      ...SimilarArtistsRail_artist
    }
  }
`
export const SimilarArtistsRailQueryRenderer: React.FC<{
  artistID: string
  showSimilarArtists?: boolean
}> = withSuspense({
  Component: ({ artistID, showSimilarArtists }) => {
    const data = useLazyLoadQuery<SimilarArtistsRailQuery>(similarArtistsRailQuery, {
      artistID,
    })

    if (!data?.artist) {
      return null
    }

    return <SimilarArtistsRail artist={data.artist} showSimilarArtists={!!showSimilarArtists} />
  },
  LoadingFallback: () => <Spinner />,
  ErrorFallback: NoFallback,
})
