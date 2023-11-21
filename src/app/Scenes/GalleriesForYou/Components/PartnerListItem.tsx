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
import { sortByDistance } from "app/Scenes/GalleriesForYou/helpers"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Location } from "app/utils/hooks/useLocation"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { pluralize } from "app/utils/pluralize"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface PartnerListItemProps {
  partner: PartnerListItem_partner$key
  onPress?(): void
  onFollow?: () => void
  userLocation?: Location | null
}

export const MAX_PARTNER_LIST_ITEM_WIDTH = 480

export const PartnerListItem: React.FC<PartnerListItemProps> = ({
  partner,
  onPress,
  onFollow,
  userLocation,
}) => {
  const space = useSpace()

  const { width: screenWidth } = useScreenDimensions()

  const width = (isTablet() ? MAX_PARTNER_LIST_ITEM_WIDTH : screenWidth) - 2 * space(2)

  const { internalID, initials, locationsConnection, name, profile } = useFragment(
    PartnerListItemFragment,
    partner
  )

  const locations = extractNodes(locationsConnection)
  // Locations sorted by distance to the user's location (if available)
  const sortedLocations = userLocation
    ? sortByDistance(locations as { coordinates?: Location }[], userLocation)
    : locations

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
      <Touchable onPress={handlePress}>
        <Flex width={width} mx="auto">
          <Flex>
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
          </Flex>

          <Flex mt={0.5} justifyContent="space-between" flexDirection="row">
            <Flex mr={1} flexShrink={1}>
              <Text variant="sm">{name}</Text>
              {!!sortedLocations[0] && (
                <Text variant="sm-display" color="black60">
                  {sortedLocations[0].city}
                  {!!(sortedLocations.length > 1) &&
                    ` and ${sortedLocations.length - 1} more ${pluralize(
                      "location",
                      sortedLocations.length - 1
                    )}`}
                </Text>
              )}
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
      </Touchable>
    </Flex>
  )
}

const PartnerListItemFragment = graphql`
  fragment PartnerListItem_partner on Partner {
    internalID
    name
    initials
    locationsConnection(first: 20) {
      edges {
        node {
          city
          coordinates {
            lat
            lng
          }
        }
      }
    }
    profile {
      id
      internalID
      isFollowed
      image {
        url(version: "wide")
      }
    }
  }
`
