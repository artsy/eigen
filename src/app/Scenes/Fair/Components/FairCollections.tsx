import { ActionType, ContextModule, OwnerType, TappedCollectionGroup } from "@artsy/cohesion"
import { FairCollections_fair$data } from "__generated__/FairCollections_fair.graphql"
import { CARD_WIDTH } from "app/Components/Home/CardRailCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { navigate } from "app/navigation/navigate"
import { compact } from "lodash"
import { Box, BoxProps, SmallCard, Text, TouchableWithScale } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

type Collection = FairCollections_fair$data["marketingCollections"][number]

interface FairCollectionsProps extends BoxProps {
  fair: FairCollections_fair$data
}

export const FairCollections: React.FC<FairCollectionsProps> = ({ fair, ...rest }) => {
  const tracking = useTracking()

  const trackTappedCollection = (collectionID: string, collectionSlug: string) => {
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
  }

  if (fair.marketingCollections.length === 0) {
    return null
  }

  return (
    <Box {...rest}>
      <Text mx={2} mb={2} variant="md">
        Curated Highlights
      </Text>

      <CardRailFlatList<Collection>
        data={fair.marketingCollections}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item: collection }) => {
          if (!collection?.artworks?.edges) {
            return null
          }

          const images = compact(collection.artworks.edges.map((edge) => edge?.node?.image?.url))

          return (
            <TouchableWithScale
              key={collection.slug}
              onPress={() => {
                trackTappedCollection(collection.slug, collection.slug)
                navigate(`/collection/${collection.slug}`)
              }}
            >
              <SmallCard
                width={CARD_WIDTH}
                images={images}
                title={collection.title}
                subtitle={collection.category}
              />
            </TouchableWithScale>
          )
        }}
      />
    </Box>
  )
}

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
