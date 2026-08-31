import { PhotographIcon } from "@artsy/icons/native"
import { Touchable } from "@artsy/palette-mobile"
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
      accessibilityLabel="Search by photo"
      onPress={onPress}
      hitSlop={ICON_HIT_SLOP}
      haptic="impactLight"
      testID={testID}
      style={{
        position: "absolute",
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: "center",
      }}
    >
      <PhotographIcon width={20} height={20} fill="mono100" />
    </Touchable>
  )
}
