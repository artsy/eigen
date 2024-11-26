import { Box, Button, Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { HeroUnitItem } from "app/Scenes/HomeView/Sections/HomeViewSectionHeroUnits"
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { PixelRatio } from "react-native"

interface HeroUnitProps {
  item: HeroUnitItem
  onPress?: () => void
}

const fontScale = PixelRatio.getFontScale()

export const HERO_UNIT_CARD_HEIGHT = 250 * fontScale
const CARD_IMAGE_WIDTH = 125
const DESCRIPTION_LINES = fontScale > 1 ? 4 : 3

export const HeroUnit: React.FC<HeroUnitProps> = ({ item, onPress }) => {
  const { width: screenWidth } = useScreenDimensions()
  const cardImageWidth = screenWidth > 700 ? screenWidth / 2 : CARD_IMAGE_WIDTH
  const imageSrc = item.image?.imageURL ?? ""

  const handlePress = () => {
    onPress?.()

    if (item.link.url) {
      navigate(item.link.url)
    }
  }

  return (
    <Touchable key={item.internalID} onPress={handlePress}>
      <Flex bg="black100" flexDirection="row" height={HERO_UNIT_CARD_HEIGHT} width={screenWidth}>
        <Image height={HERO_UNIT_CARD_HEIGHT} src={imageSrc} width={cardImageWidth} />
        <Box p={2} width={screenWidth - cardImageWidth}>
          <Text color="white100" mb={1} numberOfLines={2} variant="lg-display">
            {item.title}
          </Text>
          <Text color="white100" mb={2} numberOfLines={DESCRIPTION_LINES}>
            {item.body}
          </Text>
          <Button size="small" variant="outlineLight" onPress={handlePress}>
            {item.link.text}
          </Button>
        </Box>
      </Flex>
    </Touchable>
  )
}
