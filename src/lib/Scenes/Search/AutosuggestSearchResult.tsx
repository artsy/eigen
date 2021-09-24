import { themeGet } from "@styled-system/theme-get"
import GraphemeSplitter from "grapheme-splitter"
import { EntityType, navigate, navigateToEntity, navigateToPartner, SlugType } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { normalizeText } from "lib/utils/normalizeText"
import { Schema } from "lib/utils/track"
import { ArtworkIcon, AuctionIcon, Box, Flex, Spacer, Text, useSpace } from "palette"
import React, { useContext } from "react"
import { Pressable, ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { SearchListItem } from "../Search2/components/SearchListItem"
import { AutosuggestResult } from "./AutosuggestResults"
import { SearchContext } from "./SearchContext"

export type OnResultPress = (result: AutosuggestResult) => void

type ArtistTabs = "Insights" | "Artworks"

type HandleResultPress = (passProps?: { artistTab: ArtistTabs }) => void

const NavigationButtons: React.FC<{ onPress: HandleResultPress }> = ({ onPress }) => {
  const space = useSpace()

  return (
    <>
      <Flex flexDirection="row" alignItems="center">
        <ScrollView
          horizontal
          contentContainerStyle={{ paddingHorizontal: space(1) }}
          showsHorizontalScrollIndicator={false}
        >
          <Spacer ml={1} />

          <Pressable onPress={() => onPress({ artistTab: "Artworks" })}>
            {({ pressed }) => (
              <QuickNavigationButton>
                <Box mr={0.5}>
                  <ArtworkIcon fill={pressed ? "blue100" : "black100"} />
                </Box>
                <Text variant="caption" color={pressed ? "blue100" : "black100"}>
                  Artworks
                </Text>
              </QuickNavigationButton>
            )}
          </Pressable>

          <Spacer ml={1} />

          <Pressable onPress={() => onPress({ artistTab: "Insights" })}>
            {({ pressed }) => (
              <QuickNavigationButton>
                <Box mr={0.5}>
                  <AuctionIcon fill={pressed ? "blue100" : "black100"} />
                </Box>
                <Text variant="caption" color={pressed ? "blue100" : "black100"}>
                  Auction Results
                </Text>
              </QuickNavigationButton>
            )}
          </Pressable>
        </ScrollView>
      </Flex>
    </>
  )
}

export const AutosuggestSearchResult: React.FC<{
  result: AutosuggestResult
  highlight?: string
  updateRecentSearchesOnTap?: boolean
  displayingRecentResult?: boolean
  showResultType?: boolean
  showQuickNavigationButtons?: boolean
  onResultPress?: OnResultPress
  onDelete?(): void
}> = ({
  result,
  highlight,
  showResultType,
  onDelete,
  onResultPress,
  displayingRecentResult,
  updateRecentSearchesOnTap = true,
  showQuickNavigationButtons = false,
}) => {
  const { inputRef, queryRef } = useContext(SearchContext)
  const { trackEvent } = useTracking()

  const showNavigationButtons =
    showQuickNavigationButtons && !!result.counts?.artworks && !!result.counts?.auctionResults

  const onPress: HandleResultPress = (passProps) => {
    if (onResultPress) {
      onResultPress(result)
    } else {
      inputRef.current?.blur()
      // need to wait a tick to push next view otherwise the input won't blur ¯\_(ツ)_/¯
      setTimeout(() => {
        navigateToResult(result, passProps?.artistTab)
        if (updateRecentSearchesOnTap) {
          GlobalStore.actions.search.addRecentSearch({ type: "AUTOSUGGEST_RESULT_TAPPED", props: result })
        }
      }, 20)
      trackEvent({
        action_type: displayingRecentResult
          ? Schema.ActionNames.ARAnalyticsSearchRecentItemSelected
          : Schema.ActionNames.ARAnalyticsSearchItemSelected,
        query: queryRef.current,
        selected_object_type: result.displayType || result.__typename,
        selected_object_slug: result.slug,
      })
    }
  }

  const categoryName = result.displayType ?? (result.__typename === "Artist" ? result.__typename : "")

  return (
    <SearchListItem
      onPress={onPress}
      imageURL={result.imageUrl}
      categoryName={categoryName}
      onDelete={onDelete}
      InfoComponent={() => {
        return (
          <>
            <Text variant="caption" numberOfLines={1}>
              {applyHighlight({ displayLabel: result.displayLabel!, highlight, categoryName })}
            </Text>
            {!!showResultType && !!categoryName && (
              <Text variant="caption" color="black60">
                {categoryName}
              </Text>
            )}
          </>
        )
      }}
    >
      {!!showNavigationButtons && <NavigationButtons onPress={onPress} />}
    </SearchListItem>
  )
}

const QuickNavigationButton = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 10px;
  border: 1px solid ${themeGet("colors.black30")};
  border-radius: 20;
`

export const ItalicText: React.FC<{ color?: string }> = ({ color = "grey", children }) => {
  return (
    <Text variant="caption" italic color={color}>
      {children}
    </Text>
  )
}

const splitter = new GraphemeSplitter()

/**
 * For some entities (fairs, partners) we pass along some context
 * about the entity type to render the correct placeholder/skeleton loader
 * @param result
 */
function navigateToResult(result: AutosuggestResult, artistTab: ArtistTabs = "Artworks") {
  if (result.displayType === "Gallery" || result.displayType === "Institution") {
    navigateToPartner(result.slug!)
  } else if (result.displayType === "Fair") {
    navigateToEntity(result.href!, EntityType.Fair, SlugType.ProfileID)
  } else if (result.__typename === "Artist") {
    navigate(result.href!, { passProps: { initialTab: artistTab } })
  } else {
    navigate(result.href!)
  }
}

const Result: React.FC<{ result: string[] }> = ({ result }) => {
  const [nonMatch, match, nonMatch2] = result

  return (
    <Text variant="caption">
      {nonMatch}
      <Text variant="caption" weight="medium" color="blue100" style={{ padding: 0, margin: 0 }}>
        {match}
      </Text>
      {nonMatch2}
    </Text>
  )
}

export const ResultWithItalic: React.FC<{ result: string[] }> = ({ result }) => {
  const [nonMatch, match, nonMatch2] = result

  // If the result string is e.g. "Henri Venne, The Sun Shines Cold (2015)",
  // the part after the comma should be italic grey
  // So let's assume the query is "Cold"
  // the result array will be ["Henri Venne, The Sun Shines ", "Cold", " (2015)"]
  if (nonMatch.includes(",")) {
    const [mainNonMatch, ...rest] = nonMatch.split(",")
    const restNonMatch = rest.join(",")
    return (
      <>
        <Text variant="caption">{mainNonMatch}</Text>

        <ItalicText>
          {restNonMatch}
          <ItalicText color="blue100">{match}</ItalicText>
          {nonMatch2}
        </ItalicText>
      </>
    )
  }

  // If the result string is e.g. "Christ on the Cold Stone, Brabant (1990)",
  // the part after the comma should be italic grey
  // So let's assume the query is "Cold"
  // the result array will be ["Christ on the ", "Cold", " Stone, Brabant (1990)"]
  if (nonMatch2.includes(",")) {
    const [mainNonMatch2, ...rest] = nonMatch2.split(",")
    const restNonMatch2 = rest.join(",")
    return (
      <>
        <Text variant="caption">
          {nonMatch}
          <Text variant="caption" weight="medium" color="blue100">
            {match}
          </Text>
          {mainNonMatch2}
        </Text>

        <ItalicText>{restNonMatch2}</ItalicText>
      </>
    )
  }

  return <Result result={result} />
}

function applyHighlight({
  displayLabel,
  highlight,
  categoryName,
}: {
  displayLabel: string
  highlight?: string
  categoryName: string
}) {
  // If highlight is not supplied then use medium weight, since the search result
  // is being rendered in a context that doesn't support highlights
  if (highlight === undefined) {
    return (
      <Text variant="caption" weight="medium">
        {displayLabel}
      </Text>
    )
  }
  if (!highlight.trim()) {
    return (
      <Text variant="caption" weight="regular">
        {displayLabel}
      </Text>
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
      <Text variant="caption" weight="regular">
        {displayLabel}
      </Text>
    )
  }

  if (categoryName === "Artwork") {
    return <ResultWithItalic result={result} />
  }

  return <Result result={result} />
}
