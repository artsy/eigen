import { Flex } from "@artsy/palette-mobile"
import { FilterArtworksInput } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtistQuery } from "__generated__/ArtistQuery.graphql"
import { ArtistAboutQueryRenderer } from "app/Components/Artist/ArtistAbout/ArtistAbout"
import { ArtistArtworksQueryRenderer } from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { ArtistHeaderFloatingButtonsFragmentContainer } from "app/Components/Artist/ArtistHeaderFloatingButtons"
import { ArtistInsightsQueryRenderer } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import {
  FilterArray,
  filterArtworksParams,
  getFilterArrayFromQueryParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { DEFAULT_ARTWORK_SORT } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { getOnlyFilledSearchCriteriaValues } from "app/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { HeaderTabsGridPlaceholder } from "app/Components/HeaderTabGridPlaceholder"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { StickyTabPage, TabProps } from "app/Components/StickyTabPage/StickyTabPage"
import { SearchCriteriaQueryRenderer } from "app/Scenes/Artist/SearchCriteria"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect } from "react"
import { QueryRenderer, graphql } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

const INITIAL_TAB = "Artworks"

interface ArtistProps {
  artistID: string
  artist: NonNullable<ArtistQuery["response"]["artist"]>
  initialTab?: string
  searchCriteria: SearchCriteriaAttributes | null
  fetchCriteriaError: Error | null
  predefinedFilters?: FilterArray
  auctionResultsInitialFilters?: FilterArray
  input?: FilterArtworksInput
}

export const Artist: React.FC<ArtistProps> = (props) => {
  const {
    artistID,
    artist,
    initialTab = INITIAL_TAB,
    searchCriteria,
    fetchCriteriaError,
    predefinedFilters,
    auctionResultsInitialFilters,
    input,
  } = props

  const popoverMessage = usePopoverMessage()

  const tabs: TabProps[] = []
  const displayAboutSection =
    artist.has_metadata || !!artist.statuses?.articles || (artist.counts?.related_artists ?? 0) > 0

  useEffect(() => {
    if (!!fetchCriteriaError) {
      popoverMessage.show({
        title: "Sorry, an error occured",
        message: "Failed to get saved search criteria",
        placement: "top",
        type: "error",
      })
    }
  }, [fetchCriteriaError])

  if (displayAboutSection) {
    tabs.push({
      title: "Overview",
      content: <ArtistAboutQueryRenderer artistID={artistID} />,
    })
  }

  tabs.push({
    title: "Artworks",
    content: (
      <ArtistArtworksQueryRenderer
        artistID={artistID}
        searchCriteria={searchCriteria}
        predefinedFilters={predefinedFilters}
        input={input}
      />
    ),
  })

  if (!!artist?.statuses?.auctionLots) {
    tabs.push({
      title: "Insights",
      content: (tabIndex: number) => (
        <ArtistInsightsQueryRenderer
          tabIndex={tabIndex}
          artistID={artistID}
          initialFilters={auctionResultsInitialFilters}
        />
      ),
    })
  }

  // Set initial tab
  tabs.forEach((tab) => {
    tab.initial = tab.title === initialTab
  })

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: artist.slug,
        context_screen_owner_id: artist.internalID,
      }}
    >
      <Flex style={{ flex: 1 }}>
        <StickyTabPage
          staticHeaderContent={<ArtistHeaderFragmentContainer artist={artist!} />}
          tabs={tabs}
          bottomContent={<ArtistHeaderFloatingButtonsFragmentContainer artist={artist} />}
          lazyLoadTabs
          disableBackButtonUpdate
        />
      </Flex>
    </ProvideScreenTracking>
  )
}

interface ArtistQueryRendererProps {
  environment?: RelayModernEnvironment
  initialTab?: string
  searchCriteriaID?: string
  search_criteria_id?: string
  artistID: string
  predefinedFilters?: FilterArray
  categories?: string[]
  sizes?: string[]
}

export const ArtistScreenQuery = graphql`
  query ArtistQuery($artistID: String!) {
    artist(id: $artistID) {
      internalID
      slug
      has_metadata: hasMetadata
      counts {
        partner_shows: partnerShows
        related_artists: relatedArtists
      }
      ...ArtistHeader_artist
      ...ArtistHeaderFloatingButtons_artist
      statuses {
        auctionLots
        articles
      }
    }
  }
`

export const defaultArtistVariables = () => ({
  input: {
    sort: DEFAULT_ARTWORK_SORT.paramValue,
  },
})

export const ArtistQueryRenderer: React.FC<ArtistQueryRendererProps> = (props) => {
  const {
    artistID,
    environment,
    initialTab,
    searchCriteriaID,
    search_criteria_id,
    predefinedFilters,
    categories,
    sizes,
  } = props

  return (
    <SearchCriteriaQueryRenderer
      searchCriteriaId={searchCriteriaID ?? search_criteria_id}
      environment={environment}
      render={{
        renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
        renderComponent: (searchCriteriaProps) => {
          const { savedSearchCriteria, fetchCriteriaError } = searchCriteriaProps
          const predefinedFilterParams = filterArtworksParams(predefinedFilters ?? [], "artwork")
          let initialArtworksInput = {
            ...defaultArtistVariables().input,
            ...predefinedFilterParams,
          }

          if (savedSearchCriteria) {
            const preparedCriteria = getOnlyFilledSearchCriteriaValues(savedSearchCriteria)

            initialArtworksInput = {
              ...initialArtworksInput,
              ...preparedCriteria,
              sort: "-published_at",
            }
          }
          const input = prepareFilterArtworksParamsForInput(initialArtworksInput)

          return (
            <QueryRenderer<ArtistQuery>
              environment={getRelayEnvironment()}
              variables={{ artistID }}
              query={ArtistScreenQuery}
              render={renderWithPlaceholder({
                Container: Artist,
                initialProps: {
                  initialTab: initialTab,
                  searchCriteria: savedSearchCriteria,
                  fetchCriteriaError: fetchCriteriaError,
                  predefinedFilters: predefinedFilters,
                  auctionResultsInitialFilters: getFilterArrayFromQueryParams({
                    categories: categories ?? [],
                    sizes: sizes ?? [],
                  }),
                  artistID,
                  input: input as FilterArtworksInput,
                },
                renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
                renderFallback: () => null,
              })}
            />
          )
        },
      }}
    />
  )
}
