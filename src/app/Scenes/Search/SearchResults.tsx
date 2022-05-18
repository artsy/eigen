import { ContextModule } from "@artsy/cohesion"
import { Schema } from "app/utils/track"
import { FC } from "react"
import { connectInfiniteHits, connectStateResults } from "react-instantsearch-core"
import { useTracking } from "react-tracking"
import { AutosuggestResult, AutosuggestResults } from "./AutosuggestResults"
import { AlgoliaSearchResults } from "./components/AlgoliaSearchResults"
import { TOP_PILL } from "./constants"
import { getContextModuleByPillName } from "./helpers"
import { SearchArtworksQueryRenderer } from "./SearchArtworksContainer"
import { AlgoliaSearchResult, PillType } from "./types"

interface SearchResultsProps {
  selectedPill: PillType
  query: string
  onRetry: () => void
}

interface TappedSearchResultData {
  query: string
  type: string
  position: number
  contextModule: ContextModule
  slug: string
  objectTab?: string
}

export const SearchResults: FC<SearchResultsProps> = ({ selectedPill, query, onRetry }) => {
  const { trackEvent } = useTracking()

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

  if (selectedPill.key === TOP_PILL.key) {
    return (
      <AutosuggestResults
        query={query}
        showResultType
        showQuickNavigationButtons
        showOnRetryErrorMessage
        trackResultPress={handleTrackAutosuggestResultPress}
      />
    )
  }

  return <SearchArtworksQueryRenderer keyword={query} />
}

const AlgoliaSearchResultsWithState = connectStateResults(AlgoliaSearchResults)
const AlgoliaSearchResultsContainer = connectInfiniteHits(AlgoliaSearchResultsWithState)

const objectTabByContextModule: Partial<Record<ContextModule, string>> = {
  [ContextModule.auctionTab]: "Auction Results",
  [ContextModule.artistsTab]: "Artworks",
}

const tracks = {
  tappedSearchResult: (data: TappedSearchResultData) => ({
    context_screen_owner_type: Schema.OwnerEntityTypes.Search,
    context_screen: Schema.PageNames.Search,
    query: data.query,
    position: data.position,
    selected_object_type: data.type,
    selected_object_slug: data.slug,
    context_module: data.contextModule,
    action: Schema.ActionNames.SelectedResultFromSearchScreen,
  }),
}
