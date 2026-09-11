import { Button } from "@artsy/palette-mobile"
import { FairFollowButton_fair$key } from "__generated__/FairFollowButton_fair.graphql"
import { FollowIconButton } from "app/Components/FollowIconButton"
import { AnalyticsContextProps, useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { ActionNames, ActionTypes, OwnerEntityTypes } from "app/utils/track/schema"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface FairFollowButtonProps {
  fair: FairFollowButton_fair$key
  /**
   * "button" is the labelled Save/Saved button. "icon" is the bare plus/tick the Saves tab's
   * designs use for a followed fair's row.
   */
  variant?: "button" | "icon"
}

export const FairFollowButton: FC<FairFollowButtonProps> = ({ fair, variant = "button" }) => {
  const enableFollowShowsAndFairs = useFeatureFlag("AREnableFollowShowsAndFairs")
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const data = useFragment(fragment, fair)
  const { followProfile, isInFlight } = useFollowProfile({
    id: data?.profile?.id ?? "",
    internalID: data?.profile?.internalID ?? "",
    isFollowed: !!data?.profile?.isFollowed,
    onError: () => {
      console.error("FairFollowButton: followProfile mutation failed")
    },
  })

  if (!enableFollowShowsAndFairs || !data?.profile) {
    return null
  }

  const handlePress = () => {
    trackEvent(tracks.trackFollowFair(data.internalID, !!data.profile?.isFollowed, analytics))
    followProfile()
  }

  if (variant === "icon") {
    return (
      <FollowIconButton
        testID="fair-follow-icon"
        isFollowed={!!data.profile.isFollowed}
        isInFlight={isInFlight}
        onPress={handlePress}
      />
    )
  }

  return (
    <Button
      variant={data.profile.isFollowed ? "outline" : "fillDark"}
      size="small"
      onPress={handlePress}
      loading={isInFlight}
      longestText="Saved"
    >
      {data.profile.isFollowed ? "Saved" : "Save"}
    </Button>
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
