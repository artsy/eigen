import { CameraStrokeIcon } from "@artsy/icons/native"
import { SEARCH_INPUT_CONTAINER_HEIGHT, Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"

export const SEARCH_BY_PHOTO_ICON_CONTAINER_WIDTH = 52

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
        height: SEARCH_INPUT_CONTAINER_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CameraStrokeIcon width={20} height={20} fill="mono100" />
    </Touchable>
  )
}
