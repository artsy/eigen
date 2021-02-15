import GraphemeSplitter from "grapheme-splitter"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { EntityType, navigate, navigateToEntity, navigateToPartner, SlugType } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { normalizeText } from "lib/utils/normalizeText"
import { Schema } from "lib/utils/track"
import { CloseIcon, Flex, Sans, Spacer } from "palette"
import React, { useContext } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useTracking } from "react-tracking"
import { AutosuggestResult } from "./AutosuggestResults"
import { SearchContext } from "./SearchContext"

export type OnResultPress = (result: AutosuggestResult) => void

export const SearchResult: React.FC<{
  result: AutosuggestResult
  highlight?: string
  updateRecentSearchesOnTap?: boolean
  displayingRecentResult?: boolean
  showResultType?: boolean
  onResultPress?: OnResultPress
  onDelete?(): void
}> = ({
  result,
  highlight,
  onDelete,
  onResultPress,
  displayingRecentResult,
  showResultType = true,
  updateRecentSearchesOnTap = true,
}) => {
  const { inputRef, queryRef } = useContext(SearchContext)
  const { trackEvent } = useTracking()
  return (
    <TouchableOpacity
      onPress={() => {
        if (onResultPress) {
          onResultPress(result)
        } else {
          inputRef.current?.blur()
          // need to wait a tick to push next view otherwise the input won't blur ¯\_(ツ)_/¯
          setTimeout(() => {
            navigateToResult(result)
            if (updateRecentSearchesOnTap) {
              GlobalStore.actions.search.addRecentSearch({ type: "AUTOSUGGEST_RESULT_TAPPED", props: result })
            }
          }, 20)
          trackEvent({
            action_type: displayingRecentResult
              ? Schema.ActionNames.ARAnalyticsSearchRecentItemSelected
              : Schema.ActionNames.ARAnalyticsSearchItemSelected,
            query: queryRef.current,
            selected_object_type: result.displayType,
            selected_object_slug: result.slug,
          })
        }
      }}
    >
      <Flex flexDirection="row" alignItems="center">
        <OpaqueImageView
          imageURL={result.imageUrl}
          style={{ width: 40, height: 40, borderRadius: 2, overflow: "hidden" }}
        />
        <Spacer ml="1" />
        <View style={{ flex: 1 }}>
          <Text ellipsizeMode="tail" numberOfLines={1}>
            {applyHighlight(result.displayLabel!, highlight)}
          </Text>
          {!!result.displayType && !!showResultType && (
            <Sans size="3t" color="black60">
              {result.displayType}
            </Sans>
          )}
        </View>
        {!!onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{
              bottom: 20,
              top: 20,
              left: 10,
              right: 20,
            }}
          >
            <Flex pl="1">
              <CloseIcon fill="black60" />
            </Flex>
          </TouchableOpacity>
        )}
      </Flex>
    </TouchableOpacity>
  )
}

const splitter = new GraphemeSplitter()

/**
 * For some entities (fairs, partners) we pass along some context
 * about the entity type to render the correct placeholder/skeleton loader
 * @param result
 */
function navigateToResult(result: AutosuggestResult) {
  if (result.displayType === "Gallery" || result.displayType === "Institution") {
    navigateToPartner(result.slug!)
  } else if (result.displayType === "Fair") {
    navigateToEntity(result.href!, EntityType.Fair, SlugType.ProfileID)
  } else {
    navigate(result.href!)
  }
}

function applyHighlight(displayLabel: string, highlight: string | undefined) {
  // If highlight is not supplied then use medium weight, since the search result
  // is being rendered in a context that doesn't support highlights
  if (highlight === undefined) {
    return (
      <Sans size="3t" weight="medium">
        {displayLabel}
      </Sans>
    )
  }
  if (!highlight.trim()) {
    return (
      <Sans size="3t" weight="regular">
        {displayLabel}
      </Sans>
    )
  }
  // search for `highlight` in `displayLabel` but ignore diacritics in `displayLabel`
  // so that a user can type, e.g. `Miro` and see `Miró` highlighted
  const labelGraphemes = splitter.splitGraphemes(displayLabel)
  const highlightGraphemes = splitter.splitGraphemes(highlight)
  let result: [string, string, string] | null = null
  outerLoop: for (let i = 0; i < labelGraphemes.length; i++) {
    innerLoop: for (let j = 0; j < highlightGraphemes.length; j++) {
      if (i + j >= labelGraphemes.length) {
        continue outerLoop
      }
      const labelGrapheme = normalizeText(labelGraphemes[i + j])
      const highlightGrapheme = normalizeText(highlightGraphemes[j])
      if (labelGrapheme === highlightGrapheme) {
        // might be a match, continue to see for sure
        continue innerLoop
      } else {
        // not a match so go on to the next grapheme in the label
        continue outerLoop
      }
    }
    // innerloop eneded naturally so there was a match
    result = [
      labelGraphemes.slice(0, i).join(""),
      labelGraphemes.slice(i, i + highlightGraphemes.length).join(""),
      labelGraphemes.slice(i + highlightGraphemes.length).join(""),
    ]
    break outerLoop
  }
  if (!result) {
    return (
      <Sans size="3t" weight="regular">
        {displayLabel}
      </Sans>
    )
  }
  return (
    <Sans size="3t" weight="regular">
      {result[0]}
      <Sans size="3t" weight="medium" style={{ padding: 0, margin: 0 }}>
        {result[1]}
      </Sans>
      {result[2]}
    </Sans>
  )
}
