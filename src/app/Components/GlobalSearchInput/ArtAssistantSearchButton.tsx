import { SparklesSquareStrokeIcon } from "@artsy/icons/native"
import { Flex, Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"

const ICON_SIZE = 24
// Reserves the same width as the home header's notification bell, so the search input does not
// change width between Home and Search.
const ICON_HORIZONTAL_PADDING = 3

interface ArtAssistantSearchButtonProps {
  onPress: () => void
  testID?: string
}

export const ArtAssistantSearchButton: React.FC<ArtAssistantSearchButtonProps> = ({
  onPress,
  testID = "art-assistant-search-button",
}) => {
  return (
    <Touchable
      accessibilityLabel="Open Art Assistant"
      accessibilityRole="button"
      hitSlop={ICON_HIT_SLOP}
      haptic="impactLight"
      onPress={onPress}
      testID={testID}
    >
      <Flex px={`${ICON_HORIZONTAL_PADDING}px`}>
        <SparklesSquareStrokeIcon fill="mono100" width={ICON_SIZE} height={ICON_SIZE} />
      </Flex>
    </Touchable>
  )
}
