import {
  Spacer,
  AuctionIcon,
  ArtworkIcon,
  CloseIcon,
  Flex,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { Pill } from "app/Components/Pill"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { GlobalStore } from "app/store/GlobalStore"
import {
  EntityType,
  navigate,
  navigateToEntity,
  navigateToPartner,
  SlugType,
  useNavigate,
} from "app/system/navigation/navigate"
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

  const navigate = useNavigate()

  const showNavigationButtons =
    showQuickNavigationButtons && !!result.statuses?.artworks && !!result.statuses?.auctionLots

  /**
   * For some entities (fairs, partners) we pass along some context
   * about the entity type to render the correct placeholder/skeleton loader
   * @param result
   */
  const navigateToResult = (result: AutosuggestResult, props?: PassedProps) => {
    if (!result.href) {
      return
    }

    console.log("Here is where I should navigate to the result", result, props)
    if (result.displayType === "Gallery" || result.displayType === "Institution") {
      // TODO: handle partner type
      // navigateToPartner(result.href!)
      console.warn("Gallery nav")
      navigate(result.href)
    } else if (result.displayType === "Fair") {
      // TODO: handle fair type
      navigate(result.href)
      // navigateToEntity(result.href!, EntityType.Fair, SlugType.ProfileID)
    } else if (result.__typename === "Artist") {
      switch (props?.initialTab) {
        case "Insights":
          navigate(`${result.href}/auction-results`, { passProps: props })
          break
        case "Artworks":
          navigate(`${result.href}/artworks`, {
            passProps: props,
          })
          break

        default:
          navigate(result.href)
          break
      }
    } else {
      navigate(result.href)
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

  const initials = result.__typename === "Artist" ? result.initials : undefined

  return (
    <>
      <Touchable
        onPress={() => onPress()}
        testID={`autosuggest-search-result-${result.displayLabel}`}
      >
        <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
          <SearchResultImage
            imageURL={result.imageUrl}
            initials={initials}
            resultType={resultType}
          />

          <Spacer x={1} />

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
          <Spacer y={1} />
          <Flex flexDirection="row" alignItems="center">
            <Spacer x={4} />

            <Spacer x={1} />
            <Pill
              highlightEnabled
              Icon={ArtworkIcon}
              rounded
              onPress={() => onPress({ initialTab: "Artworks" })}
              block
            >
              Artworks
            </Pill>
            <Spacer x={1} />
            <Pill
              highlightEnabled
              Icon={AuctionIcon}
              rounded
              onPress={() => onPress({ initialTab: "Insights" })}
              block
            >
              Auction Results
            </Pill>
          </Flex>
        </>
      )}
    </>
  )
}
