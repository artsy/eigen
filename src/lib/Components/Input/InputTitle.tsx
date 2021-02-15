import { color, Sans } from "palette"
import React from "react"
import { Text } from "react-native"

export const InputTitle: React.FC<{ required?: boolean }> = ({ children: title, required }) => {
  if (!title) {
    return null
  }

  return (
    <Sans mb="0.5" size="3" weight="medium">
      {title}
      {!!required && <Text style={{ color: color("purple100") }}>*</Text>}
    </Sans>
  )
}
