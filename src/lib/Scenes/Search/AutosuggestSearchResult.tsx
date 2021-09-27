import { themeGet } from "@styled-system/theme-get"
import { EntityType, navigate, navigateToEntity, navigateToPartner, SlugType } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { Schema } from "lib/utils/track"
import { ArtworkIcon, Box, Flex, Spacer, Text } from "palette"
import React, { useContext } from "react"
import { Pressable, ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { SearchListItem } from "../Search2/components/SearchListItem"
import { AutosuggestResult } from "./AutosuggestResults"
import { ResultWithHighlight } from "./ResultWithHighlight"
import { SearchContext } from "./SearchContext"

export type OnResultPress = (result: AutosuggestResult) => void

type ArtistTabs = "Insights" | "Artworks"

type HandleResultPress = (passProps?: { artistTab: ArtistTabs }) => void

const NavigationButton: React.FC<{ artistTab: ArtistTabs; displayText: string; onPress: HandleResultPress }> = ({
  artistTab,
  displayText,
  onPress,
}) => {
  return (
    <>
      <Pressable onPress={() => onPress({ artistTab })}>
        {({ pressed }) => (
          <QuickNavigationButton>
            <Box mr={0.5}>
              <ArtworkIcon fill={pressed ? "blue100" : "black100"} />
            </Box>
            <Text variant="xs" color={pressed ? "blue100" : "black100"}>
              {displayText}
            </Text>
          </QuickNavigationButton>
        )}
      </Pressable>

      <Spacer ml={1} />
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

  const getCategoryName = () => {
    if (result.displayType) {
      return result.displayType
    }
    if (result.__typename === "Artist") {
      return result.__typename
    }
    return ""
  }

  const categoryName = getCategoryName()

  return (
    <SearchListItem
      onPress={onPress}
      imageURL={result.imageUrl}
      categoryName={categoryName}
      onDelete={onDelete}
      InfoComponent={() => {
        return (
          <>
            <Text variant="xs" numberOfLines={1}>
              <ResultWithHighlight
                displayLabel={result.displayLabel!}
                highlight={highlight}
                categoryName={categoryName}
              />
            </Text>
            {!!showResultType && !!categoryName && (
              <Text variant="xs" color="black60">
                {categoryName}
              </Text>
            )}
          </>
        )
      }}
    >
      {!!showNavigationButtons && (
        <Flex flexDirection="row" alignItems="center">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <NavigationButton displayText="Artworks" artistTab="Artworks" onPress={onPress} />
            <NavigationButton displayText="Auction Results" artistTab="Insights" onPress={onPress} />
          </ScrollView>
        </Flex>
      )}
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
