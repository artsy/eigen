import { ActionType, ContextModule, EditCollectedArtwork, OwnerType } from "@artsy/cohesion"
import { DEFAULT_HIT_SLOP, Flex, Screen, Tabs, Text } from "@artsy/palette-mobile"
import { MyCollectionArtworkQuery } from "__generated__/MyCollectionArtworkQuery.graphql"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate, popToRoot } from "app/system/navigation/navigate"
import { getVortexMedium } from "app/utils/marketPriceInsightHelpers"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { Suspense, useCallback } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkHeader } from "./Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkAbout } from "./MyCollectionArtworkAbout"
import { MyCollectionArtworkInsights } from "./MyCollectionArtworkInsights"

export enum Tab {
  insights = "Insights",
  about = "About",
}

const MyCollectionArtwork: React.FC<MyCollectionArtworkScreenProps> = ({
  artworkId,
  artistInternalID,
  medium,
  category,
}) => {
  const { trackEvent } = useTracking()

  const data = useLazyLoadQuery<MyCollectionArtworkQuery>(
    MyCollectionArtworkScreenQuery,
    {
      artworkId: artworkId || "",
      // To not let the whole query fail if the artwork doesn't has an artist
      artistInternalID: artistInternalID || "",
      // TODO: Fix this logic once we only need category to fetch insights
      medium: getVortexMedium(medium, category),
    },
    { fetchPolicy: "store-and-network" }
  )

  const { artwork } = data

  const comparableWorksCount = data?.artwork?.comparableAuctionResults?.totalCount
  const auctionResultsCount = data?.artwork?.artist?.auctionResultsConnection?.totalCount

  const handleEdit = useCallback(() => {
    if (!artwork) {
      return
    }

    trackEvent(tracks.editCollectedArtwork(artwork?.internalID, artwork?.slug))
    GlobalStore.actions.myCollection.artwork.startEditingArtwork(artwork as any)

    navigate(`my-collection/artworks/${artwork?.internalID}/edit`, {
      passProps: {
        mode: "edit",
        onDelete: popToRoot,
      },
    })
  }, [artwork])

  const shouldShowInsightsTab =
    !!data?._marketPriceInsights ||
    (comparableWorksCount ?? 0) > 0 ||
    (auctionResultsCount ?? 0) > 0

  if (!artwork) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>The requested Artwork is not available</Text>
      </Flex>
    )
  }

  return (
    <>
      <Screen>
        <Screen.Body fullwidth>
          <Screen.Header
            onBack={goBack}
            rightElements={
              <TouchableOpacity onPress={handleEdit} hitSlop={DEFAULT_HIT_SLOP}>
                <Text>Edit</Text>
              </TouchableOpacity>
            }
          />
          {!!shouldShowInsightsTab ? (
            <Tabs renderHeader={() => <MyCollectionArtworkHeader artwork={artwork} />}>
              {!!shouldShowInsightsTab && (
                <Tabs.Tab name={Tab.insights} label={Tab.insights}>
                  <Tabs.Lazy>
                    <MyCollectionArtworkInsights
                      artwork={artwork}
                      marketPriceInsights={data.marketPriceInsights}
                      me={data.me}
                    />
                  </Tabs.Lazy>
                </Tabs.Tab>
              )}
              <Tabs.Tab name={Tab.about} label={Tab.about}>
                <Tabs.Lazy>
                  <MyCollectionArtworkAbout
                    me={data.me}
                    artwork={artwork}
                    marketPriceInsights={data.marketPriceInsights}
                  />
                </Tabs.Lazy>
              </Tabs.Tab>
            </Tabs>
          ) : (
            <ScrollView>
              <MyCollectionArtworkHeader artwork={artwork} />
              <MyCollectionArtworkAbout
                me={data.me}
                renderWithoutScrollView
                artwork={artwork}
                marketPriceInsights={data.marketPriceInsights}
              />
            </ScrollView>
          )}
        </Screen.Body>
      </Screen>
    </>
  )
}

export const MyCollectionArtworkScreenQuery = graphql`
  query MyCollectionArtworkQuery($artworkId: String!, $artistInternalID: ID!, $medium: String!) {
    artwork(id: $artworkId) {
      ...MyCollectionArtwork_sharedProps @relay(mask: false)
      ...MyCollectionArtworkHeader_artwork
      ...MyCollectionArtworkInsights_artwork
      ...MyCollectionArtworkAbout_artwork
      comparableAuctionResults(first: 6) @optionalField {
        totalCount
      }
      artist {
        internalID
        initials
        formattedNationalityAndBirthday
        auctionResultsConnection(first: 3, sort: DATE_DESC) {
          totalCount
        }
      }
      marketPriceInsights @optionalField {
        ...MyCollectionArtworkArtistMarket_artworkPriceInsights
        ...MyCollectionArtworkDemandIndex_artworkPriceInsights
      }
    }
    marketPriceInsights(artistId: $artistInternalID, medium: $medium) @optionalField {
      ...MyCollectionArtworkInsights_marketPriceInsights
      ...MyCollectionArtworkAbout_marketPriceInsights
    }
    _marketPriceInsights: marketPriceInsights(artistId: $artistInternalID, medium: $medium)
      @optionalField {
      annualLotsSold
    }
    me {
      ...MyCollectionArtworkInsights_me
      ...MyCollectionArtworkAbout_me
    }
  }
`

const MyCollectionArtworkPlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex flexDirection="column" justifyContent="space-between" height="100%" pb="8px">
      <LoadingSpinner />
    </Flex>
  </ProvidePlaceholderContext>
)
export interface MyCollectionArtworkScreenProps {
  artworkId: string | null
  artistInternalID: string | null
  medium: string | null
  category: string | null
}

export const MyCollectionArtworkScreen: React.FC<MyCollectionArtworkScreenProps> = (props) => {
  return (
    <ProvideScreenTrackingWithCohesionSchema info={tracks.screen(props.artworkId || "")}>
      <RetryErrorBoundary
        notFoundTitle="Artwork no longer in My Collection"
        notFoundText="You previously deleted this artwork."
        notFoundBackButtonText="Back to My Collection"
      >
        <Suspense fallback={<MyCollectionArtworkPlaceholder />}>
          <MyCollectionArtwork {...props} />
        </Suspense>
      </RetryErrorBoundary>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const tracks = {
  editCollectedArtwork: (internalID: string, slug: string): EditCollectedArtwork => ({
    action: ActionType.editCollectedArtwork,
    context_module: ContextModule.myCollectionArtwork,
    context_owner_id: internalID,
    context_owner_slug: slug,
    context_owner_type: OwnerType.myCollectionArtwork,
    platform: "mobile",
  }),

  screen: (id: string) =>
    screen({
      context_screen_owner_type: OwnerType.myCollectionArtwork,
      context_screen_owner_id: id,
    }),
}

/**
 * * IMPORTANT *
 *
 * The following shared artwork fields are needed for initializing the edit
 * artwork view. This is also used for handling mutation view updates.
 *
 * When adding new fields this fragment needs to be updated.
 */
export const ArtworkMetaProps = graphql`
  fragment MyCollectionArtwork_sharedProps on Artwork {
    artist {
      internalID
      formattedNationalityAndBirthday
      targetSupply {
        isP1
      }
    }
    artistNames
    category
    collectorLocation {
      city
      state
      country
      countryCode
    }
    confidentialNotes
    # needed to show the banner inside the edit artwork view
    # TODO: move logic to the edit artwork view https://artsyproduct.atlassian.net/browse/CX-2846
    consignmentSubmission @optionalField {
      displayText
    }
    pricePaid {
      display
      minor
      currencyCode
    }
    date
    depth
    dimensions {
      in
      cm
    }
    editionSize
    editionNumber
    height
    attributionClass {
      name
      shortDescription
    }
    id
    images(includeAll: true) {
      isDefault
      imageURL
      width
      height
      internalID
    }
    internalID
    isEdition
    medium
    metric
    collectorLocation {
      city
      state
      country
    }
    provenance
    slug
    title
    width
  }
`
