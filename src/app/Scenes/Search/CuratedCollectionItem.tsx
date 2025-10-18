import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { TappedCollectionGroup } from "@artsy/cohesion/dist/Schema/Events/Tap"
import { Box, Text, TextProps } from "@artsy/palette-mobile"
import { CuratedCollectionItem_collection$key } from "__generated__/CuratedCollectionItem_collection.graphql"
import { CardRailCard, CardRailMetadataContainer } from "app/Components/CardRail/CardRailCard"
import { MultipleImageLayout } from "app/Components/MultipleImageLayout"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { isTablet } from "react-native-device-info"
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
  const textVariant: TextProps["variant"] = isTablet() ? "xs" : "sm-display"

  const onPress = () => {
    tracking.trackEvent(trackingEvent.tappedCollectionGroup(item.internalID, item.slug, position))
  }

  return (
    <RouterLink to={`/collection/${item.slug}`} onPress={onPress} hasChildTouchable>
      <CardRailCard>
        <Box>
          <MultipleImageLayout imageURLs={availableArtworkImageURLs} />
          <CardRailMetadataContainer>
            <Text variant={textVariant} numberOfLines={1}>
              {item.title}
            </Text>
            <Text variant={textVariant} numberOfLines={1} color="mono60">
              Collection
            </Text>
          </CardRailMetadataContainer>
        </Box>
      </CardRailCard>
    </RouterLink>
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
