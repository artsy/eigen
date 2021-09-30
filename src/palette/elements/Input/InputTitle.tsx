import { Text, Theme, useColor } from "palette"
import React from "react"

export const InputTitle: React.FC<{ required?: boolean }> = ({ children: title, required }) => {
  const color = useColor()

  if (!title) {
    return null
  }

  return (
    <Theme>
      <Text variant="md" style={{ fontSize: 13, marginBottom: 2, textTransform: "uppercase" }}>
        {title}
        {!!required && (
          <Text variant="md" color={color("blue100")}>
            *
          </Text>
        )}
      </Text>
    </Theme>
  )
}
