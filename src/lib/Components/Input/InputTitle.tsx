import { Text, ThemeV2, useColor } from "palette"
import React from "react"

export const InputTitle: React.FC<{ required?: boolean }> = ({ children: title, required }) => {
  const color = useColor()
  if (!title) {
    return null
  }

  return (
    <ThemeV2>
      <Text variant="text" mb={0.5}>
        {title}
        {!!required && (
          <Text variant="mediumText" color={color("blue100")}>
            *
          </Text>
        )}
      </Text>
    </ThemeV2>
  )
}
