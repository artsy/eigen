import { CloseIcon, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React, { useContext, useRef } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useTracking } from "react-tracking"
import { AutosuggestResult } from "./AutosuggestResults"
import { useRecentSearches } from "./RecentSearches"
import { SearchContext } from "./SearchContext"

export const SearchResult: React.FC<{
  result: AutosuggestResult
  highlight?: string
  updateRecentSearchesOnTap?: boolean
  onDelete?(): void
}> = ({ result, highlight, onDelete, updateRecentSearchesOnTap = true }) => {
  const navRef = useRef<any>()
  const { notifyRecentSearch } = useRecentSearches()
  const { inputRef, query } = useContext(SearchContext)
  const { trackEvent } = useTracking()
  return (
    <TouchableOpacity
      ref={navRef}
      onPress={() => {
        inputRef.current.blur()
        // need to wait a tick to push next view otherwise the input won't blur ¯\_(ツ)_/¯
        setTimeout(() => {
          SwitchBoard.presentNavigationViewController(navRef.current, result.href)
          if (updateRecentSearchesOnTap) {
            notifyRecentSearch({ type: "AUTOSUGGEST_RESULT_TAPPED", props: result })
          }
        }, 20)
        trackEvent({
          action_type: Schema.ActionNames.ARAnalyticsSearchItemSelected,
          query: query.current,
          selected_object_type: result.displayType,
          selected_object_slug: result.slug,
        })
      }}
    >
      <Flex flexDirection="row" alignItems="center">
        <OpaqueImageView imageURL={result.imageUrl} style={{ width: 36, height: 36 }} />
        <Spacer ml={1} />
        <View style={{ flex: 1 }}>
          <Text ellipsizeMode="tail" numberOfLines={1}>
            {applyHighlight(result.displayLabel, highlight)}
          </Text>
          {result.displayType && (
            <Sans size="2" color="black60">
              {result.displayType}
            </Sans>
          )}
        </View>
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{
              bottom: 20,
              top: 20,
              left: 10,
              right: 20,
            }}
          >
            <Flex pl={1}>
              <CloseIcon fill="black60" />
            </Flex>
          </TouchableOpacity>
        )}
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
