import { HeartFillIcon, HeartStrokeIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { ArtworkSaveIconWrapper } from "app/Components/ArtworkGrids/ArtworkSaveIconWrapper"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { FC } from "react"
import { ViewStyle } from "react-native"
import Animated from "react-native-reanimated"

interface ArtworkCardSaveButtonProps {
  isSaved: boolean
  onPress: () => void
  animatedStyle: ViewStyle
}

export const ArtworkCardSaveButton: FC<ArtworkCardSaveButtonProps> = ({
  onPress,
  isSaved,
  animatedStyle,
}) => {
  const color = useColor()

  return (
    <Touchable
      accessibilityRole="button"
      haptic
      hitSlop={{ bottom: 10, right: 10, left: 10, top: 10 }}
      onPress={onPress}
      testID="save-artwork-icon"
    >
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        style={{
          width: SAVE_BUTTON_WIDTH,
          height: HEART_CIRCLE_SIZE,
          borderRadius: 30,
          backgroundColor: color("mono5"),
        }}
      >
        <ArtworkCardSaveButtonIcon isSaved={!!isSaved} animatedStyle={animatedStyle} />
        <Flex minWidth={45}>
          <Text ml={0.5} variant="xs">
            {isSaved ? "Saved" : "Save"}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  )
}

const HEART_ICON_SIZE = 18
const HEART_CIRCLE_SIZE = 50
const SAVE_BUTTON_WIDTH = 105

const ArtworkCardSaveButtonIcon: React.FC<{
  isSaved: boolean
  animatedStyle: ViewStyle
}> = ({ isSaved, animatedStyle }) => {
  const enableArtworkHeartIconAnimation = useFeatureFlag("AREnableArtworkSaveIconAnimation")

  if (enableArtworkHeartIconAnimation) {
    return <ArtworkSaveIconWrapper isSaved={!!isSaved} />
  }

  if (isSaved) {
    return (
      <Animated.View style={animatedStyle}>
        <HeartFillIcon
          testID="filled-heart-icon"
          height={HEART_ICON_SIZE}
          width={HEART_ICON_SIZE}
          fill="blue100"
        />
      </Animated.View>
    )
  }

  return (
    <HeartStrokeIcon
      testID="empty-heart-icon"
      height={HEART_ICON_SIZE}
      width={HEART_ICON_SIZE}
      fill="mono100"
    />
  )
}
