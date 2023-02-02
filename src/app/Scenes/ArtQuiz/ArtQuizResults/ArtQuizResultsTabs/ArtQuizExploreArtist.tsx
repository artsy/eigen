import { ArtQuizExploreArtistFollowArtistMutation } from "__generated__/ArtQuizExploreArtistFollowArtistMutation.graphql"
import {
  ArtQuizExploreArtist_artist$data,
  ArtQuizExploreArtist_artist$key,
} from "__generated__/ArtQuizExploreArtist_artist.graphql"
import { ArtQuizExploreArtists_artworks$data } from "__generated__/ArtQuizExploreArtists_artworks.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { ReadMore } from "app/Components/ReadMore"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { truncatedTextLimit } from "app/utils/hardware"
import { Flex, FollowButton, Spacer, Text, useSpace } from "palette"
import { graphql, useFragment, useMutation } from "react-relay"

export const ArtQuizExploreArtist = ({
  artistData,
}: {
  artistData: ArtQuizExploreArtists_artworks$data[0]["artist"]
}) => {
  const textLimit = truncatedTextLimit()
  const space = useSpace()
  const artist = useFragment<ArtQuizExploreArtist_artist$key>(
    artQuizExploreArtistFragment,
    artistData
  )

  const artworks = extractNodes(artist?.artworksConnection)

  const [followOrUnfollowArtist] =
    useMutation<ArtQuizExploreArtistFollowArtistMutation>(FollowArtistMutation)

  const handleFollowChange = (artist: ArtQuizExploreArtist_artist$data) => {
    followOrUnfollowArtist({
      variables: {
        input: { artistID: artist?.slug!, unfollow: artist?.isFollowed },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            id: artist?.id,
            isFollowed: !artist?.isFollowed,
          },
        },
      },
    })
  }

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
            onPress={() => handleFollowChange(artist!)}
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
}

const artQuizExploreArtistFragment = graphql`
  fragment ArtQuizExploreArtist_artist on Artist {
    id
    slug
    internalID
    name
    href
    isFollowed
    formattedNationalityAndBirthday
    biographyBlurb {
      text
    }
    artworksConnection(first: 15, sort: PUBLISHED_AT_DESC) {
      edges {
        node {
          ...SmallArtworkRail_artworks
        }
      }
    }
  }
`

const FollowArtistMutation = graphql`
  mutation ArtQuizExploreArtistFollowArtistMutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        isFollowed
      }
    }
  }
`
