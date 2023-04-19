import { EntityHeader } from "@artsy/palette-mobile"
import { PartnerListItem_partner$key } from "__generated__/PartnerListItem_partner.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { uniq } from "lodash"
import { FollowButton } from "app/Components/Button/FollowButton"
import { graphql, useFragment, useMutation } from "react-relay"

interface PartnerListItemProps {
  partner: PartnerListItem_partner$key
  onFollow: () => void
}

export const PartnerListItem: React.FC<PartnerListItemProps> = ({ partner, onFollow }) => {
  const { name, initials, locationsConnection, profile } = useFragment<PartnerListItem_partner$key>(
    PartnerListItemFragment,
    partner
  )

  const locations = extractNodes(locationsConnection)
  const meta = uniq(locations.map((location) => location.city?.trim())).join(", ")

  const [commit, isInFlight] = useMutation(FollowArtistMutation)

  const handleFollowPartner = () => {
    commit({
      variables: {
        input: {
          profileID: profile?.internalID,
          unfollow: !!profile?.isFollowed,
        },
      },
      onCompleted() {
        onFollow()
      },
    })
  }

  const imageUrl = profile?.icon?.url

  return (
    <EntityHeader
      name={name!}
      meta={meta}
      imageUrl={imageUrl ?? undefined}
      initials={initials ?? undefined}
      FollowButton={
        !!profile ? (
          <FollowButton
            haptic
            isFollowed={!!profile.isFollowed}
            onPress={handleFollowPartner}
            loading={isInFlight}
            disabled={isInFlight}
          />
        ) : undefined
      }
    />
  )
}

const FollowArtistMutation = graphql`
  mutation PartnerListItemNewFollowArtistMutation($input: FollowProfileInput!) {
    followProfile(input: $input) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`

const PartnerListItemFragment = graphql`
  fragment PartnerListItem_partner on Partner {
    internalID
    name
    initials
    locationsConnection(first: 15) {
      edges {
        node {
          city
        }
      }
    }
    profile {
      id
      slug
      name
      internalID
      isFollowed
      icon {
        url(version: "square140")
      }
    }
  }
`
