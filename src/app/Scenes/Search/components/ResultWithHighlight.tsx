import { Text } from "@artsy/palette-mobile"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"

export const ResultWithHighlight: React.FC<{
  displayLabel: string
  highlight?: string
  numberOfLines?: number
}> = ({ displayLabel, highlight, numberOfLines = 1 }) => {
  const matches = match(displayLabel, highlight!)
  const parts = parse(displayLabel, matches)

  return (
    <Text variant="xs" numberOfLines={numberOfLines}>
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
