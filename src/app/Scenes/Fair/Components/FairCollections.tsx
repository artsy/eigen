import { ActionType, ContextModule, OwnerType, TappedCollectionGroup } from "@artsy/cohesion"
import { Box, BoxProps, TouchableWithScale } from "@artsy/palette-mobile"
import { FairCollections_fair$data } from "__generated__/FairCollections_fair.graphql"
import { CARD_WIDTH } from "app/Components/CardRail/CardRailCard"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { SmallCard } from "app/Components/Cards"
import { SectionTitle } from "app/Components/SectionTitle"
import { RouterLink } from "app/system/navigation/RouterLink"
import { isNewArchitectureEnabled } from "app/utils/isNewArchitectureEnabled"
import { compact } from "lodash"
import { memo, useCallback } from "react"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

type Collection = FairCollections_fair$data["marketingCollections"][number]

interface FairCollectionsProps extends BoxProps {
  fair: FairCollections_fair$data
}

export const FairCollections: React.FC<FairCollectionsProps> = memo(({ fair, ...rest }) => {
  const tracking = useTracking()

  const trackTappedCollection = useCallback(
    (collectionID: string, collectionSlug: string) => {
      const trackTappedCollectionProps: TappedCollectionGroup = {
        action: ActionType.tappedCollectionGroup,
        context_module: ContextModule.curatedHighlightsRail,
        context_screen_owner_type: OwnerType.fair,
        context_screen_owner_id: fair.internalID,
        context_screen_owner_slug: fair.slug,
        destination_screen_owner_type: OwnerType.collection,
        destination_screen_owner_id: collectionID,
        destination_screen_owner_slug: collectionSlug,
        type: "thumbnail",
      }
      tracking.trackEvent(trackTappedCollectionProps)
    },
    [fair.internalID, fair.slug, tracking]
  )

  const renderItem = useCallback(
    ({ item: collection }: { item: Collection }) => {
      return (
        <CollectionCard collection={collection} trackTappedCollection={trackTappedCollection} />
      )
    },
    [trackTappedCollection]
  )

  if (fair.marketingCollections.length === 0) {
    return null
  }

  return (
    <Box {...rest}>
      <SectionTitle mx={2} title="Curated Highlights" />

      <CardRailFlatList<Collection>
        // This is required to avoid broken virtualization on nested flatlists
        // See https://artsy.slack.com/archives/C02BAQ5K7/p1752833523972209?thread_ts=1752761208.038099&cid=C02BAQ5K7
        disableVirtualization={!isNewArchitectureEnabled}
        data={fair.marketingCollections}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        windowSize={isTablet() ? 10 : 5}
      />
    </Box>
  )
})

interface CollectionCardProps {
  collection: Collection
  trackTappedCollection: (collectionID: string, collectionSlug: string) => void
}

const CollectionCard: React.FC<CollectionCardProps> = memo(
  ({ collection, trackTappedCollection }) => {
    if (!collection) {
      return null
    }

    const images = compact(collection?.artworks?.edges?.map((edge) => edge?.node?.image?.url)) ?? []

    return (
      <RouterLink
        hasChildTouchable
        key={collection.slug}
        to={`/collection/${collection.slug}`}
        onPress={() => {
          trackTappedCollection(collection.slug, collection.slug)
        }}
      >
        <TouchableWithScale>
          <SmallCard
            width={CARD_WIDTH}
            images={images}
            title={collection.title}
            subtitle={collection.category}
          />
        </TouchableWithScale>
      </RouterLink>
    )
  }
)

export const FairCollectionsFragmentContainer = createFragmentContainer(FairCollections, {
  fair: graphql`
    fragment FairCollections_fair on Fair {
      internalID
      slug
      marketingCollections(size: 5) {
        slug
        title
        category
        artworks: artworksConnection(first: 3) {
          edges {
            node {
              image {
                url(version: "larger")
              }
            }
          }
        }
      }
    }
  `,
})
