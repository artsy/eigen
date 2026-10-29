import { AddStrokeIcon, CheckmarkFillIcon } from "@artsy/icons/native"
import { Button, Flex, TextProps, Touchable } from "@artsy/palette-mobile"
import { useState } from "react"

const DEFAULT_ICON_SIZE = 24
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

interface Props {
  isSaved: boolean
  onPress: () => void
  color?: TextProps["color"]
  isSaving?: boolean
  accessibilityLabel?: string
  /**
   * "icon" is the plus/tick used in list rows and on the map card. "button" is the
   * labelled form the stop preview sheet needs, sitting beside "Show on map".
   */
  variant?: "icon" | "button"
  /**
   * Overrides the glyph size for the "icon" variant — rail cards pass 18, others keep the
   * default. `hitSlop` is unchanged, so a smaller glyph still gets a comfortable tap target.
   */
  iconSize?: number
  /** Lets a caller with its own established testID (e.g. a custom stop's plus) keep it. */
  testID?: string
}

export const CityGuideSaveButton: React.FC<Props> = ({
  isSaved,
  onPress,
  color = "mono100",
  isSaving = false,
  accessibilityLabel,
  variant = "icon",
  iconSize = DEFAULT_ICON_SIZE,
  testID = "city-guide-save-button",
}) => {
  const [isPressed, setIsPressed] = useState(false)

  if (variant === "button") {
    return (
      <Button
        testID={testID}
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
    <Touchable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (isSaved ? "Saved" : "Save")}
      accessibilityState={{ selected: isSaved, disabled: isSaving }}
      disabled={isSaving}
      hitSlop={HIT_SLOP}
      haptic="impactLight"
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      <Flex width={iconSize} height={iconSize} alignItems="center" justifyContent="center">
        {isSaved || isPressed ? (
          <CheckmarkFillIcon
            testID="city-guide-save-button-check-icon"
            fill={color}
            width={iconSize}
            height={iconSize}
          />
        ) : (
          <AddStrokeIcon
            testID="city-guide-save-button-add-icon"
            fill={color}
            width={iconSize}
            height={iconSize}
          />
        )}
      </Flex>
    </Touchable>
  )
}
