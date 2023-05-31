import { Text } from "@artsy/palette-mobile"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"

export const ResultWithHighlight: React.FC<{
  displayLabel: string
  highlight?: string
  numberOfLines?: number
  textAlign?: "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start"
}> = ({ displayLabel, highlight, numberOfLines = 1, textAlign }) => {
  const matches = match(displayLabel, highlight!)
  const parts = parse(displayLabel, matches)

  return (
    <Text variant="xs" numberOfLines={numberOfLines} textAlign={textAlign}>
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
