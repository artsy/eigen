import { Flex, Text, Button, Touchable } from "@artsy/palette-mobile"
import React from "react"
import { Image, ImageSourcePropType } from "react-native"

const CARD_BORDER_RADIUS = 4
const CARD_WIDTH = 295
const IMAGE_HEIGHT = 160

export interface HomeFeedOnboardingCardProps {
  title: string
  subtitle: string
  image: ImageSourcePropType
  buttonText: string
  onPress: () => void
  testID: string
}

export const HomeFeedOnboardingCard: React.FC<HomeFeedOnboardingCardProps> = ({
  title,
  subtitle,
  image,
  buttonText,
  onPress,
  testID,
}) => {
  return (
    <Touchable haptic="impactMedium" onPress={onPress}>
      <Flex width={CARD_WIDTH} testID={testID}>
        <Image
          resizeMode="cover"
          style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT, alignSelf: "center", flex: 1 }}
          source={image}
          borderTopLeftRadius={CARD_BORDER_RADIUS}
          borderTopRightRadius={CARD_BORDER_RADIUS}
        />
        <Flex
          p={2}
          backgroundColor="black100"
          borderBottomLeftRadius={CARD_BORDER_RADIUS}
          borderBottomRightRadius={CARD_BORDER_RADIUS}
        >
          <Text variant="md" mb={0.5} color="white100">
            {title}
          </Text>
          <Text variant="xs" mb={2} color="white100">
            {subtitle}
          </Text>
          <Button size="small" variant="fillLight" onPress={onPress}>
            {buttonText}
          </Button>
        </Flex>
      </Flex>
    </Touchable>
  )
}
