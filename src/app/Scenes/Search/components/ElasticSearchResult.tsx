import { Spacer, Flex } from "@artsy/palette-mobile"
import { ResultWithHighlight } from "app/Scenes/Search/components/ResultWithHighlight"
import { objectTabByContextModule, tracks } from "app/Scenes/Search/constants"
import { getContextModuleByPillName } from "app/Scenes/Search/helpers"
import {
  PillType,
  ElasticSearchResultInterface,
  TappedSearchResultData,
} from "app/Scenes/Search/types"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { Touchable } from "@artsy/palette-mobile"
import { useTracking } from "react-tracking"
import { IMAGE_SIZE, SearchResultImage } from "./SearchResultImage"

export interface ElasticSearchResultItemProps {
  result: ElasticSearchResultInterface
  selectedPill: PillType
  query?: string
  position: number
}

export const ElasticSearchResult: React.FC<ElasticSearchResultItemProps> = ({
  query,
  result,
  selectedPill,
  position,
}) => {
  const { trackEvent } = useTracking()
  const addArtworkToRecentSearches = () => {
    GlobalStore.actions.search.addRecentSearch({
      type: "AUTOSUGGEST_RESULT_TAPPED",
      props: {
        imageUrl: result.imageUrl,
        href: result.href,
        slug: result.slug,
        displayLabel: result.displayLabel,
        __typename: selectedPill.displayName,
        displayType: selectedPill.displayName,
      },
    })
  }

  const handleTrackResultPress = (result: ElasticSearchResultInterface) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    const data: TappedSearchResultData = {
      type: selectedPill.displayName,
      slug: result.slug!,
      position,
      query: query!,
      contextModule: contextModule!,
    }

    if (contextModule && objectTabByContextModule[contextModule]) {
      data.objectTab = objectTabByContextModule[contextModule]
    }

    trackEvent(tracks.tappedSearchResult(data))
  }

  const onPress = (): void => {
    if (result.href === null) {
      return
    }

    navigate(result.href)
    addArtworkToRecentSearches()

    handleTrackResultPress(result)
  }

  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Search Result for ${result.displayLabel}`}
    >
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <SearchResultImage
          imageURL={result.imageUrl}
          resultType={selectedPill.displayName}
          testID={`search-result-image-${result.displayLabel}`}
        />

        <Spacer x={1} />

        <Flex flex={1}>
          <ResultWithHighlight displayLabel={result.displayLabel!} highlight={query} />
        </Flex>
      </Flex>
    </Touchable>
  )
}
