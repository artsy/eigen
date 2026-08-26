import { AddIcon, CheckmarkIcon } from "@artsy/icons/native"
import { Flex } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"

const ICON_SIZE = 24
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

interface Props {
  isSaved: boolean
  onPress: () => void
  isSaving?: boolean
  accessibilityLabel?: string
}

export const ItinerarySaveButton: React.FC<Props> = ({
  isSaved,
  onPress,
  isSaving = false,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      testID="itinerary-save-button"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (isSaved ? "Saved" : "Save")}
      accessibilityState={{ selected: isSaved, disabled: isSaving }}
      disabled={isSaving}
      hitSlop={HIT_SLOP}
      onPress={onPress}
    >
      <Flex width={ICON_SIZE} height={ICON_SIZE} alignItems="center" justifyContent="center">
        {isSaved ? (
          <CheckmarkIcon
            testID="itinerary-save-button-check-icon"
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        ) : (
          <AddIcon testID="itinerary-save-button-add-icon" width={ICON_SIZE} height={ICON_SIZE} />
        )}
      </Flex>
    </TouchableOpacity>
  )
}
