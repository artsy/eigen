import { FollowButton } from "@artsy/palette-mobile"
import { PartnerFollowButtonQuery } from "__generated__/PartnerFollowButtonQuery.graphql"
import { PartnerFollowButton_partner$key } from "__generated__/PartnerFollowButton_partner.graphql"
import { AnalyticsContextProps, useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { ActionNames, ActionTypes, OwnerEntityTypes } from "app/utils/track/schema"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface PartnerFollowButtonProps {
  partner: PartnerFollowButton_partner$key
}

export const PartnerFollowButton: FC<PartnerFollowButtonProps> = ({ partner }) => {
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
}

export const PartnerFollowButtonQueryRenderer: FC<PartnerFollowButtonQueryRendererProps> = ({
  partnerID,
}) => {
  const data = useLazyLoadQuery<PartnerFollowButtonQuery>(query, { id: partnerID })

  if (!data.partner) {
    return <FollowButton isFollowed={false} />
  }

  return <PartnerFollowButton partner={data.partner} />
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
