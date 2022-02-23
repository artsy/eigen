import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"
import { Text } from "palette"
import React from "react"

export const ResultWithHighlight = ({
  displayLabel,
  highlight,
}: {
  displayLabel: string
  highlight?: string
}) => {
  const matches = match(displayLabel, highlight!)
  const parts = parse(displayLabel, matches)

  return (
    <Text variant="xs" numberOfLines={1}>
      {parts.map((part, i) => (
        <Text
          key={i}
          variant="xs"
          color={part.highlight ? "blue100" : "black100"}
          weight={part.highlight ? "medium" : "regular"}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  )
}
