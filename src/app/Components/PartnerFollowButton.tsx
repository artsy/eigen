import { FollowButton } from "@artsy/palette-mobile"
import { PartnerFollowButtonQuery } from "__generated__/PartnerFollowButtonQuery.graphql"
import { PartnerFollowButton_partner$key } from "__generated__/PartnerFollowButton_partner.graphql"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface PartnerFollowButtonProps {
  partner: PartnerFollowButton_partner$key
}

export const PartnerFollowButton: FC<PartnerFollowButtonProps> = ({ partner }) => {
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
