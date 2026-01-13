import { Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { ArtworkSaveIconWrapper } from "app/Components/ArtworkGrids/ArtworkSaveIconWrapper"
import { FC } from "react"

interface ArtworkCardSaveButtonProps {
  isSaved: boolean
  onPress: () => void
}

export const ArtworkCardSaveButton: FC<ArtworkCardSaveButtonProps> = ({ onPress, isSaved }) => {
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
        <ArtworkSaveIconWrapper isSaved={!!isSaved} />
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
