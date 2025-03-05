import { FollowButton } from "@artsy/palette-mobile"
import { ArtistFollowButtonQuery } from "__generated__/ArtistFollowButtonQuery.graphql"
import { ArtistFollowButton_artist$key } from "__generated__/ArtistFollowButton_artist.graphql"
import { AnalyticsContextProps, useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useFollowArtist } from "app/utils/mutations/useFollowArtist"
import { ActionNames, ActionTypes, OwnerEntityTypes } from "app/utils/track/schema"
import { FC } from "react"
import { useLazyLoadQuery, graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistFollowButtonProps {
  artist: ArtistFollowButton_artist$key
}

export const ArtistFollowButton: FC<ArtistFollowButtonProps> = ({ artist }) => {
  const data = useFragment(fragment, artist)
  const [commitMutation, isInFlight] = useFollowArtist()
  const { trackEvent } = useTracking()
  const analytics = useAnalyticsContext()

  if (!data) {
    return null
  }

  const handleOnPress = () => {
    commitMutation({
      variables: { input: { artistID: data.internalID, unfollow: data.isFollowed } },
      updater: (store) => {
        store.get(data.internalID)?.setValue(!data.isFollowed, "isFollowed")
      },
    })

    trackEvent(
      tracks.trackFollowUnfollow({
        analytics,
        isFollowed: data.isFollowed,
        internalID: data.internalID,
        slug: data.slug,
      })
    )
  }

  return <FollowButton isFollowed={data.isFollowed} onPress={handleOnPress} loading={isInFlight} />
}

const fragment = graphql`
  fragment ArtistFollowButton_artist on Artist {
    internalID @required(action: NONE)
    isFollowed @required(action: NONE)
    slug
  }
`

interface ArtistFollowButtonQueryRendererProps {
  artistID: string
}

export const ArtistFollowButtonQueryRenderer: FC<ArtistFollowButtonQueryRendererProps> = ({
  artistID,
}) => {
  const data = useLazyLoadQuery<ArtistFollowButtonQuery>(query, { id: artistID })

  if (!data.artist) {
    return <FollowButton isFollowed={false} />
  }

  return <ArtistFollowButton artist={data.artist} />
}

const query = graphql`
  query ArtistFollowButtonQuery($id: String!) {
    artist(id: $id) {
      ...ArtistFollowButton_artist
    }
  }
`

const tracks = {
  trackFollowUnfollow: ({
    analytics,
    isFollowed,
    internalID,
    slug,
  }: {
    isFollowed: boolean
    internalID: string
    slug: string
    analytics: AnalyticsContextProps
  }) => ({
    action_name: isFollowed ? ActionNames.ArtistUnfollow : ActionNames.ArtistFollow,
    action_type: ActionTypes.Success,
    owner_id: internalID,
    owner_slug: slug,
    owner_type: OwnerEntityTypes.Artist,
    context_screen_owner_id: analytics.contextScreenOwnerId,
    context_screen_owner_slug: analytics.contextScreenOwnerSlug,
    context_screen_owner_type: analytics.contextScreenOwnerType,
  }),
}
