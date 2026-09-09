import { CameraStrokeIcon } from "@artsy/icons/native"
import { SEARCH_INPUT_CONTAINER_HEIGHT, Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"

interface SearchByPhotoIconButtonProps {
  /** Reserves space for the button in the layout instead of overlaying the search input. */
  inline?: boolean
  onPress: () => void
  testID?: string
}

export const SearchByPhotoIconButton: React.FC<SearchByPhotoIconButtonProps> = ({
  inline = false,
  onPress,
  testID = "search-input-camera-icon",
}) => {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel="Search by Photo"
      onPress={onPress}
      hitSlop={ICON_HIT_SLOP}
      haptic="impactLight"
      testID={testID}
      style={{
        position: inline ? "relative" : "absolute",
        right: inline ? undefined : 16,
        height: SEARCH_INPUT_CONTAINER_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
        width: inline ? 52 : undefined,
      }}
    >
      <CameraStrokeIcon width={20} height={20} fill="mono100" />
    </Touchable>
  )
}
