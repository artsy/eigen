import { Text, Theme, useColor } from "palette"
import React from "react"

export const InputTitle: React.FC<{ optional?: boolean; required?: boolean }> = ({
  children: title,
  optional,
  required,
}) => {
  const color = useColor()

  if (!title) {
    return null
  }

  return (
    <Theme>
      <Text variant="md" style={{ fontSize: 13, marginBottom: 2, textTransform: "uppercase" }}>
        {title}
        {!!required && (
          <Text
            variant="md"
            style={{ fontSize: 13, textTransform: "none" }}
            color={color("black60")}
          >
            {" "}
            Required
          </Text>
        )}
        {!!optional && (
          <Text
            variant="md"
            style={{ fontSize: 13, textTransform: "none" }}
            color={color("black60")}
          >
            {" "}
            Optional
          </Text>
        )}
      </Text>
    </Theme>
  )
}
