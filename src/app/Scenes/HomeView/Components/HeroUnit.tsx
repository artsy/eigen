import { Box, Button, Flex, Image, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useScreenDimensions } from "app/utils/hooks"
import { memo } from "react"
import { PixelRatio } from "react-native"

interface HeroUnitItem {
  internalID?: string
  title: string
  body: string | null | undefined
  imageSrc: string
  url: string
  buttonText: string
}

interface HeroUnitItemProps {
  item: HeroUnitItem
  onPress?: () => void
}

const fontScale = PixelRatio.getFontScale()

export const HERO_UNIT_CARD_HEIGHT = 250 * fontScale
const CARD_IMAGE_WIDTH = 125
const DESCRIPTION_LINES = fontScale > 1 ? 4 : 3

export const HeroUnit: React.FC<HeroUnitItemProps> = memo(({ item, onPress }) => {
  const { internalID, title, imageSrc, body, buttonText, url } = item
  const { width: screenWidth } = useScreenDimensions()
  const cardImageWidth = screenWidth > 700 ? screenWidth / 2 : CARD_IMAGE_WIDTH

  console.log("======> prefetching", url)
  return (
    <RouterLink key={internalID} to={url} onPress={onPress} haptic="impactLight">
      <Flex bg="mono100" flexDirection="row" height={HERO_UNIT_CARD_HEIGHT} width={screenWidth}>
        <Image height={HERO_UNIT_CARD_HEIGHT} src={imageSrc} width={cardImageWidth} />

        <Box p={2} width={screenWidth - cardImageWidth}>
          <Text color="mono0" mb={1} numberOfLines={2} variant="lg-display">
            {title}
          </Text>

          <Text color="mono0" mb={2} numberOfLines={DESCRIPTION_LINES}>
            {body}
          </Text>

          <RouterLink hasChildTouchable to={url} onPress={onPress}>
            <Button size="small" variant="outlineLight">
              {buttonText}
            </Button>
          </RouterLink>
        </Box>
      </Flex>
    </RouterLink>
  )
})
