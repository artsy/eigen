import { themeGet } from "@styled-system/theme-get"
import { EntityType, navigate, navigateToEntity, navigateToPartner, SlugType } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { Schema } from "lib/utils/track"
import { ArtworkIcon, AuctionIcon, Box, CloseIcon, Flex, Spacer, Text, Touchable } from "palette"
import React, { useContext } from "react"
import { Pressable } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { IMAGE_SIZE, SearchResultImage } from "../Search2/components/SearchResultImage"
import { AutosuggestResult } from "./AutosuggestResults"
import { ResultWithHighlight } from "./ResultWithHighlight"
import { SearchContext } from "./SearchContext"

export type OnResultPress = (result: AutosuggestResult) => void

type ArtistTabs = "Insights" | "Artworks"

type HandleResultPress = (passProps?: { artistTab: ArtistTabs }) => void

const getResultType = (result: AutosuggestResult) => {
  if (result.displayType) {
    return result.displayType
  }
  if (result.__typename === "Artist") {
    return result.__typename
  }
  return ""
}

const NavigationButton: React.FC<{ artistTab: ArtistTabs; displayText: string; onPress: HandleResultPress }> = ({
  artistTab,
  displayText,
  onPress,
}) => {
  return (
    <>
      <Spacer ml={1} />

      <Pressable onPress={() => onPress({ artistTab })}>
        {({ pressed }) => (
          <QuickNavigationButton>
            <Box mr={0.5}>
              {displayText === "Auction Results" ? (
                <AuctionIcon fill={pressed ? "blue100" : "black100"} />
              ) : (
                <ArtworkIcon fill={pressed ? "blue100" : "black100"} />
              )}
            </Box>
            <Text variant="xs" color={pressed ? "blue100" : "black100"}>
              {displayText}
            </Text>
          </QuickNavigationButton>
        )}
      </Pressable>
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

  const resultType = getResultType(result)

  return (
    <>
      <Touchable onPress={() => onPress()}>
        <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
          <SearchResultImage imageURL={result.imageUrl} resultType={resultType} />

          <Spacer ml={1} />

          <Flex flex={1}>
            <ResultWithHighlight displayLabel={result.displayLabel!} highlight={highlight} />

            {!!showResultType && !!resultType && (
              <Text variant="xs" color="black60">
                {resultType}
              </Text>
            )}
          </Flex>

          {!!onDelete && (
            <Touchable
              accessibilityLabel="Remove recent search item"
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
            </Touchable>
          )}
        </Flex>
      </Touchable>

      {!!showNavigationButtons && (
        <>
          <Spacer mb={1} />
          <Flex flexDirection="row" alignItems="center">
            <Spacer ml={4} />

            <NavigationButton displayText="Artworks" artistTab="Artworks" onPress={onPress} />
            <NavigationButton displayText="Auction Results" artistTab="Insights" onPress={onPress} />
          </Flex>
        </>
      )}
    </>
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
