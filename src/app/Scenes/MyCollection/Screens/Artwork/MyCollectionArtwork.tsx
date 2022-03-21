import { editCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkQuery } from "__generated__/MyCollectionArtworkQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { goBack, navigate, popToRoot } from "app/navigation/navigate"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { compact } from "lodash"
import { Flex, Text } from "palette/elements"
import React, { Suspense, useCallback } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkAbout } from "./MyCollectionArtworkAbout"
import { MyCollectionArtworkInsights } from "./MyCollectionArtworkInsights"
import { MyCollectionArtworkHeader } from "./NewComponents/NewMyCollectionArtworkHeader"
import { OldMyCollectionArtworkQueryRenderer } from "./OldMyCollectionArtwork"

export enum Tab {
  insights = "Insights",
  about = "About",
}

const MyCollectionArtworkScreenQuery = graphql`
  query MyCollectionArtworkQuery($artworkSlug: String!, $artistInternalID: ID!, $medium: String!) {
    artwork(id: $artworkSlug) {
      ...MyCollectionArtwork_sharedProps @relay(mask: false)
      ...NewMyCollectionArtworkHeader_artwork
      ...MyCollectionArtworkInsights_artwork
      ...MyCollectionArtworkAbout_artwork
    }
    marketPriceInsights(artistId: $artistInternalID, medium: $medium) {
      ...MyCollectionArtworkInsights_marketPriceInsights
      ...MyCollectionArtworkAbout_marketPriceInsights
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
    artistInternalID,
    medium,
  })

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

  const tabs = compact([
    {
      title: Tab.insights,
      content: (
        <MyCollectionArtworkInsights
          artwork={data.artwork}
          marketPriceInsights={data.marketPriceInsights}
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
      <StickyTabPage
        tabs={tabs}
        staticHeaderContent={<MyCollectionArtworkHeader artwork={data.artwork} />}
      />
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

export const MyCollectionArtworkQueryRenderer: React.FC<MyCollectionArtworkScreenProps> = (
  props
) => {
  const AREnableNewMyCollectionArtwork = useFeatureFlag("AREnableNewMyCollectionArtwork")

  if (AREnableNewMyCollectionArtwork) {
    return (
      <Suspense fallback={<MyCollectionArtworkPlaceholder />}>
        <MyCollectionArtwork {...props} />
      </Suspense>
    )
  }

  return <OldMyCollectionArtworkQueryRenderer {...props} />
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
