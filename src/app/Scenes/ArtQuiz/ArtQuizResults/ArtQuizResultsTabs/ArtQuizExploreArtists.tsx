import { ArtQuizExploreArtistsFollowArtistMutation } from "__generated__/ArtQuizExploreArtistsFollowArtistMutation.graphql"
import {
  ArtQuizExploreArtists_artworks$data,
  ArtQuizExploreArtists_artworks$key,
} from "__generated__/ArtQuizExploreArtists_artworks.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { ReadMore } from "app/Components/ReadMore"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { truncatedTextLimit } from "app/utils/hardware"
import { Flex, FollowButton, Spacer, Text, useSpace } from "palette"
import { FlatList } from "react-native"
import { graphql, useFragment, useMutation } from "react-relay"

export const ArtQuizExploreArtists = ({
  savedArtworks,
}: {
  savedArtworks: ArtQuizResultsTabs_me$data["quiz"]["savedArtworks"]
}) => {
  const space = useSpace()
  const textLimit = truncatedTextLimit()

  const artists = useFragment<ArtQuizExploreArtists_artworks$key>(
    artQuizExploreArtistsFragment,
    savedArtworks
  )
  const [followOrUnfollowArtist] =
    useMutation<ArtQuizExploreArtistsFollowArtistMutation>(FollowArtistMutation)

  const handleFollowChange = (artist: ArtQuizExploreArtists_artworks$data[0]["artist"]) => {
    followOrUnfollowArtist({
      variables: {
        input: { artistID: artist?.internalID!, unfollow: artist?.isFollowed },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            id: artist?.internalID,
            isFollowed: !artist?.isFollowed,
          },
        },
      },
    })
  }

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
            <Flex pt={2}>
              <Flex flexDirection="row" justifyContent="space-between">
                <Flex>
                  <Text variant="lg-display">{artist?.name}</Text>
                  <Text variant="lg-display" color="black60">
                    {artist?.formattedNationalityAndBirthday}
                  </Text>
                </Flex>
                <Flex>
                  <FollowButton
                    isFollowed={!!artist?.isFollowed}
                    onPress={() => handleFollowChange(artist)}
                  />
                </Flex>
              </Flex>
              <Spacer m={1} />
              <ReadMore
                content={artist?.biographyBlurb?.text!}
                maxChars={textLimit}
                textStyle="new"
                textVariant="sm"
                linkTextVariant="sm-display"
              />
              <Spacer m={1} />
              {/* the negative margin here is for resetting padding of 20 that all the parent
              components of this instance have and to avoid changing the component tree in multiple spots. */}
              <Flex mx={-space(2)}>
                <SmallArtworkRail
                  artworks={artworks}
                  onPress={(artwork) => {
                    navigate(artwork?.href!)
                  }}
                />
              </Flex>
            </Flex>
          )
        }}
        keyExtractor={(item, index) => String(item?.artist?.internalID || index)}
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
      biographyBlurb {
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

const FollowArtistMutation = graphql`
  mutation ArtQuizExploreArtistsFollowArtistMutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        isFollowed
      }
    }
  }
`
