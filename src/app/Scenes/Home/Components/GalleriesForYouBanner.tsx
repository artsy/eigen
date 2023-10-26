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
import { Image } from "react-native"
import { isTablet } from "react-native-device-info"
import LinearGradient from "react-native-linear-gradient"
import { useTracking } from "react-tracking"

const IMAGE_ASPECT_RATIO = 0.74

interface GalleriesForYouBannerProps {
  mb?: SpacingUnit
}

export const GalleriesForYouBanner: React.FC<GalleriesForYouBannerProps> = ({ mb }) => {
  const { width } = useScreenDimensions()
  const height = width / IMAGE_ASPECT_RATIO

  const tracking = useTracking()

  const handlePress = () => {
    tracking.trackEvent(tracks.tappedExplore())

    navigate("/galleries-for-you")
  }

  return (
    <Flex mb={mb} height={height}>
      <Touchable onPress={handlePress}>
        <Flex>
          <Flex position="absolute" top={0}>
            <Image
              source={require("images/galleries_for_you.webp")}
              style={{ width: width, height: width / IMAGE_ASPECT_RATIO }}
              resizeMode={isTablet() ? "contain" : "cover"}
            />
            <LinearGradient
              colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "40%",
                bottom: 0,
              }}
            />
          </Flex>

          <Flex justifyContent="flex-end" height="100%" px={2} pb={2}>
            <Text variant="lg-display" color="white100">
              Galleries Near You
            </Text>

            <Flex mt={0.5} justifyContent="space-between" flexDirection="row">
              <Flex flex={1} mr={2}>
                <Text variant="sm-display" color="white100">
                  Follow these local galleries for updates on artists you love.
                </Text>
              </Flex>

              <Flex mt={0.5}>
                <Button variant="outlineLight" size="small" onPress={handlePress}>
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
