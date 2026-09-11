import { FollowButton } from "@artsy/palette-mobile"
import { PartnerFollowButtonQuery } from "__generated__/PartnerFollowButtonQuery.graphql"
import { PartnerFollowButton_partner$key } from "__generated__/PartnerFollowButton_partner.graphql"
import { FollowIconButton } from "app/Components/FollowIconButton"
import { AnalyticsContextProps, useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { ActionNames, ActionTypes, OwnerEntityTypes } from "app/utils/track/schema"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface PartnerFollowButtonProps {
  partner: PartnerFollowButton_partner$key
  /**
   * "button" is palette's labelled FollowButton. "icon" is the bare plus/tick the Saves tab's
   * designs use for a followed gallery's row.
   */
  variant?: "button" | "icon"
}

export const PartnerFollowButton: FC<PartnerFollowButtonProps> = ({
  partner,
  variant = "button",
}) => {
  const analytics = useAnalyticsContext()
  const { trackEvent } = useTracking()
  const data = useFragment(fragment, partner)
  const { followProfile, isInFlight } = useFollowProfile({
    id: data?.profile.id ?? "",
    internalID: data?.profile.internalID ?? "",
    isFollowed: !!data?.profile.isFollowed,
  })

  if (!data) {
    return null
  }

  const handleOnPress = () => {
    followProfile()
    trackEvent(tracks.trackFollowPartner(data.internalID, analytics))
  }

  if (variant === "icon") {
    return (
      <FollowIconButton
        testID="partner-follow-icon"
        isFollowed={!!data.profile.isFollowed}
        isInFlight={isInFlight}
        onPress={handleOnPress}
      />
    )
  }

  return (
    <FollowButton
      isFollowed={!!data.profile.isFollowed}
      onPress={handleOnPress}
      loading={isInFlight}
    />
  )
}

const fragment = graphql`
  fragment PartnerFollowButton_partner on Partner {
    internalID @required(action: NONE)
    profile @required(action: NONE) {
      id @required(action: NONE)
      internalID @required(action: NONE)
      slug
      isFollowed
    }
  }
`

interface PartnerFollowButtonQueryRendererProps {
  partnerID: string
  variant?: "button" | "icon"
}

export const PartnerFollowButtonQueryRenderer: FC<PartnerFollowButtonQueryRendererProps> = ({
  partnerID,
  variant = "button",
}) => {
  const data = useLazyLoadQuery<PartnerFollowButtonQuery>(query, { id: partnerID })

  if (!data.partner) {
    // The icon variant renders nothing rather than a dead glyph: unlike the labelled button,
    // a lone plus with no partner behind it reads as broken instead of as "not followed".
    return variant === "icon" ? null : <FollowButton isFollowed={false} />
  }

  return <PartnerFollowButton partner={data.partner} variant={variant} />
}

const query = graphql`
  query PartnerFollowButtonQuery($id: String!) {
    partner(id: $id) {
      ...PartnerFollowButton_partner
    }
  }
`

const tracks = {
  // TODO: action_name is always FollowPartner, should be FollowPartner or UnfollowPartner
  // I've checked other follow partner buttons, and the behavior is the same
  // Should be fixed in a separate PR
  trackFollowPartner: (internalID: string, analytics: AnalyticsContextProps) => ({
    action_name: ActionNames.FollowPartner,
    action_type: ActionTypes.Tap,
    owner_id: internalID,
    owner_type: OwnerEntityTypes.Partner,
    context_screen_owner_id: analytics.contextScreenOwnerId,
    context_screen_owner_slug: analytics.contextScreenOwnerSlug,
    context_screen_owner_type: analytics.contextScreenOwnerType,
  }),
}
