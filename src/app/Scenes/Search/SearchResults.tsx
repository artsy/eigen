import { ContextModule } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import {
  AutosuggestResult,
  AutosuggestResults,
} from "app/Components/AutosuggestResults/AutosuggestResults"
import { EntitySearchResultsScreen } from "app/Scenes/Search/components/EntitySearchResults"
import { useTracking } from "react-tracking"
import { SearchArtworksQueryRenderer } from "./SearchArtworksContainer"
import { ARTWORKS_PILL, TOP_PILL, tracks } from "./constants"
import { PillType } from "./types"

interface SearchResultsProps {
  selectedPill: PillType
  query: string
  onRetry: () => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({ selectedPill, query }) => {
  const { trackEvent } = useTracking()
  const isTopPillSelected = selectedPill.key === TOP_PILL.key
  const isArtworksPillSelected = selectedPill.key === ARTWORKS_PILL.key

  const handleTrackAutosuggestResultPress = (result: AutosuggestResult, itemIndex?: number) => {
    if (typeof itemIndex === "number" && !!result.slug)
      trackEvent(
        tracks.tappedSearchResult({
          type: result.displayType || result.__typename,
          slug: result.slug,
          position: itemIndex,
          query,
          contextModule: ContextModule.topTab,
        })
      )
  }

  if (isTopPillSelected) {
    return (
      <Flex flex={1} mx={2} pb={6}>
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

  if (isArtworksPillSelected) {
    return <SearchArtworksQueryRenderer keyword={query} />
  }

  return (
    <EntitySearchResultsScreen query={query} selectedPill={selectedPill} key={selectedPill.key} />
  )
}
