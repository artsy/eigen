import { ActionType, ContextModule, EditCollectedArtwork, OwnerType } from "@artsy/cohesion"
import {
  DEFAULT_HIT_SLOP,
  Flex,
  Join,
  Screen,
  Separator,
  Spinner,
  Text,
} from "@artsy/palette-mobile"
import { MyCollectionArtworkQuery } from "__generated__/MyCollectionArtworkQuery.graphql"
import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"
import { MyCollectionArtworkAboutWork } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkAbout/MyCollectionArtworkAboutWork"
import { MyCollectionArtworkArticles } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkAbout/MyCollectionArtworkArticles"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { getVortexMedium } from "app/utils/marketPriceInsightHelpers"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { Suspense, useCallback, useState } from "react"
import { RefreshControl, TouchableOpacity } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkHeader } from "./Components/MyCollectionArtworkHeader"
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

  const [isRefreshing, setIsRefetching] = useState(false)

  const queryVariables = {
    artworkId: artworkId || "",
    // To not let the whole query fail if the artwork doesn't has an artist
    artistInternalID: artistInternalID || "",
    // TODO: Fix this logic once we only need category to fetch insights
    medium: getVortexMedium(medium, category),
  }
  const data = useLazyLoadQuery<MyCollectionArtworkQuery>(
    MyCollectionArtworkScreenQuery,
    queryVariables,
    { fetchPolicy: "store-and-network" }
  )

  const { artwork } = data

  const refetch = () => {
    fetchQuery(getRelayEnvironment(), MyCollectionArtworkScreenQuery, queryVariables).subscribe({
      complete: () => {
        setIsRefetching(false)
      },
      error: () => {
        setIsRefetching(false)
      },
    })
  }

  const handleEdit = useCallback(() => {
    if (!artwork) {
      return
    }

    trackEvent(tracks.editCollectedArtwork(artwork?.internalID, artwork?.slug))
    GlobalStore.actions.myCollection.artwork.startEditingArtwork(artwork as any)

    navigate(`my-collection/artworks/${artwork?.internalID}/edit`, {
      passProps: {
        mode: "edit",
      },
    })
  }, [artwork])

  if (!artwork) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>The requested Artwork is not available</Text>
      </Flex>
    )
  }

  const articles = extractNodes(artwork.artist?.articles)

  return (
    <Screen>
      <Screen.Header
        onBack={goBack}
        rightElements={
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleEdit}
            hitSlop={DEFAULT_HIT_SLOP}
          >
            <Text color="mono100">Edit</Text>
          </TouchableOpacity>
        }
      />

      <Screen.ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefetching(true)
              refetch()
            }}
          />
        }
      >
        <Join
          flatten
          separator={
            <Flex m={2}>
              <Separator borderColor="mono10" />
            </Flex>
          }
        >
          <MyCollectionArtworkHeader artwork={artwork} />

          <MyCollectionArtworkAboutWork
            artwork={artwork}
            marketPriceInsights={data.marketPriceInsights}
          />

          <MyCollectionArtworkInsights artwork={artwork} />

          {articles.length > 0 && (
            <MyCollectionArtworkArticles
              artistSlug={artwork.artist?.slug}
              artistNames={artwork.artistNames}
              articles={articles}
              totalCount={artwork.artist?.articles?.totalCount}
            />
          )}
        </Join>
      </Screen.ScrollView>
    </Screen>
  )
}

export const MyCollectionArtworkScreenQuery = graphql`
  query MyCollectionArtworkQuery($artworkId: String!, $artistInternalID: ID!, $medium: String!) {
    artwork(id: $artworkId) {
      ...MyCollectionArtwork_sharedProps @relay(mask: false)
      ...MyCollectionArtworkHeader_artwork #new
      ...MyCollectionArtworkInsights_artwork #new
      ...MyCollectionArtworkAboutWork_artwork #new
      comparableAuctionResults(first: 6) @optionalField {
        totalCount
      }
      artist {
        internalID
        initials
        slug
        formattedNationalityAndBirthday
        auctionResultsConnection(first: 3, sort: DATE_DESC) {
          totalCount
        }
        articles: articlesConnection(first: 10, sort: PUBLISHED_AT_DESC) {
          totalCount
          edges {
            node {
              ...MyCollectionArtworkArticles_article
            }
          }
        }
      }
      marketPriceInsights @optionalField {
        ...MyCollectionArtworkArtistMarket_artworkPriceInsights
        ...MyCollectionArtworkDemandIndex_artworkPriceInsights
      }
    }
    marketPriceInsights(artistId: $artistInternalID, medium: $medium) @optionalField {
      ...MyCollectionArtworkAboutWork_marketPriceInsights
    }

    _marketPriceInsights: marketPriceInsights(artistId: $artistInternalID, medium: $medium)
      @optionalField {
      annualLotsSold
    }
  }
`

const MyCollectionArtworkPlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex
      height="100%"
      pb="8px"
      testID="my-collection-artwork-placeholder"
      flex={1}
      justifyContent="center"
      alignItems="center"
    >
      <Spinner size="large" />
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
        isTargetSupply
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
