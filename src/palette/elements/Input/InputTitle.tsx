import { Text, ThemeV3, useColor } from "palette"
import React from "react"

export const InputTitle: React.FC<{ required?: boolean }> = ({ children: title, required }) => {
  const color = useColor()

  if (!title) {
    return null
  }

  return (
    <ThemeV3>
      <Text variant="text" style={{ fontSize: 13, textTransform: "uppercase" }}>
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
