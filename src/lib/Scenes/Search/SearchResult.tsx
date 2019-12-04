import { Flex, Sans, Serif, Spacer } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import { AutosuggestResult } from "./AutosuggestResults"
import { useRecentSearches } from "./RecentSearches"

export const SearchResult: React.FC<{
  result: AutosuggestResult
  highlight?: string
}> = ({ result, highlight }) => {
  const navRef = useRef<any>()
  const { notifyRecentSearch } = useRecentSearches()
  return (
    <TouchableOpacity
      ref={navRef}
      onPress={() => {
        SwitchBoard.presentNavigationViewController(navRef.current, result.href)
        notifyRecentSearch({ type: "AUTOSUGGEST_RESULT_TAPPED", props: result })
      }}
    >
      <Flex flexDirection="row" alignItems="center">
        <OpaqueImageView imageURL={result.imageUrl} style={{ width: 36, height: 36 }} />
        <Spacer ml={1} />
        <View style={{ flex: 1 }}>
          {applyHighlight(result.displayLabel, highlight)}
          {result.displayType && (
            <Sans size="2" color="black60">
              {result.displayType}
            </Sans>
          )}
        </View>
      </Flex>
    </TouchableOpacity>
  )
}

function applyHighlight(displayLabel: string, highlight: string | undefined) {
  const i = highlight ? displayLabel.toLowerCase().indexOf(highlight.toLowerCase()) : -1
  if (i === -1) {
    return (
      <Serif size="3" weight="regular">
        {displayLabel}
      </Serif>
    )
  }
  return (
    <Serif size="3" weight="regular">
      {displayLabel.slice(0, i)}
      <Serif size="3" weight="semibold">
        {displayLabel.slice(i, i + highlight.length)}
      </Serif>
      {displayLabel.slice(i + highlight.length)}
    </Serif>
  )
}
