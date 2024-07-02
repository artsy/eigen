import {
  Spacer,
  AuctionIcon,
  ArtworkIcon,
  CloseIcon,
  Flex,
  Pill,
  Text,
  Touchable,
  ArrowRightIcon,
} from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { GlobalStore } from "app/store/GlobalStore"
import { useConditionalNavigate } from "app/system/newNavigation/useConditionalNavigate"
import { Schema } from "app/utils/track"
import { useContext } from "react"
import { TouchableOpacity } from "react-native"
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

type HandleResultPress = (passProps?: PassedProps) => void

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
  const { inputRef, queryRef } = useContext(SearchContext)
  const { trackEvent } = useTracking()

  const conditionalNav = useConditionalNavigate()

  const showNavigationButtons =
    showQuickNavigationButtons && !!result.statuses?.artworks && !!result.statuses?.auctionLots

  /**
   * For some entities (fairs, partners) we pass along some context
   * about the entity type to render the correct placeholder/skeleton loader
   * @param result
   */

  // TODO: Test that all these types are working as expected, I believe we were
  // passing hints to render correct skeleton loaders before and think this broke
  // bring it back
  const navigateToResult = (result: AutosuggestResult, props?: PassedProps) => {
    if (!result.href) {
      return
    }

    if (result.displayType === "Gallery" || result.displayType === "Institution") {
      // TODO: handle partner type
      // navigateToPartner(result.href!)
      conditionalNav(result.href)
    } else if (result.displayType === "Fair") {
      // TODO: handle fair type
      conditionalNav(result.href)
      // navigateToEntity(result.href!, EntityType.Fair, SlugType.ProfileID)
    } else if (result.__typename === "Artist") {
      switch (props?.initialTab) {
        case "Insights":
          conditionalNav(`${result.href}/auction-results`, { passProps: props })
          break
        case "Artworks":
          conditionalNav(`${result.href}/artworks`, {
            passProps: props,
          })
          break

        default:
          conditionalNav(result.href)
          break
      }
    } else {
      conditionalNav(result.href)
    }
  }

  const onPress: HandleResultPress = (passProps) => {
    if (onResultPress) {
      onResultPress(result)
    } else {
      inputRef.current?.blur()
      // need to wait a tick to push next view otherwise the input won't blur ¯\_(ツ)_/¯
      setTimeout(() => {
        navigateToResult(result, passProps)
        if (updateRecentSearchesOnTap) {
          GlobalStore.actions.search.addRecentSearch({
            type: "AUTOSUGGEST_RESULT_TAPPED",
            props: result,
          })
        }
      }, 20)

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
  }

  const resultType = getResultType(result)

  let initials, secondaryLabel

  if (result.__typename === "Artist") {
    initials = result.initials
    secondaryLabel = result.formattedNationalityAndBirthday || undefined
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => onPress()}
        testID={`autosuggest-search-result-${result.displayLabel}`}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Flex flex={1}>
          <Flex
            height={secondaryLabel ? IMAGE_SIZE + 12 : IMAGE_SIZE}
            flexDirection="row"
            alignItems="center"
          >
            <SearchResultImage
              imageURL={result.imageUrl}
              initials={initials}
              resultType={resultType}
            />

            <Spacer x={1} />

            <Flex flex={1}>
              {!!result.displayLabel && (
                <ResultWithHighlight displayLabel={result.displayLabel} highlight={highlight} />
              )}

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
        </Flex>
        {!onDelete && (
          <Flex pl={1}>
            <ArrowRightIcon height={18} width={18} />
          </Flex>
        )}
      </TouchableOpacity>

      {!!showNavigationButtons && (
        <>
          <Spacer y={1} />
          <Flex flexDirection="row" alignItems="center">
            <Spacer x={4} />

            <Spacer x={1} />
            <Pill Icon={ArtworkIcon} onPress={() => onPress({ initialTab: "Artworks" })}>
              Artworks
            </Pill>
            <Spacer x={1} />
            <Pill Icon={AuctionIcon} onPress={() => onPress({ initialTab: "Insights" })}>
              Auction Results
            </Pill>
          </Flex>
        </>
      )}
    </>
  )
}
