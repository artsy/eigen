import { Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { ArtworkSaveIconWrapper } from "app/Components/ArtworkGrids/ArtworkSaveIconWrapper"
import { FC } from "react"
import { ViewStyle } from "react-native"

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

const HEART_CIRCLE_SIZE = 50
const SAVE_BUTTON_WIDTH = 105

const ArtworkCardSaveButtonIcon: React.FC<{
  isSaved: boolean
  animatedStyle: ViewStyle
}> = ({ isSaved }) => {
  return <ArtworkSaveIconWrapper isSaved={!!isSaved} />
}
