import { AddStrokeIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
// TODO: Replace with Image from @artsy/palette-mobile once the images come from the API.
import { ImageBackground } from "react-native"

const CARD_WIDTH = 150
const CARD_HEIGHT = 250
const ADD_ICON_SIZE = 18
/** The designs darken the image so the white title stays legible over any artwork. */
const SCRIM_COLOR = "rgba(0, 0, 0, 0.2)"

interface Props {
  image: string
  title: string
  /** Where a tap goes — the fair's own page. */
  href: string
}

/**
 * The taller card used by the Current Fairs rail, where the title sits over the image rather
 * than beneath it. Kept separate from `CityEventRailCard` because almost nothing is shared:
 * different proportions, a scrim, an overlaid caption, and a larger type ramp.
 */
export const CityFairRailCard: React.FC<Props> = ({ image, title, href }) => {
  return (
    // Whole card is the tap target — same reasoning as CityEventRailCard.
    <RouterLink to={href} style={{ width: CARD_WIDTH }}>
      <ImageBackground
        source={{ uri: image }}
        resizeMode="cover"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        {/* The scrim fills the card and the caption sits inside it, so the two stay in one
          stacking order without absolute positioning. */}
        <Flex flex={1} justifyContent="flex-end" px={1} pb={1} backgroundColor={SCRIM_COLOR}>
          <Flex flexDirection="row" alignItems="flex-end">
            <Flex flex={1}>
              <Text variant="lg-display" color="mono0">
                {title}
              </Text>
            </Flex>

            {/* The save control in the real feature — see CityEventRailCard. */}
            <AddStrokeIcon width={ADD_ICON_SIZE} height={ADD_ICON_SIZE} fill="mono0" />
          </Flex>
        </Flex>
      </ImageBackground>
    </RouterLink>
  )
}
