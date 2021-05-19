import GraphemeSplitter from "grapheme-splitter"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { EntityType, navigate, navigateToEntity, navigateToPartner, SlugType } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { normalizeText } from "lib/utils/normalizeText"
import { Schema } from "lib/utils/track"
import { ArtworkIcon, AuctionIcon, Box, CloseIcon, color, Flex, Sans, Spacer } from "palette"
import React, { useContext } from "react"
import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { useTracking } from "react-tracking"
import { graphql, useQuery } from "relay-hooks"
import styled from "styled-components/native"
import { AutosuggestResult } from "./AutosuggestResults"
import { SearchContext } from "./SearchContext"

export type OnResultPress = (result: AutosuggestResult) => void
type ArtistTabs = "Insights" | "Artworks"
export const SearchResult: React.FC<{
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
  onDelete,
  onResultPress,
  displayingRecentResult,
  showResultType = true,
  updateRecentSearchesOnTap = true,
  showQuickNavigationButtons = false,
}) => {
  const { inputRef, queryRef } = useContext(SearchContext)
  const { trackEvent } = useTracking()
  const imageSide = 40

  // remove below when metaphysics is ready
  const { props } = useQuery(
    graphql`
      query ArtistAboveTheFoldQuery($artistID: String!) {
        artist(id: $artistID) {
          auctionResultsConnection {
            totalCount
          }
        }
      }
    `,
    { artistID: result.internalID },
    { skip: !showQuickNavigationButtons || result.displayType !== "Artist" }
  )
  // remove above when metaphysics is ready

  const showNavigationButtons =
    showQuickNavigationButtons &&
    result.displayType === "Artist" &&
    // change below when metaphysics is ready
    // @ts-expect-error
    !!props?.artist?.auctionResultsConnection?.totalCount // <-- check if there are Insights & Artworks tabs
  // change above when metaphysics is ready

  const onPress = (passProps?: { navigateToSpecificArtistTab: ArtistTabs }) => {
    if (onResultPress) {
      onResultPress(result)
    } else {
      inputRef.current?.blur()
      // need to wait a tick to push next view otherwise the input won't blur ¯\_(ツ)_/¯
      setTimeout(() => {
        navigateToResult(result, passProps?.navigateToSpecificArtistTab)
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
  }
  return (
    <>
      <TouchableOpacity onPress={() => onPress()}>
        <Flex flexDirection="row" alignItems="center">
          <OpaqueImageView
            imageURL={result.imageUrl}
            style={{
              width: imageSide,
              height: imageSide,
              borderRadius: showNavigationButtons ? imageSide / 2 : 2,
              overflow: "hidden",
            }}
          />
          <Spacer ml={1} />
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
              <Flex pl={1}>
                <CloseIcon fill="black60" />
              </Flex>
            </TouchableOpacity>
          )}
        </Flex>
      </TouchableOpacity>

      {showNavigationButtons && (
        <>
          <Spacer m={0.5} />

          <Flex flexDirection="row" alignItems="center">
            <View style={{ width: imageSide }}></View>
            <Spacer ml={1} />

            <Pressable onPress={() => onPress({ navigateToSpecificArtistTab: "Artworks" })}>
              {({ pressed }) => (
                <UtilButton>
                  <Box mr={0.5}>
                    <ArtworkIcon fill={pressed ? "blue100" : "black100"} />
                  </Box>
                  <Sans size="3" color={pressed ? "blue100" : "black100"}>
                    Artworks
                  </Sans>
                </UtilButton>
              )}
            </Pressable>

            <Spacer ml={1} />

            <Pressable onPress={() => onPress({ navigateToSpecificArtistTab: "Insights" })}>
              {({ pressed }) => (
                <UtilButton>
                  <Box mr={0.5}>
                    <AuctionIcon fill={pressed ? "blue100" : "black100"} />
                  </Box>
                  <Sans size="3" color={pressed ? "blue100" : "black100"}>
                    Auction Results
                  </Sans>
                </UtilButton>
              )}
            </Pressable>
          </Flex>
        </>
      )}
    </>
  )
}
const UtilButton = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 10px;
  border: 1px solid ${color("black30")};
`
const splitter = new GraphemeSplitter()

/**
 * For some entities (fairs, partners) we pass along some context
 * about the entity type to render the correct placeholder/skeleton loader
 * @param result
 */
function navigateToResult(result: AutosuggestResult, navigateToSpecificArtistTab: ArtistTabs = "Artworks") {
  if (result.displayType === "Gallery" || result.displayType === "Institution") {
    navigateToPartner(result.slug!)
  } else if (result.displayType === "Fair") {
    navigateToEntity(result.href!, EntityType.Fair, SlugType.ProfileID)
  } else if (result.displayType === "Artist") {
    navigate(result.href!, { passProps: { initialTab: navigateToSpecificArtistTab } })
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
