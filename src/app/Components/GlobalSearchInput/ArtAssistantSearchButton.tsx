import { MagicMagnifyingGlassIcon } from "@artsy/icons/native"
import { SEARCH_INPUT_CONTAINER_HEIGHT, Touchable, useColor } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"

interface ArtAssistantSearchButtonProps {
  onPress: () => void
  testID?: string
}

export const ArtAssistantSearchButton: React.FC<ArtAssistantSearchButtonProps> = ({
  onPress,
  testID = "art-assistant-search-button",
}) => {
  const color = useColor()

  return (
    <Touchable
      accessibilityLabel="Open Art Assistant"
      accessibilityRole="button"
      hitSlop={ICON_HIT_SLOP}
      haptic="impactLight"
      onPress={onPress}
      testID={testID}
      underlayColor="mono10"
      style={{
        alignItems: "center",
        backgroundColor: color("mono5"),
        borderRadius: 50,
        height: SEARCH_INPUT_CONTAINER_HEIGHT,
        justifyContent: "center",
        overflow: "hidden",
        width: SEARCH_INPUT_CONTAINER_HEIGHT,
      }}
    >
      <MagicMagnifyingGlassIcon fill="mono100" width={22} height={22} />
    </Touchable>
  )
}
