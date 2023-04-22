import { ContextModule } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ElasticSearchResults2Screen } from "app/Scenes/Search/components/ElasticSearchResults"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { connectInfiniteHits, connectStateResults } from "react-instantsearch-core"
import { useTracking } from "react-tracking"
import { AutosuggestResult, AutosuggestResults } from "./AutosuggestResults"
import { SearchArtworksQueryRenderer } from "./SearchArtworksContainer"
import { AlgoliaSearchResults } from "./components/AlgoliaSearchResults"
import { ARTWORKS_PILL, objectTabByContextModule, TOP_PILL, tracks } from "./constants"
import { getContextModuleByPillName } from "./helpers"
import { AlgoliaSearchResult, PillType, TappedSearchResultData } from "./types"

interface SearchResultsProps {
  selectedPill: PillType
  query: string
  onRetry: () => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({ selectedPill, query, onRetry }) => {
  const { trackEvent } = useTracking()
  const isTopPillSelected = selectedPill.key === TOP_PILL.key
  const isArtworksPillSelected = selectedPill.key === ARTWORKS_PILL.key
  const isESOnlySearchEnabled = useFeatureFlag("AREnableESOnlySearch")

  const handleTrackAlgoliaResultPress = (result: AlgoliaSearchResult) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    const data: TappedSearchResultData = {
      type: selectedPill.displayName,
      slug: result.slug,
      position: result.__position - 1,
      query,
      contextModule: contextModule!,
    }

    if (contextModule && objectTabByContextModule[contextModule]) {
      data.objectTab = objectTabByContextModule[contextModule]
    }

    trackEvent(tracks.tappedSearchResult(data))
  }

  const handleTrackAutosuggestResultPress = (result: AutosuggestResult, itemIndex?: number) => {
    trackEvent(
      tracks.tappedSearchResult({
        type: result.displayType || result.__typename,
        slug: result.slug!,
        position: itemIndex!,
        query,
        contextModule: ContextModule.topTab,
      })
    )
  }

  if (selectedPill.type === "algolia") {
    return (
      <AlgoliaSearchResultsContainer
        selectedPill={selectedPill}
        onRetry={onRetry}
        trackResultPress={handleTrackAlgoliaResultPress}
      />
    )
  }

  if (isTopPillSelected) {
    return (
      <Flex p={2} pt={0}>
        <AutosuggestResults
          query={query}
          showResultType
          showQuickNavigationButtons
          showOnRetryErrorMessage
          trackResultPress={handleTrackAutosuggestResultPress}
        />
      </Flex>
    )
  }

  if (
    isESOnlySearchEnabled &&
    !isTopPillSelected &&
    !isArtworksPillSelected &&
    selectedPill.type === "elastic"
  ) {
    return (
      <ElasticSearchResults2Screen
        query={query}
        selectedPill={selectedPill}
        key={selectedPill.key}
      />
    )
  }

  return <SearchArtworksQueryRenderer keyword={query} />
}

const AlgoliaSearchResultsWithState = connectStateResults(AlgoliaSearchResults)
const AlgoliaSearchResultsContainer = connectInfiniteHits(AlgoliaSearchResultsWithState)
