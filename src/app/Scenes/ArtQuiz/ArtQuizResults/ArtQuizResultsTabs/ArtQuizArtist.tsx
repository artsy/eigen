import { Flex, FollowButton, Spacer, Text } from "@artsy/palette-mobile"
import { ArtQuizArtistFollowArtistMutation } from "__generated__/ArtQuizArtistFollowArtistMutation.graphql"
import {
  ArtQuizArtist_artist$data,
  ArtQuizArtist_artist$key,
} from "__generated__/ArtQuizArtist_artist.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { ReadMore } from "app/Components/ReadMore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { truncatedTextLimit } from "app/utils/hardware"
import { debounce } from "lodash"
import { graphql, useFragment, useMutation } from "react-relay"

export const ArtQuizArtist = ({
  artistData,
}: {
  artistData: ArtQuizArtist_artist$key | null | undefined
}) => {
  const textLimit = truncatedTextLimit()
  const artist = useFragment<ArtQuizArtist_artist$key>(artQuizArtistFragment, artistData)

  const artworks = extractNodes(artist?.artworksConnection)

  const [followOrUnfollowArtist] =
    useMutation<ArtQuizArtistFollowArtistMutation>(FollowArtistMutation)

  const handleFollowChange = debounce((artist?: ArtQuizArtist_artist$data | null) => {
    if (!artist) {
      return
    }

    followOrUnfollowArtist({
      variables: {
        input: { artistID: artist?.slug, unfollow: artist?.isFollowed },
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
  })

  return (
    <Flex pt={2}>
      <RouterLink to={`/artist/${artist?.slug}`}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flex={1}>
            <Text variant="lg-display">{artist?.name}</Text>
            <Text variant="lg-display" color="mono60">
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
        <Spacer y={1} />
        <Flex>
          {!!artist?.biographyBlurb?.text && (
            <ReadMore
              content={artist?.biographyBlurb?.text}
              maxChars={textLimit}
              textStyle="new"
              textVariant="sm"
              linkTextVariant="sm-display"
            />
          )}
        </Flex>
        <Spacer y={2} />
        <Flex mx={-2}>
          <ArtworkRail artworks={artworks} />
        </Flex>
      </RouterLink>
    </Flex>
  )
}

const artQuizArtistFragment = graphql`
  fragment ArtQuizArtist_artist on Artist {
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
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

const FollowArtistMutation = graphql`
  mutation ArtQuizArtistFollowArtistMutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        isFollowed
      }
    }
  }
`
