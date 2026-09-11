import { AddStrokeIcon, CheckmarkIcon } from "@artsy/icons/native"
import { Button, Flex } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"

/** List rows and the map card. The rails' designs call for a smaller 18. */
const DEFAULT_ICON_SIZE = 24
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
  /**
   * Overrides the glyph size for the "icon" variant. The rail cards pass 18, which is what
   * their designs specify; rows keep the larger default. `hitSlop` is unchanged, so a smaller
   * glyph still gets a comfortable tap target.
   */
  iconSize?: number
}

export const CityGuideSaveButton: React.FC<Props> = ({
  isSaved,
  onPress,
  isSaving = false,
  accessibilityLabel,
  variant = "icon",
  iconSize = DEFAULT_ICON_SIZE,
}) => {
  if (variant === "button") {
    return (
      <Button
        testID="city-guide-save-button"
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
      testID="city-guide-save-button"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (isSaved ? "Saved" : "Save")}
      accessibilityState={{ selected: isSaved, disabled: isSaving }}
      disabled={isSaving}
      hitSlop={HIT_SLOP}
      onPress={onPress}
    >
      <Flex width={iconSize} height={iconSize} alignItems="center" justifyContent="center">
        {isSaved ? (
          <CheckmarkIcon
            testID="city-guide-save-button-check-icon"
            width={iconSize}
            height={iconSize}
          />
        ) : (
          <AddStrokeIcon
            testID="city-guide-save-button-add-icon"
            width={iconSize}
            height={iconSize}
          />
        )}
      </Flex>
    </TouchableOpacity>
  )
}
