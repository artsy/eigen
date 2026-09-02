import { PhotographIcon } from "@artsy/icons/native"
import { SEARCH_INPUT_CONTAINER_HEIGHT, Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"

interface SearchByPhotoIconButtonProps {
  onPress: () => void
  testID?: string
}

export const SearchByPhotoIconButton: React.FC<SearchByPhotoIconButtonProps> = ({
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
        position: "absolute",
        right: 16,
        height: SEARCH_INPUT_CONTAINER_HEIGHT,
        justifyContent: "center",
      }}
    >
      <PhotographIcon width={20} height={20} fill="mono100" />
    </Touchable>
  )
}
