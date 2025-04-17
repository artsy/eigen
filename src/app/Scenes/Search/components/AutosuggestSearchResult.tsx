import {
  ArrowRightIcon,
  ArtworkIcon,
  AuctionIcon,
  CloseIcon,
  Flex,
  Pill,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Schema } from "app/utils/track"
import { useContext } from "react"
import { useTracking } from "react-tracking"
import { ResultWithHighlight } from "./ResultWithHighlight"
import { IMAGE_SIZE, SearchResultImage } from "./SearchResultImage"

export type OnResultPress = (result: AutosuggestResult) => void
export type TrackResultPress = (result: AutosuggestResult, itemIndex?: number) => void

type ArtistTabs = "Insights" | "Artworks"

type PassedProps = {
  initialTab: ArtistTabs
  scrollToArtworksGrid?: boolean
}

const getResultType = (result: AutosuggestResult) => {
  if (result.displayType) {
    return result.displayType
  }
  if (result.__typename === "Artist") {
    return result.__typename
  }
  return ""
}

export const AutosuggestSearchResult: React.FC<{
  result: AutosuggestResult
  highlight?: string
  updateRecentSearchesOnTap?: boolean
  displayingRecentResult?: boolean
  showResultType?: boolean
  showQuickNavigationButtons?: boolean
  itemIndex?: number
  trackResultPress?: TrackResultPress
  onResultPress?: OnResultPress
  onDelete?(): void
}> = ({
  result,
  highlight,
  showResultType,
  itemIndex,
  trackResultPress,
  onDelete,
  onResultPress,
  displayingRecentResult,
  updateRecentSearchesOnTap = true,
  showQuickNavigationButtons = false,
}) => {
  const { queryRef } = useContext(SearchContext)
  const { trackEvent } = useTracking()

  const showNavigationButtons =
    showQuickNavigationButtons && !!result.statuses?.artworks && !!result.statuses?.auctionLots

  const onPress = () => {
    if (onResultPress) {
      onResultPress(result)
      return
    }

    if (updateRecentSearchesOnTap) {
      GlobalStore.actions.search.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: result,
      })
    }

    if (trackResultPress) {
      trackResultPress(result, itemIndex)
      return
    }

    trackEvent({
      action_type: displayingRecentResult
        ? Schema.ActionNames.ARAnalyticsSearchRecentItemSelected
        : Schema.ActionNames.ARAnalyticsSearchItemSelected,
      // @ts-expect-error
      query: queryRef.current,
      selected_object_type: result.displayType || result.__typename,
      selected_object_slug: result.slug,
    })
  }

  const resultType = getResultType(result)

  let initials, secondaryLabel

  if (result.__typename === "Artist") {
    initials = result.initials
    secondaryLabel = result.formattedNationalityAndBirthday || undefined
  }

  const href = getResultHref(result)

  return (
    <>
      <RouterLink
        to={href}
        onPress={onPress}
        testID={`autosuggest-search-result-${result.displayLabel}`}
      >
        <Flex flex={1} flexDirection="row" alignItems="center">
          <Flex flex={1}>
            <Flex
              height={secondaryLabel ? IMAGE_SIZE + 12 : IMAGE_SIZE}
              flexDirection="row"
              alignItems="center"
            >
              <SearchResultImage
                imageURL={result.coverArtwork?.imageUrl || result.imageUrl}
                initials={initials}
                resultType={resultType}
              />

              <Spacer x={1} />

              <Flex flex={1}>
                <ResultWithHighlight
                  displayLabel={result.displayLabel ?? ""}
                  secondaryLabel={secondaryLabel}
                  highlight={highlight}
                />

                {!!showResultType && !!resultType && (
                  <Text variant="xs" color="mono60">
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
                    <CloseIcon fill="mono60" />
                  </Flex>
                </Touchable>
              )}
            </Flex>
          </Flex>
          {!onDelete && (
            <Flex pl={1}>
              <ArrowRightIcon height={18} width={18} />
            </Flex>
          )}
        </Flex>
      </RouterLink>

      {!!showNavigationButtons && (
        <>
          <Spacer y={1} />
          <Flex flexDirection="row" alignItems="center">
            <Spacer x={4} />
            <Spacer x={1} />

            <RouterLink
              hasChildTouchable
              to={getResultHref(result, { initialTab: "Artworks" })}
              navigationProps={{ initialTab: "Artworks" }}
              onPress={onPress}
            >
              <Pill Icon={ArtworkIcon}>Artworks</Pill>
            </RouterLink>

            <Spacer x={1} />

            <RouterLink
              hasChildTouchable
              to={getResultHref(result, { initialTab: "Insights" })}
              navigationProps={{ initialTab: "Insights" }}
              onPress={onPress}
            >
              <Pill Icon={AuctionIcon}>Auction Results</Pill>
            </RouterLink>
          </Flex>
        </>
      )}
    </>
  )
}

const getResultHref: (result: AutosuggestResult, props?: PassedProps) => string | null = (
  result,
  props
) => {
  if (!result.href) {
    return null
  }

  if (result.__typename === "Artist") {
    switch (props?.initialTab) {
      case "Insights":
        return `${result.href}/auction-results`
      case "Artworks":
        return `${result.href}/artworks`
    }
  }

  return result.href
}
