import { Spacer, Flex, Text } from "@artsy/palette-mobile"
import { ArtQuizArtistFollowArtistMutation } from "__generated__/ArtQuizArtistFollowArtistMutation.graphql"
import {
  ArtQuizArtist_artist$data,
  ArtQuizArtist_artist$key,
} from "__generated__/ArtQuizArtist_artist.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { ReadMore } from "app/Components/ReadMore"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { truncatedTextLimit } from "app/utils/hardware"
import { debounce } from "lodash"
import { FollowButton } from "app/Components/Button/FollowButton"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment, useMutation } from "react-relay"

export const ArtQuizArtist = ({ artistData }: { artistData: ArtQuizArtist_artist$key | null }) => {
  const textLimit = truncatedTextLimit()
  const artist = useFragment<ArtQuizArtist_artist$key>(artQuizArtistFragment, artistData)

  const artworks = extractNodes(artist?.artworksConnection)

  const [followOrUnfollowArtist] =
    useMutation<ArtQuizArtistFollowArtistMutation>(FollowArtistMutation)

  const handleFollowChange = debounce((artist: ArtQuizArtist_artist$data) => {
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
  })

  return (
    <Flex pt={2}>
      <TouchableOpacity
        onPress={() => {
          navigate(`/artist/${artist?.slug}`)
        }}
      >
        <Flex px={2} flexDirection="row" justifyContent="space-between">
          <Flex flex={1}>
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
        <Spacer y={1} />
        <Flex px={2}>
          <ReadMore
            content={artist?.biographyBlurb?.text!}
            maxChars={textLimit}
            textStyle="new"
            textVariant="sm"
            linkTextVariant="sm-display"
          />
        </Flex>
        <Spacer y={2} />
        <SmallArtworkRail
          artworks={artworks}
          onPress={(artwork) => {
            navigate(artwork?.href!)
          }}
        />
      </TouchableOpacity>
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
          ...SmallArtworkRail_artworks
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
