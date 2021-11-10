import { Text } from "palette"
import React from "react"
import { connectHighlight } from "react-instantsearch-native"

export const SearchHighlight = connectHighlight(
  ({ highlight, attribute, hit, highlightProperty = "_highlightResult" }) => {
    const parsedHit = highlight({ attribute, hit, highlightProperty })
    return (
      <Text numberOfLines={1} ellipsizeMode="tail">
        {parsedHit.map(({ isHighlighted, value }, index) => {
          return isHighlighted ? (
            <Text variant="xs" key={index} color="blue100" fontWeight="600" padding={0} margin={0}>
              {value}
            </Text>
          ) : (
            <Text variant="xs" key={index}>
              {value}
            </Text>
          )
        })}
      </Text>
    )
  }
)
