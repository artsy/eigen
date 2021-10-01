import {
  ArtistAboveTheFoldQuery,
  ArtistAboveTheFoldQueryVariables,
} from "__generated__/ArtistAboveTheFoldQuery.graphql"
import {
  ArtistBelowTheFoldQuery,
  ArtistBelowTheFoldQueryVariables,
} from "__generated__/ArtistBelowTheFoldQuery.graphql"
import { ArtistAboutContainer } from "lib/Components/Artist/ArtistAbout/ArtistAbout"
import ArtistArtworks from "lib/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistHeaderFragmentContainer, ArtistHeaderPlaceholder } from "lib/Components/Artist/ArtistHeader"
import { ArtistInsightsFragmentContainer } from "lib/Components/Artist/ArtistInsights/ArtistInsights"
import { DEFAULT_ARTWORK_SORT } from "lib/Components/ArtworkFilter/Filters/SortOptions"
import { getOnlyFilledSearchCriteriaValues } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import { usePopoverMessage } from "lib/Components/PopoverMessage/popoverMessageHooks"
import { StickyTabPage, TabProps } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SearchCriteriaQueryRenderer } from "lib/Scenes/Artist/SearchCriteria"
import { AboveTheFoldQueryRenderer } from "lib/utils/AboveTheFoldQueryRenderer"
import { PlaceholderGrid, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { Flex, Message, Spacer } from "palette"
import React from "react"
import { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import { graphql } from "react-relay"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"

const INITIAL_TAB = "Artworks"
export interface NotificationPayload {
  searchCriteriaID?: string
}

interface ArtistProps {
  artistAboveTheFold?: ArtistAboveTheFoldQuery["response"]["artist"]
  artistBelowTheFold?: ArtistBelowTheFoldQuery["response"]["artist"]
  initialTab?: string
  searchCriteria: SearchCriteriaAttributes | null
  fetchCriteriaError: Error | null
}

export const Artist: React.FC<ArtistProps> = (props) => {
  const { artistAboveTheFold, artistBelowTheFold, initialTab = INITIAL_TAB, searchCriteria, fetchCriteriaError } = props
  const popoverMessage = usePopoverMessage()
  const tabs: TabProps[] = []
  const displayAboutSection =
    artistAboveTheFold?.has_metadata ||
    (artistAboveTheFold?.counts?.articles ?? 0) > 0 ||
    (artistAboveTheFold?.counts?.related_artists ?? 0) > 0

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

  const isLoading = !artistAboveTheFold

  if (isLoading || displayAboutSection) {
    tabs.push({
      title: "Overview",
      content: artistBelowTheFold ? <ArtistAboutContainer artist={artistBelowTheFold} /> : <LoadingPage />,
    })
  }

  if (isLoading || (artistAboveTheFold?.counts?.artworks ?? 0) > 0) {
    tabs.push({
      title: "Artworks",
      content: artistAboveTheFold ? (
        <ArtistArtworks artist={artistAboveTheFold} searchCriteria={searchCriteria} />
      ) : (
        <ArtworksTabPlaceholder />
      ),
    })
  }

  if (isLoading || artistAboveTheFold?.auctionResultsConnection?.totalCount) {
    tabs.push({
      title: "Insights",
      content: artistBelowTheFold ? (
        (tabIndex: number) => <ArtistInsightsFragmentContainer tabIndex={tabIndex} artist={artistBelowTheFold} />
      ) : (
        <LoadingPage />
      ),
    })
  }

  if (!isLoading && tabs.length === 0) {
    tabs.push({
      title: "Artworks",
      content: (
        <StickyTabPageScrollView>
          <Message>
            There aren’t any works available by the artist at this time. Follow to receive notifications when new works
            are added.
          </Message>
        </StickyTabPageScrollView>
      ),
    })
  }

  // Set initial tab
  tabs.forEach((tab) => {
    tab.initial = tab.title === initialTab
  })

  const ScreenComponent = () => (
    <Flex style={{ flex: 1 }}>
      <StickyTabPage
        staticHeaderContent={
          isLoading ? <ArtistHeaderPlaceholder /> : <ArtistHeaderFragmentContainer artist={artistAboveTheFold} />
        }
        tabs={tabs}
        loading={isLoading}
      />
    </Flex>
  )

  // Don't track before the content is loaded include data about the artist (id & slug) in the event
  if (isLoading) {
    return <ScreenComponent />
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: artistAboveTheFold?.slug,
        context_screen_owner_id: artistAboveTheFold?.internalID,
      }}
    >
      <ScreenComponent />
    </ProvideScreenTracking>
  )
}

interface ArtistQueryRendererProps extends ArtistAboveTheFoldQueryVariables, ArtistBelowTheFoldQueryVariables {
  environment?: RelayModernEnvironment
  initialTab?: string
  searchCriteriaID?: string
}

export const ArtistQueryRenderer: React.FC<ArtistQueryRendererProps> = (props) => {
  const { artistID, environment, initialTab, searchCriteriaID } = props

  return (
    <SearchCriteriaQueryRenderer
      searchCriteriaId={searchCriteriaID}
      environment={environment}
      render={{
        renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
        renderComponent: (searchCriteriaProps) => {
          const { savedSearchCriteria, fetchCriteriaError } = searchCriteriaProps
          const preparedSavedSearchCriteria = getOnlyFilledSearchCriteriaValues(savedSearchCriteria ?? {})
          const initialArtworksInput = {
            dimensionRange: "*-*",
            sort: !!savedSearchCriteria ? "-published_at" : DEFAULT_ARTWORK_SORT.paramValue,
            ...preparedSavedSearchCriteria,
          }

          return (
            <AboveTheFoldQueryRenderer<ArtistAboveTheFoldQuery, ArtistBelowTheFoldQuery>
              environment={environment || defaultEnvironment}
              above={{
                query: graphql`
                  query ArtistAboveTheFoldQuery($artistID: String!, $input: FilterArtworksInput) {
                    artist(id: $artistID) {
                      internalID
                      slug
                      has_metadata: hasMetadata
                      counts {
                        artworks
                        partner_shows: partnerShows
                        related_artists: relatedArtists
                        articles
                      }
                      ...ArtistHeader_artist
                      ...ArtistArtworks_artist @arguments(input: $input)
                      auctionResultsConnection {
                        totalCount
                      }
                    }
                  }
                `,
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
              render={({ props: renderProps }) => {
                return (
                  <Artist
                    artistAboveTheFold={renderProps?.above?.artist}
                    artistBelowTheFold={renderProps?.below?.artist}
                    initialTab={initialTab}
                    searchCriteria={savedSearchCriteria}
                    fetchCriteriaError={fetchCriteriaError}
                  />
                )
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

const ArtworksTabPlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <StickyTabPageScrollView>
        <Spacer mb={1} />
        <PlaceholderGrid mx={0} />
      </StickyTabPageScrollView>
    </ProvidePlaceholderContext>
  )
}
