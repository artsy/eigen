import { ActionType, ContextModule, OwnerType, TappedArtistGroup } from "@artsy/cohesion"
import { Avatar, Flex, FollowButton, Spacer, Text } from "@artsy/palette-mobile"
import {
  SimilarArtistsRailCell_relatedArtist$data,
  SimilarArtistsRailCell_relatedArtist$key,
} from "__generated__/SimilarArtistsRailCell_relatedArtist.graphql"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { RouterLink } from "app/system/navigation/RouterLink"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface SimilarArtistsRailCellProps {
  relatedArtist: SimilarArtistsRailCell_relatedArtist$key
  index: number
  artistID: string
  artistSlug: string
}

export const SimilarArtistsRailCell: React.FC<SimilarArtistsRailCellProps> = ({
  relatedArtist: relatedArtistProp,
  artistID,
  artistSlug,
  index,
}) => {
  const tracking = useTracking()
  const relatedArtist = useFragment(similarArtistFragment, relatedArtistProp)
  // const [commitMutation] = useFollowArtist()
  const { handleFollowToggle } = useFollowArtist(relatedArtist)

  if (!relatedArtist) {
    return null
  }

  const handleOnPress = () => {
    tracking.trackEvent(tracks.tappedArtistGroup({ relatedArtist, artistID, artistSlug, index }))
  }

  const handleOnFollow = () => {
    handleFollowToggle()

    // commitMutation({
    //   variables: {
    //     input: {
    //       artistID: relatedArtist.internalID,
    //       unfollow: relatedArtist.isFollowed,
    //     },
    //   },
    //   optimisticResponse: {
    //     followArtist: {
    //       artist: {
    //         ...relatedArtist,
    //         isFollowed: !relatedArtist.isFollowed,
    //       },
    //     },
    //   },
    //   onError: (error) => console.error("[RelatedArtistCell]: error on followArtist", error),
    // })
  }

  return (
    <RouterLink onPress={handleOnPress} to={relatedArtist.href}>
      <Flex minWidth={120}>
        <Avatar
          initials={relatedArtist.initials || undefined}
          src={relatedArtist?.thumbnail?.image?.url || undefined}
          size="md"
          blurhash={relatedArtist?.thumbnail?.image?.blurhash}
        />
        <Text variant="xs" numberOfLines={2} textAlign="center" mt={0.5}>
          {relatedArtist.name}
        </Text>

        <Spacer y={0.5} />

        <FollowButton
          isFollowed={!!relatedArtist.isFollowed}
          onPress={() => {
            handleOnFollow()
          }}
          minWidth={120}
          maxWidth={120}
        />
      </Flex>
    </RouterLink>
  )
}

const similarArtistFragment = graphql`
  fragment SimilarArtistsRailCell_relatedArtist on Artist {
    id
    initials
    slug
    internalID @required(action: NONE)
    name @required(action: NONE)
    href @required(action: NONE)
    formattedNationalityAndBirthday
    isFollowed
    thumbnail: coverArtwork {
      image {
        url(version: "large")
        blurhash
      }
    }
    ...useFollowArtist_artist
  }
`

export const tracks = {
  tappedArtistGroup: ({
    relatedArtist,
    artistID,
    artistSlug,
    index,
  }: {
    relatedArtist: NonNullable<SimilarArtistsRailCell_relatedArtist$data>
    artistID: string
    artistSlug: string
    index: number
  }): TappedArtistGroup => ({
    action: ActionType.tappedArtistGroup,
    context_module: ContextModule.relatedArtistsRail,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistID,
    context_screen_owner_slug: artistSlug,
    destination_screen_owner_type: OwnerType.artist,
    destination_screen_owner_slug: relatedArtist.slug,
    destination_screen_owner_id: relatedArtist.internalID,
    horizontal_slide_position: index + 1,
    type: "thumbnail",
  }),
}
