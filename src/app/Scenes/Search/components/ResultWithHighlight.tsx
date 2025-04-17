import { Text } from "@artsy/palette-mobile"
import match from "autosuggest-highlight/match"
import parse from "autosuggest-highlight/parse"

export const ResultWithHighlight: React.FC<{
  displayLabel: string
  secondaryLabel?: string
  highlight?: string
  numberOfLines?: number
  textAlign?: "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start"
}> = ({ displayLabel, secondaryLabel, highlight, numberOfLines = 1, textAlign }) => {
  const matches = match(displayLabel, highlight || "")
  const parts = parse(displayLabel, matches)

  return (
    <>
      <Text variant="xs" numberOfLines={numberOfLines} textAlign={textAlign}>
        {parts.map((part, i) => (
          <Text
            key={i}
            variant="xs"
            color={part.highlight ? "blue100" : "mono100"}
            weight={part.highlight ? "medium" : "regular"}
          >
            {part.text}
          </Text>
        ))}
      </Text>

      {!!secondaryLabel && (
        <Text
          variant="xs"
          numberOfLines={1}
          textAlign={textAlign}
          ellipsizeMode="middle"
          color="mono60"
        >
          {secondaryLabel}
        </Text>
      )}
    </>
  )
}
