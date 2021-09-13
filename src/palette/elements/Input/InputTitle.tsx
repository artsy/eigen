import { Text, ThemeV3, useColor } from "palette"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React from "react"

export const InputTitle: React.FC<{ required?: boolean }> = ({ children: title, required }) => {
  const color = useColor()
  const { allowV3 } = usePaletteFlagStore()

  if (!title) {
    return null
  }

  const textTransform = allowV3 ? "uppercase" : "none"

  return (
    <ThemeV3>
      <Text variant="text" mb={0.5} style={{ fontSize: 13, textTransform }}>
        {title}
        {!!required && (
          <Text variant="mediumText" color={color("blue100")}>
            *
          </Text>
        )}
      </Text>
    </ThemeV3>
  )
}
