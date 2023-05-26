import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Button,
  Flex,
  SpacingUnit,
  Text,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { isPad } from "app/utils/hardware"
import { Location, useLocationOrIpAddress } from "app/utils/hooks/useLocationOrIpAddress"
import { PlaceholderBox } from "app/utils/placeholders"
import { Suspense } from "react"
import { Image } from "react-native"
import { useTracking } from "react-tracking"

const IMAGE_ASPECT_RATIO = 0.74

interface GalleriesForYouBannerProps {
  location?: Location | null
  ipAddress?: string | null
  mb?: SpacingUnit
}

export const GalleriesForYouBanner: React.FC<GalleriesForYouBannerProps> = ({ location, mb }) => {
  const { width } = useScreenDimensions()
  const height = width / IMAGE_ASPECT_RATIO

  const isTablet = isPad()
  const tracking = useTracking()

  const handlePress = () => {
    navigate("/galleries-for-you")
    tracking.trackEvent(tracks.tappedExplore())
  }

  return (
    <Flex mb={mb} height={height}>
      <Touchable onPress={handlePress}>
        <Flex>
          <Flex position="absolute" top={0}>
            <Image
              source={require("images/galleries_for_you.webp")}
              style={{ width: width, height: width / IMAGE_ASPECT_RATIO }}
              resizeMode={isTablet ? "contain" : "cover"}
            />
          </Flex>

          <Flex justifyContent="flex-end" height="100%" px={2} pb={2}>
            <Text variant="lg" color="white100">
              Galleries Near You
            </Text>

            <Flex mt={0.5} justifyContent="space-between" flexDirection="row">
              <Flex flex={1} mr={2}>
                <Text variant="sm" color="white100">
                  Follow these local galleries for updates on artists you love.
                </Text>
              </Flex>

              <Flex mt={0.5}>
                <Button variant="outlineLight" size="small">
                  Explore
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Touchable>
    </Flex>
  )
}

export const tracks = {
  tappedExplore: (showID?: string, gallerieslug?: string, index?: number) => ({
    action: ActionType.tappedShowMore,
    context_module: ContextModule.galleriesForYouBanner,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.galleriesForYou,
    destination_screen_owner_id: showID,
    destination_screen_owner_slug: gallerieslug,
    horizontal_slide_position: index,
    type: "header",
  }),
}

interface GalleriesForYouBannerContainerProps {
  mb?: SpacingUnit
}

export const GalleriesForYouBannerContainer: React.FC<GalleriesForYouBannerContainerProps> = (
  props
) => {
  const { location, ipAddress, isLoading } = useLocationOrIpAddress()

  if (isLoading) {
    return <GalleriesForYouBannerPlaceholder />
  }

  return (
    <Suspense fallback={<GalleriesForYouBannerPlaceholder />}>
      <GalleriesForYouBanner {...props} location={location} ipAddress={ipAddress} />
    </Suspense>
  )
}

const GalleriesForYouBannerPlaceholder: React.FC = () => {
  const { width } = useScreenDimensions()

  return <PlaceholderBox width={width} height={width / IMAGE_ASPECT_RATIO} />
}
