import { Button, Flex, Text, Touchable } from "palette"
import React from "react"
import { Image, ImageSourcePropType } from "react-native"

const CARD_BORDER_RADIUS = 4
const CARD_WIDTH = 295

export interface HomeFeedOnboardingCardProps {
  title: string
  subtitle: string
  image: ImageSourcePropType
  buttonText: string
  onPress: () => void
}

export const HomeFeedOnboardingCard: React.FC<HomeFeedOnboardingCardProps> = ({
  title,
  subtitle,
  image,
  buttonText,
  onPress,
}) => {
  return (
    <Touchable haptic="impactMedium" onPress={onPress}>
      <Flex width={CARD_WIDTH} testID="my-collection-hf-onboadring-card">
        <Image
          width={CARD_WIDTH}
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
