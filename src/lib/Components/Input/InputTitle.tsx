import { Text, ThemeV2, ThemeV3, useColor } from "palette"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"

export const InputTitle: React.FC<{ required?: boolean }> = ({ children: title, required }) => {
  const color = useColor()
  if (!title) {
    return null
  }

  const allowV3 = usePaletteFlagStore((state) => state.allowV3)

  if (allowV3) {
    return (
      <ThemeV3>
        <Text variant="xs" mb={0.5}>
          {title}
          {!!required && (
            <Text variant="mediumText" color={color("blue100")}>
              *
            </Text>
          )}
        </Text>
      </ThemeV3>
    )
  } else {
    return (
      <ThemeV2>
        <Text variant="text" mb={0.5}>
          {title}
          {!!required && (
            <Text variant="mediumText" color={color("purple100" /* TODO-PALETTE-V3 "blue100" */)}>
              *
            </Text>
          )}
        </Text>
      </ThemeV2>
    )
  }
}
