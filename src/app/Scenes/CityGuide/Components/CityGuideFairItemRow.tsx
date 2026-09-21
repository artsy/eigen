import { Flex, Box, Text, useSpace } from "@artsy/palette-mobile"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { Fair } from "app/Scenes/CityGuide/utils/types"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { Dimensions, TouchableWithoutFeedback } from "react-native"

const FAIR_IMAGE_SIZE = 58
const FAIR_IMAGE_BORDER_RADIUS = 30

export interface Props {
  item: Fair
  /** Rendered after the text box, narrowing it by the control's own width. Omit to keep the row full-width. */
  saveControl?: React.ReactNode
}

const SAVE_CONTROL_WIDTH = 40

export const CityGuideFairItemRow: React.FC<Props> = ({ item, saveControl }) => {
  const space = useSpace()

  const handleTap = () => {
    navigate(`/fair/${item.slug}`)
  }

  const fairImage = item.image ? item.image.url : null
  const boxWidth =
    Dimensions.get("window").width -
    62 -
    space(4) -
    space(1) -
    (saveControl ? SAVE_CONTROL_WIDTH + space(1) : 0)

  return (
    <TouchableWithoutFeedback accessibilityRole="button" onPress={handleTap}>
      <Flex flexWrap="nowrap" flexDirection="row" alignItems="center" mr={1}>
        <Box width={FAIR_IMAGE_SIZE} borderRadius={FAIR_IMAGE_BORDER_RADIUS} overflow="hidden">
          <ImageWithFallback height={FAIR_IMAGE_SIZE} width={FAIR_IMAGE_SIZE} src={fairImage} />
        </Box>
        <Box width={boxWidth} pl={1}>
          {!!item.name && (
            <Text variant="sm" weight="medium" numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
          )}
          {!!item.counts && !!item.counts.partners && (
            <Text variant="sm" color="mono60" numberOfLines={1} ellipsizeMode="tail">
              {item.counts.partners > 1
                ? `${item.counts.partners} Exhibitors`
                : `${item.counts.partners} Exhibitor`}
            </Text>
          )}
          {!!item.exhibition_period && (
            <Text variant="sm" color="mono60" numberOfLines={1} ellipsizeMode="tail">
              {item.exhibition_period}
            </Text>
          )}
        </Box>
        {!!saveControl && <Box ml={1}>{saveControl}</Box>}
      </Flex>
    </TouchableWithoutFeedback>
  )
}
