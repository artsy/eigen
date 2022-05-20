import { editCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkQuery } from "__generated__/MyCollectionArtworkQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { goBack, navigate, popToRoot } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { compact } from "lodash"
import { Flex, Text } from "palette/elements"
import React, { Suspense, useCallback } from "react"
import { ScrollView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkHeader } from "./Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkAbout } from "./MyCollectionArtworkAbout"
import { MyCollectionArtworkInsights } from "./MyCollectionArtworkInsights"

export enum Tab {
  insights = "Insights",
  about = "About",
}

const MyCollectionArtworkScreenQuery = graphql`
  query MyCollectionArtworkQuery($artworkSlug: String!, $artistInternalID: ID!, $medium: String!) {
    artwork(id: $artworkSlug) {
      ...MyCollectionArtwork_sharedProps @relay(mask: false)
      ...MyCollectionArtworkHeader_artwork
      ...MyCollectionArtworkInsights_artwork
      ...MyCollectionArtworkAbout_artwork
      comparableAuctionResults(first: 6) @optionalField {
        totalCount
      }
      artist {
        internalID
        formattedNationalityAndBirthday
        auctionResultsConnection(first: 3, sort: DATE_DESC) {
          totalCount
        }
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
    }
  }
`

const MyCollectionArtwork: React.FC<MyCollectionArtworkScreenProps> = ({
  artworkSlug,
  artistInternalID,
  medium,
}) => {
  const { trackEvent } = useTracking()

  const data = useLazyLoadQuery<MyCollectionArtworkQuery>(MyCollectionArtworkScreenQuery, {
    artworkSlug,
    // To not let the whole query fail if the artwork doesn't has an artist
    artistInternalID: artistInternalID || "",
    medium,
  })

  const comparableWorksCount = data?.artwork?.comparableAuctionResults?.totalCount
  const auctionResultsCount = data?.artwork?.artist?.auctionResultsConnection?.totalCount

  if (!data.artwork) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>The requested Artwork is not available</Text>
      </Flex>
    )
  }

  const handleEdit = useCallback(() => {
    trackEvent(tracks.editCollectedArtwork(data.artwork!.internalID, data.artwork!.slug))
    GlobalStore.actions.myCollection.artwork.startEditingArtwork(data.artwork as any)

    navigate(`my-collection/artworks/${data.artwork?.internalID}/edit`, {
      passProps: {
        mode: "edit",
        artwork: data.artwork,
        onSuccess: popToRoot,
        onDelete: popToRoot,
      },
    })
  }, [data.artwork])

  const shouldShowInsightsTab =
    !!data?._marketPriceInsights ||
    (comparableWorksCount ?? 0) > 0 ||
    (auctionResultsCount ?? 0) > 0

  const tabs = compact([
    !!shouldShowInsightsTab && {
      title: Tab.insights,
      content: (
        <MyCollectionArtworkInsights
          artwork={data.artwork}
          marketPriceInsights={data.marketPriceInsights}
          me={data.me}
        />
      ),
      initial: true,
    },
    {
      title: Tab.about,
      content: (
        <MyCollectionArtworkAbout
          artwork={data.artwork}
          marketPriceInsights={data.marketPriceInsights}
        />
      ),
    },
  ])

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={goBack}
        rightButtonText="Edit"
        onRightButtonPress={!data.artwork.consignmentSubmission ? handleEdit : undefined}
        hideBottomDivider
      />
      {!!shouldShowInsightsTab ? (
        <StickyTabPage
          tabs={tabs}
          staticHeaderContent={<MyCollectionArtworkHeader artwork={data.artwork} />}
        />
      ) : (
        <ScrollView>
          <MyCollectionArtworkHeader artwork={data.artwork} />
          <MyCollectionArtworkAbout
            renderWithoutScrollView
            artwork={data.artwork}
            marketPriceInsights={data.marketPriceInsights}
          />
        </ScrollView>
      )}
    </>
  )
}

const MyCollectionArtworkPlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex flexDirection="column" justifyContent="space-between" height="100%" pb={8}>
      <PlaceholderBox width="100%" marginBottom={10} />
    </Flex>
  </ProvidePlaceholderContext>
)
export interface MyCollectionArtworkScreenProps {
  artworkSlug: string
  artistInternalID: string
  medium: string
}

export const MyCollectionArtworkScreen: React.FC<MyCollectionArtworkScreenProps> = (props) => {
  return (
    <RetryErrorBoundary
      notFoundTitle="Artwork no longer in My Collection"
      notFoundText="You previously deleted this artwork."
      notFoundBackButtonText="Back to My Collection"
    >
      <Suspense fallback={<MyCollectionArtworkPlaceholder />}>
        <MyCollectionArtwork {...props} />
      </Suspense>
    </RetryErrorBoundary>
  )
}

const tracks = {
  editCollectedArtwork: (internalID: string, slug: string) => {
    return editCollectedArtwork({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
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
    consignmentSubmission {
      inProgress
    }
    artistNames
    category
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
    }
    id
    images {
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
    artworkLocation
    provenance
    slug
    title
    width
  }
`
