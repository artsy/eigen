import { ArtistAboveTheFoldQuery } from "__generated__/ArtistAboveTheFoldQuery.graphql"
import { ArtistBelowTheFoldQuery } from "__generated__/ArtistBelowTheFoldQuery.graphql"
import { ArtistAboutContainer } from "app/Components/Artist/ArtistAbout/ArtistAbout"
import ArtistArtworks from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { ArtistHeaderFloatingButtonsFragmentContainer } from "app/Components/Artist/ArtistHeaderFloatingButtons"
import { ArtistInsightsFragmentContainer } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import { DEFAULT_ARTWORK_SORT } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { getOnlyFilledSearchCriteriaValues } from "app/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { HeaderTabsGridPlaceholder } from "app/Components/HeaderTabGridPlaceholder"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { StickyTabPage, TabProps } from "app/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { SearchCriteriaQueryRenderer } from "app/Scenes/Artist/SearchCriteria"
import { AboveTheFoldQueryRenderer } from "app/utils/AboveTheFoldQueryRenderer"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Flex } from "palette"
import React, { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import { graphql } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

const INITIAL_TAB = "Artworks"
export interface NotificationPayload {
  searchCriteriaID?: string
}

interface ArtistProps {
  artistAboveTheFold: NonNullable<ArtistAboveTheFoldQuery["response"]["artist"]>
  artistBelowTheFold?: ArtistBelowTheFoldQuery["response"]["artist"]
  initialTab?: string
  searchCriteria: SearchCriteriaAttributes | null
  fetchCriteriaError: Error | null
}

export const Artist: React.FC<ArtistProps> = (props) => {
  const {
    artistAboveTheFold,
    artistBelowTheFold,
    initialTab = INITIAL_TAB,
    searchCriteria,
    fetchCriteriaError,
  } = props
  const popoverMessage = usePopoverMessage()

  const tabs: TabProps[] = []
  const displayAboutSection =
    artistAboveTheFold.has_metadata ||
    !!artistAboveTheFold.statuses?.articles ||
    (artistAboveTheFold.counts?.related_artists ?? 0) > 0

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
      content: artistBelowTheFold ? (
        <ArtistAboutContainer artist={artistBelowTheFold} />
      ) : (
        <LoadingPage />
      ),
    })
  }

  tabs.push({
    title: "Artworks",
    content: <ArtistArtworks artist={artistAboveTheFold} searchCriteria={searchCriteria} />,
  })

  if (!!artistAboveTheFold?.statuses?.auctionLots) {
    tabs.push({
      title: "Insights",
      content: artistBelowTheFold ? (
        (tabIndex: number) => (
          <ArtistInsightsFragmentContainer tabIndex={tabIndex} artist={artistBelowTheFold} />
        )
      ) : (
        <LoadingPage />
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
        context_screen_owner_slug: artistAboveTheFold.slug,
        context_screen_owner_id: artistAboveTheFold.internalID,
      }}
    >
      <Flex style={{ flex: 1 }}>
        <StickyTabPage
          staticHeaderContent={<ArtistHeaderFragmentContainer artist={artistAboveTheFold!} />}
          tabs={tabs}
          bottomContent={
            <ArtistHeaderFloatingButtonsFragmentContainer artist={artistAboveTheFold} />
          }
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
}

export const ArtistScreenQuery = graphql`
  query ArtistAboveTheFoldQuery($artistID: String!, $input: FilterArtworksInput) {
    artist(id: $artistID) {
      internalID
      slug
      has_metadata: hasMetadata
      counts {
        partner_shows: partnerShows
        related_artists: relatedArtists
      }
      ...ArtistHeader_artist
      ...ArtistArtworks_artist @arguments(input: $input)
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
  const { artistID, environment, initialTab, searchCriteriaID, search_criteria_id } = props

  return (
    <SearchCriteriaQueryRenderer
      searchCriteriaId={searchCriteriaID ?? search_criteria_id}
      environment={environment}
      render={{
        renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
        renderComponent: (searchCriteriaProps) => {
          const { savedSearchCriteria, fetchCriteriaError } = searchCriteriaProps
          const preparedSavedSearchCriteria = getOnlyFilledSearchCriteriaValues(
            savedSearchCriteria ?? {}
          )
          const initialArtworksInput = {
            ...defaultArtistVariables().input,
            sort: !!savedSearchCriteria ? "-published_at" : DEFAULT_ARTWORK_SORT.paramValue,
            ...preparedSavedSearchCriteria,
          }

          return (
            <AboveTheFoldQueryRenderer<ArtistAboveTheFoldQuery, ArtistBelowTheFoldQuery>
              environment={environment || defaultEnvironment}
              above={{
                query: ArtistScreenQuery,
                variables: { artistID, input: initialArtworksInput },
              }}
              below={{
                query: graphql`
                  query ArtistBelowTheFoldQuery($artistID: String!) {
                    artist(id: $artistID) {
                      ...ArtistAbout_artist
                      ...ArtistInsights_artist
                    }
                  }
                `,
                variables: { artistID },
              }}
              render={{
                renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
                renderComponent: ({ above, below }) => {
                  if (!above.artist) {
                    throw new Error("no artist data")
                  }
                  return (
                    <Artist
                      artistAboveTheFold={above.artist}
                      artistBelowTheFold={below?.artist}
                      initialTab={initialTab}
                      searchCriteria={savedSearchCriteria}
                      fetchCriteriaError={fetchCriteriaError}
                    />
                  )
                },
              }}
            />
          )
        },
      }}
    />
  )
}

/**
 * Be lazy and just have a simple loading spinner for the below-the-fold tabs
 * (as opposed to nice fancy placeholder screens) since people are really
 * unlikely to tap into them quick enough to see the loading state
 * @param param0
 */
const LoadingPage: React.FC<{}> = ({}) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <ActivityIndicator />
    </View>
  )
}
