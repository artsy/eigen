import { Flex, Text, useSpace } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
// TODO: Replace with Image from @artsy/palette-mobile once the images come from the API.
import { ImageBackground } from "react-native"
import LinearGradient from "react-native-linear-gradient"

const CARD_WIDTH = 150
const CARD_HEIGHT = 250
/** Space kept clear at the title's right so it never runs under the save control. */
const CONTROL_WIDTH = 18
const SCRIM_COLOR = "rgba(0, 0, 0, 0.2)"

interface Props {
  image: string
  title: string
  href: string
  /**
   * A `CityEventFairSaveControl`, injected so this card holds no Relay dependency. Positioned
   * over the image but outside the link, so tapping it saves instead of navigating.
   */
  saveControl?: React.ReactNode
  /** Fired before the link's default navigate-on-press, so a caller can track the tap. */
  onPress?: () => void
}

/**
 * The taller card used by the Current Fairs rail, where the title sits over the image rather
 * than beneath it. Kept separate from `CityEventRailCard` because almost nothing is shared:
 * different proportions, a scrim, an overlaid caption, and a larger type ramp.
 */
export const CityFairRailCard: React.FC<Props> = ({ image, title, href, saveControl, onPress }) => {
  const space = useSpace()

  return (
    <Flex width={CARD_WIDTH} height={CARD_HEIGHT}>
      <RouterLink to={href} disablePrefetch onPress={onPress}>
        <ImageBackground
          source={{ uri: image }}
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <LinearGradient
            testID="city-fair-rail-card-scrim"
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{ position: "absolute", bottom: 0, width: "100%", height: CARD_HEIGHT / 2 }}
          />
          {/* The scrim fills the card and the caption sits inside it, so the two stay in one
              stacking order without absolute positioning. */}
          <Flex flex={1} justifyContent="flex-end" px={1} pb={1} backgroundColor={SCRIM_COLOR}>
            <Flex flexDirection="row" alignItems="flex-end">
              <Flex flex={1}>
                <Text
                  variant="md"
                  color="mono0"
                  // Value intentionally set to match the design value
                  fontSize="26px"
                  numberOfLines={4}
                  fontWeight={500}
                  adjustsFontSizeToFit
                >
                  {title}
                </Text>
              </Flex>

              {!!saveControl && <Flex width={CONTROL_WIDTH} />}
            </Flex>
          </Flex>
        </ImageBackground>
      </RouterLink>

      {!!saveControl && (
        <Flex position="absolute" right={space(1)} bottom={space(1)}>
          {saveControl}
        </Flex>
      )}
    </Flex>
  )
}
