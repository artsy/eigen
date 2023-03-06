import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { TappedCollectionGroup } from "@artsy/cohesion/dist/Schema/Events/Tap"
import { Box, Text, TextProps } from "@artsy/palette-mobile"
import { CuratedCollectionItem_collection$key } from "__generated__/CuratedCollectionItem_collection.graphql"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/Home/CardRailCard"
import { ThreeUpImageLayout } from "app/Components/ThreeUpImageLayout"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { compact } from "lodash"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface CuratedCollectionItemProps {
  collection: CuratedCollectionItem_collection$key
  position: number
}

export const CuratedCollectionItem: React.FC<CuratedCollectionItemProps> = ({
  collection,
  position,
}) => {
  const tracking = useTracking()
  const item = useFragment(CuratedCollectionItemFragment, collection)
  const imageURLs = extractNodes(item.artworksConnection, (artwork) => artwork.image?.url)
  const availableArtworkImageURLs = compact(imageURLs)
  const textVariant: TextProps["variant"] = isPad() ? "xs" : "sm-display"

  const onPress = () => {
    tracking.trackEvent(trackingEvent.tappedCollectionGroup(item.internalID, item.slug, position))

    navigate(`/collection/${item.slug}`)
  }

  return (
    <CardRailCard onPress={onPress}>
      <Box>
        <ThreeUpImageLayout imageURLs={availableArtworkImageURLs} />
        <CardRailMetadataContainer>
          <Text variant={textVariant} numberOfLines={1}>
            {item.title}
          </Text>
          <Text variant={textVariant} numberOfLines={1} color="black60">
            Collection
          </Text>
        </CardRailMetadataContainer>
      </Box>
    </CardRailCard>
  )
}

const CuratedCollectionItemFragment = graphql`
  fragment CuratedCollectionItem_collection on MarketingCollection {
    internalID
    slug
    title
    artworksConnection(first: 3) {
      edges {
        node {
          image {
            url(version: "large")
          }
        }
      }
    }
  }
`

const trackingEvent = {
  tappedCollectionGroup: (
    collectionId: string,
    collectionSlug: string,
    position: number
  ): TappedCollectionGroup => ({
    action: ActionType.tappedCollectionGroup,
    context_module: ContextModule.curatedCollections,
    context_screen_owner_type: OwnerType.search,
    destination_screen_owner_type: OwnerType.collection,
    destination_screen_owner_slug: collectionSlug,
    destination_screen_owner_id: collectionId,
    horizontal_slide_position: position,
    type: "thumbnail",
  }),
}
