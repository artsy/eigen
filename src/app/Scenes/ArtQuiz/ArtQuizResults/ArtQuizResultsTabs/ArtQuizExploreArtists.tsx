import { ArtQuizExploreArtists_artworks$key } from "__generated__/ArtQuizExploreArtists_artworks.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, FollowButton, Text, useSpace } from "palette"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

export const ArtQuizExploreArtists = ({
  savedArtworks,
}: {
  savedArtworks: ArtQuizResultsTabs_me$data["quiz"]["savedArtworks"]
}) => {
  const space = useSpace()

  const artists = useFragment<ArtQuizExploreArtists_artworks$key>(
    artQuizExploreArtistsFragment,
    savedArtworks
  )

  // const handleFollowChange = (followArtist) => {
  //   console.log("Follow :: ", followArtist)
  // }

  return (
    <StickyTabPageScrollView
      contentContainerStyle={{
        paddingVertical: space(2),
      }}
    >
      <FlatList
        data={artists}
        renderItem={({ item }) => {
          const artist = item.artist
          const artworks = extractNodes(artist?.artworksConnection)
          return (
            <Flex>
              <Flex>
                <Text variant="lg-display">{artist?.name}</Text>
                <Text variant="lg-display" color="black60">
                  {artist?.formattedNationalityAndBirthday}
                </Text>
                {/* {!!onFollow && (
            <Flex>
              <FollowButton isFollowed={!!artist.isFollowed} onPress={onFollow} />
            </Flex>
          )} */}
                <Flex>
                  <FollowButton
                    isFollowed={!!artist?.isFollowed}
                    onPress={() => handleFollowChange(artist)}
                  />
                </Flex>
              </Flex>
              <SmallArtworkRail
                artworks={artworks}
                onPress={(artwork) => {
                  navigate(artwork?.href!)
                }}
              />
            </Flex>
          )
        }}
      />
    </StickyTabPageScrollView>
  )
}

const artQuizExploreArtistsFragment = graphql`
  fragment ArtQuizExploreArtists_artworks on Artwork @relay(plural: true) {
    artist {
      internalID
      name
      href
      isFollowed
      formattedNationalityAndBirthday
      biographyBlurb(format: HTML, partnerBio: false) {
        credit
        text
      }
      artworksConnection(first: 25, sort: PUBLISHED_AT_DESC) {
        edges {
          node {
            ...SmallArtworkRail_artworks
            internalID
          }
        }
      }
    }
  }
`
