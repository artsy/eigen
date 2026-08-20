import { FollowButton } from "@artsy/palette-mobile"
import { FairFollowButton_fair$key } from "__generated__/FairFollowButton_fair.graphql"
import { AnalyticsContextProps, useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { ActionNames, ActionTypes, OwnerEntityTypes } from "app/utils/track/schema"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface FairFollowButtonProps {
  fair: FairFollowButton_fair$key
}

export const FairFollowButton: FC<FairFollowButtonProps> = ({ fair }) => {
  const enableFollowShowsAndFairs = useFeatureFlag("AREnableFollowShowsAndFairs")
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const data = useFragment(fragment, fair)
  const { followProfile, isInFlight } = useFollowProfile({
    id: data?.profile?.id ?? "",
    internalID: data?.profile?.internalID ?? "",
    isFollowed: !!data?.profile?.isFollowed,
  })

  if (!enableFollowShowsAndFairs || !data?.profile) {
    return null
  }

  const handlePress = () => {
    trackEvent(tracks.trackFollowFair(data.internalID, !!data.profile?.isFollowed, analytics))
    followProfile()
  }

  return (
    <FollowButton
      isFollowed={!!data.profile.isFollowed}
      onPress={handlePress}
      loading={isInFlight}
      followText={data.profile.isFollowed ? "Saved" : "Save"}
    />
  )
}

const fragment = graphql`
  fragment FairFollowButton_fair on Fair {
    internalID
    profile {
      id
      internalID
      isFollowed
    }
  }
`

const tracks = {
  trackFollowFair: (internalID: string, isFollowed: boolean, analytics: AnalyticsContextProps) => ({
    action_name: isFollowed ? ActionNames.UnfollowFair : ActionNames.FollowFair,
    action_type: ActionTypes.Tap,
    owner_id: internalID,
    owner_type: OwnerEntityTypes.Fair,
    context_screen_owner_id: analytics.contextScreenOwnerId,
    context_screen_owner_slug: analytics.contextScreenOwnerSlug,
    context_screen_owner_type: analytics.contextScreenOwnerType,
  }),
}
