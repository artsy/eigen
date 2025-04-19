import { ActionType, ContextModule, OwnerType, TappedArtistGroup } from "@artsy/cohesion"
import { Flex, FollowButton, Image, Text } from "@artsy/palette-mobile"
import {
  RelatedArtistsRailCell_artist$data,
  RelatedArtistsRailCell_artist$key,
} from "__generated__/RelatedArtistsRailCell_artist.graphql"
import {
  RelatedArtistsRailCell_relatedArtist$data,
  RelatedArtistsRailCell_relatedArtist$key,
} from "__generated__/RelatedArtistsRailCell_relatedArtist.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFollowArtist } from "app/utils/mutations/useFollowArtist"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const DEFAULT_CELL_WIDTH = 300

interface RelatedArtistsRailCellProps {
  relatedArtist: RelatedArtistsRailCell_relatedArtist$key
  artist: RelatedArtistsRailCell_artist$key
  index: number
}

export const RelatedArtistsRailCell: React.FC<RelatedArtistsRailCellProps> = ({
  relatedArtist,
  artist,
  index,
}) => {
  const tracking = useTracking()
  const relatedArtistData = useFragment(relatedArtistQuery, relatedArtist)
  const artistData = useFragment(artistQuery, artist)
  const [commitMutation] = useFollowArtist()

  if (!relatedArtistData || !artistData) {
    return null
  }

  const handleOnPress = () => {
    tracking.trackEvent(tracks.tappedArtistGroup(relatedArtistData, artistData, index))
  }

  const handleOnFollow = () => {
    commitMutation({
      variables: {
        input: {
          artistID: relatedArtistData.internalID,
          unfollow: relatedArtistData.isFollowed,
        },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            ...relatedArtistData,
            isFollowed: !relatedArtistData.isFollowed,
          },
        },
      },
      onError: (error) => console.error("[RelatedArtistCell]: error on followArtist", error),
    })
  }

  return (
    <RouterLink onPress={handleOnPress} to={relatedArtistData.href}>
      <Image
        testID="related-artist-cover"
        src={relatedArtistData.coverArtwork?.image?.url ?? ""}
        aspectRatio={1.3}
        width={DEFAULT_CELL_WIDTH}
      />

      <Flex flexDirection="row" justifyContent="space-between" my={1}>
        <Flex>
          <Text variant="sm-display">{relatedArtistData.name}</Text>
          <Text variant="xs" color="mono60">
            {relatedArtistData.formattedNationalityAndBirthday}
          </Text>
        </Flex>
        <FollowButton isFollowed={!!relatedArtistData.isFollowed} onPress={handleOnFollow} />
      </Flex>
    </RouterLink>
  )
}

const relatedArtistQuery = graphql`
  fragment RelatedArtistsRailCell_relatedArtist on Artist {
    id
    slug
    internalID @required(action: NONE)
    name @required(action: NONE)
    href @required(action: NONE)
    formattedNationalityAndBirthday
    isFollowed
    coverArtwork {
      image {
        url(version: "large")
      }
    }
  }
`

const artistQuery = graphql`
  fragment RelatedArtistsRailCell_artist on Artist {
    slug
    internalID @required(action: NONE)
  }
`

export const tracks = {
  tappedArtistGroup: (
    relatedArtist: NonNullable<RelatedArtistsRailCell_relatedArtist$data>,
    artist: NonNullable<RelatedArtistsRailCell_artist$data>,
    index: number
  ): TappedArtistGroup => ({
    action: ActionType.tappedArtistGroup,
    context_module: ContextModule.relatedArtistsRail,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artist.internalID,
    context_screen_owner_slug: artist.slug,
    destination_screen_owner_type: OwnerType.artist,
    destination_screen_owner_slug: relatedArtist.slug,
    destination_screen_owner_id: relatedArtist.internalID,
    horizontal_slide_position: index + 1,
    type: "thumbnail",
  }),
}
