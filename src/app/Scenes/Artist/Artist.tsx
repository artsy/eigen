import {
  Flex,
  Join,
  Screen,
  Separator,
  ShareIcon,
  Skeleton,
  SkeletonText,
  Spacer,
  Tabs,
} from "@artsy/palette-mobile"
import { FilterArtworksInput } from "__generated__/ArtistArtworksQuery.graphql"
import { ArtistQuery } from "__generated__/ArtistQuery.graphql"
import { ArtistAboutQueryRenderer } from "app/Components/Artist/ArtistAbout/ArtistAbout"
import { ArtistArtworksQueryRenderer } from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { ArtistInsightsQueryRenderer } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import {
  FilterArray,
  filterArtworksParams,
  getFilterArrayFromQueryParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { DEFAULT_ARTWORK_SORT } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { getOnlyFilledSearchCriteriaValues } from "app/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { SearchCriteriaQueryRenderer } from "app/Scenes/Artist/SearchCriteria"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderGrid } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect } from "react"
import { TouchableOpacity } from "react-native"
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
  const { showShareSheet } = useShareSheet()

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

  const handleSharePress = () => {
    showShareSheet({
      type: "artist",
      internalID: artist.internalID,
      slug: artist.slug,
      artists: [{ name: artist.name }],
      title: artist.name!,
      href: artist.href!,
      currentImageUrl: artist.image?.url ?? undefined,
    })
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: artist.slug,
        context_screen_owner_id: artist.internalID,
      }}
    >
      <ArtworkFiltersStoreProvider>
        <Tabs.TabsWithHeader
          initialTabName={initialTab}
          title={artist.name!}
          headerProps={{
            rightElements: (
              <>
                <TouchableOpacity onPress={handleSharePress}>
                  <ShareIcon width={23} height={23} />
                </TouchableOpacity>
              </>
            ),
            onBack: goBack,
          }}
          BelowTitleHeaderComponent={() => <ArtistHeaderFragmentContainer artist={artist} />}
        >
          {displayAboutSection ? (
            <Tabs.Tab name="Overview" label="Overview">
              <Tabs.Lazy>
                <>
                  <ArtistAboutQueryRenderer artistID={artistID} />
                </>
              </Tabs.Lazy>
            </Tabs.Tab>
          ) : null}

          <Tabs.Tab name="Artworks" label="Artworks">
            <Tabs.Lazy>
              <ArtistArtworksQueryRenderer
                artistID={artistID}
                searchCriteria={searchCriteria}
                predefinedFilters={predefinedFilters}
                input={input}
              />
            </Tabs.Lazy>
          </Tabs.Tab>

          {!!artist?.statuses?.auctionLots ? (
            <Tabs.Tab name="Insights" label="Insights">
              <Tabs.Lazy>
                <>
                  <ArtistInsightsQueryRenderer
                    artistID={artistID}
                    initialFilters={auctionResultsInitialFilters}
                  />
                </>
              </Tabs.Lazy>
            </Tabs.Tab>
          ) : null}
        </Tabs.TabsWithHeader>
      </ArtworkFiltersStoreProvider>
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
      ...ArtistHeader_artist
      internalID
      slug
      has_metadata: hasMetadata
      counts {
        partner_shows: partnerShows
        related_artists: relatedArtists
      }
      href
      name
      image {
        url(version: "large")
      }
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
        renderPlaceholder: () => <ArtistSkeleton />,
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
              environment={environment || getRelayEnvironment()}
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
                renderFallback: () => null,
                renderPlaceholder: () => <ArtistSkeleton />,
              })}
            />
          )
        },
      }}
    />
  )
}

const ArtistSkeleton: React.FC = () => {
  return (
    <Screen>
      <Screen.Header rightElements={<ShareIcon width={23} height={23} />} />
      <Screen.Body fullwidth>
        <Skeleton>
          <Flex px={2}>
            <Join separator={<Spacer y={0.5} />}>
              <SkeletonText variant="lg">Artist Name Artist Name</SkeletonText>
              <SkeletonText variant="xs">American, b. 1945</SkeletonText>
              <SkeletonText variant="xs">40 Works, 45 Followers</SkeletonText>
            </Join>
          </Flex>

          <Spacer y={4} />

          {/* Tabs */}
          <Flex justifyContent="space-around" flexDirection="row" px={2}>
            <SkeletonText variant="xs">Overview</SkeletonText>
            <SkeletonText variant="xs">Artworks</SkeletonText>
            <SkeletonText variant="xs">Insights</SkeletonText>
          </Flex>
        </Skeleton>

        <Separator mt={1} mb={4} />

        <PlaceholderGrid />
      </Screen.Body>
    </Screen>
  )
}
