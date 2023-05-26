import {
  Flex,
  FollowButton,
  Text,
  Touchable,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { GalleryListItem_partner$key } from "__generated__/GalleryListItem_partner.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { graphql, useFragment } from "react-relay"

interface GalleryListItemProps {
  partner: GalleryListItem_partner$key
  onPress?(): void
  onFollow?: () => void
}

const MAX_WIDTH = 295

export const GalleryListItem: React.FC<GalleryListItemProps> = ({ partner, onPress, onFollow }) => {
  const isTablet = isPad()
  const space = useSpace()

  const { width: screenWidth } = useScreenDimensions()

  const width = isTablet ? MAX_WIDTH : screenWidth

  const { internalID, locationsConnection, name, profile } = useFragment(
    GalleryListItemFragment,
    partner
  )

  const cities = extractNodes(locationsConnection)
    .map((location) => location.city)
    .join(" • ")

  const { followProfile, isInFlight } = useFollowProfile({
    id: profile?.id!,
    internalID: profile?.internalID!,
    isFollowd: profile?.isFollowed!,
    onCompleted: onFollow,
  })

  const handleFollowPartner = () => {
    followProfile()
  }

  const handlePress = () => {
    navigate("/partner/" + internalID)

    onPress?.()
  }

  if (!profile) {
    return null
  }

  return (
    <Flex mx={2}>
      <Touchable onPress={handlePress}>
        <OpaqueImageView
          imageURL={profile?.image?.url}
          aspectRatio={1.33}
          width={width - 2 * space(2)}
        />
      </Touchable>

      <Flex mt={0.5} justifyContent="space-between" flexDirection="row">
        <Flex mr={1} flexShrink={1}>
          <Text variant="sm">{name}</Text>
          <Text variant="sm" color="black60">
            {cities}
          </Text>
        </Flex>

        <Flex mt={0.5}>
          <FollowButton
            haptic
            isFollowed={!!profile?.isFollowed}
            onPress={handleFollowPartner}
            disabled={isInFlight}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

const GalleryListItemFragment = graphql`
  fragment GalleryListItem_partner on Partner {
    internalID
    name
    initials
    locationsConnection(first: 5) {
      edges {
        node {
          city
        }
      }
    }
    profile {
      id
      internalID
      isFollowed
      image {
        url(version: "large")
      }
    }
  }
`

const FollowProfileMutation = graphql`
  mutation GalleryListItemFollowProfileMutation($input: FollowProfileInput!) {
    followProfile(input: $input) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`
