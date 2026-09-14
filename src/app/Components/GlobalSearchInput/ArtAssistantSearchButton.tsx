import { SparklesStrokeIcon } from "@artsy/icons/native"
import { Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"

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
      <SparklesStrokeIcon fill="mono100" width={26} height={26} />
    </Touchable>
  )
}
