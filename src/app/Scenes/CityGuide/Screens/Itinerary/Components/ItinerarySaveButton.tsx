import { AddStrokeIcon, CheckmarkIcon } from "@artsy/icons/native"
import { Button, Flex } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"

const ICON_SIZE = 24
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

interface Props {
  isSaved: boolean
  onPress: () => void
  isSaving?: boolean
  accessibilityLabel?: string
  /**
   * "icon" is the plus/tick used in list rows and on the map card. "button" is the
   * labelled form the stop preview sheet needs, sitting beside "Show on map".
   */
  variant?: "icon" | "button"
}

export const ItinerarySaveButton: React.FC<Props> = ({
  isSaved,
  onPress,
  isSaving = false,
  accessibilityLabel,
  variant = "icon",
}) => {
  if (variant === "button") {
    return (
      <Button
        testID="itinerary-save-button"
        variant="outline"
        block
        loading={isSaving}
        accessibilityLabel={accessibilityLabel ?? (isSaved ? "Saved" : "Save")}
        accessibilityState={{ selected: isSaved, disabled: isSaving }}
        onPress={onPress}
        longestText="Saved"
      >
        {isSaved ? "Saved" : "Save"}
      </Button>
    )
  }

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
          <AddStrokeIcon
            testID="itinerary-save-button-add-icon"
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        )}
      </Flex>
    </TouchableOpacity>
  )
}
