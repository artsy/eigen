import { Box, Button, Flex, Image, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import {
  HeroUnitsRail_heroUnitsConnection$data,
  HeroUnitsRail_heroUnitsConnection$key,
} from "__generated__/HeroUnitsRail_heroUnitsConnection.graphql"
import { PaginationDots } from "app/Components/PaginationDots"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useRef, useState } from "react"
import { FlatList, PixelRatio, ViewabilityConfig } from "react-native"
import { useFragment, graphql } from "react-relay"

type HeroUnit = NonNullable<
  NonNullable<NonNullable<HeroUnitsRail_heroUnitsConnection$data["edges"]>[number]>["node"]
>
interface HeroUnitProps {
  item: HeroUnit
  onPress?: () => void
}

const fontScale = PixelRatio.getFontScale()

const CARD_HEIGHT = 250 * fontScale
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
      <Flex bg="black100" flexDirection="row" height={CARD_HEIGHT} width={screenWidth}>
        <Image height={CARD_HEIGHT} src={imageSrc} width={cardImageWidth} />
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

interface HeroUnitsRailProps {
  heroUnits: HeroUnitsRail_heroUnitsConnection$key
}

export const HeroUnitsRail: React.FC<HeroUnitsRailProps> = (props) => {
  const data = useFragment(homeFragment, props.heroUnits)
  const heroUnits = extractNodes(data)
  const [currentIndex, setCurrentIndex] = useState(0)

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index
      setCurrentIndex(index)
    }
  }

  const viewabilityConfig: ViewabilityConfig = { itemVisiblePercentThreshold: 25 }
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged, viewabilityConfig }])

  const { width } = useScreenDimensions()

  return (
    <>
      <FlatList
        data={heroUnits}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item) => item.internalID}
        renderItem={({ item }) => <HeroUnit item={item} />}
        snapToAlignment="start"
        snapToInterval={width}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <Spacer y={2} />
      <PaginationDots currentIndex={currentIndex} length={heroUnits.length} />
    </>
  )
}

export const homeFragment = graphql`
  fragment HeroUnitsRail_heroUnitsConnection on HeroUnitConnection {
    edges {
      node {
        internalID
        body
        credit
        image {
          imageURL
        }
        label
        link {
          text
          url
        }
        title
      }
    }
  }
`
