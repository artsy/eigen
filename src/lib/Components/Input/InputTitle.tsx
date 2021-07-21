import { Text, useColor } from "palette"
import React from "react"

export const InputTitle: React.FC<{ required?: boolean }> = ({ children: title, required }) => {
  const color = useColor()
  if (!title) {
    return null
  }

  return (
    <Text variant="text" mb={0.5}>
      {title}
      {!!required && (
        <Text variant="mediumText" color={color("purple100")}>
          *
        </Text>
      )}
    </Text>
  )
}
