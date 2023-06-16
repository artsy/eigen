import {
  Flex,
  FollowButton,
  Text,
  Touchable,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { PartnerListItem_partner$key } from "__generated__/PartnerListItem_partner.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { uniq } from "lodash"
import { graphql, useFragment } from "react-relay"

interface PartnerListItemProps {
  partner: PartnerListItem_partner$key
  onPress?(): void
  onFollow?: () => void
}

export const MAX_PARTNER_LIST_ITEM_WIDTH = 700

export const PartnerListItem: React.FC<PartnerListItemProps> = ({ partner, onPress, onFollow }) => {
  const isTablet = isPad()
  const space = useSpace()

  const { width: screenWidth } = useScreenDimensions()

  const width = (isTablet ? MAX_PARTNER_LIST_ITEM_WIDTH : screenWidth) - 2 * space(2)

  const { internalID, initials, locationsConnection, name, profile } = useFragment(
    PartnerListItemFragment,
    partner
  )

  const cities = uniq(extractNodes(locationsConnection).map((location) => location.city)).join(
    " • "
  )

  const hasMoreCities = locationsConnection?.pageInfo?.hasNextPage

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

  const imageUrl = profile?.image?.url

  const showInitials = !imageUrl && !!initials

  return (
    <Flex mx={2}>
      <Flex width={width} mx="auto">
        <Touchable onPress={handlePress}>
          <OpaqueImageView imageURL={imageUrl} aspectRatio={1.33} width={width} />

          {!!showInitials && (
            <Flex
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              justifyContent="center"
            >
              <Flex mx="auto">
                <Text variant="lg-display">{initials}</Text>
              </Flex>
            </Flex>
          )}
        </Touchable>

        <Flex mt={0.5} justifyContent="space-between" flexDirection="row">
          <Flex mr={1} flexShrink={1}>
            <Text variant="sm">{name}</Text>
            <Text variant="sm-display" color="black60">
              {cities}
              {!!hasMoreCities && "..."}
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
    </Flex>
  )
}

const PartnerListItemFragment = graphql`
  fragment PartnerListItem_partner on Partner {
    internalID
    name
    initials
    locationsConnection(first: 5) {
      pageInfo {
        hasNextPage
      }
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
        url(version: ["large", "medium"])
      }
    }
  }
`
