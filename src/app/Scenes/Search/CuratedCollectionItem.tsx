import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  TappedCollectionGroup,
  TappedCuratedCollection,
} from "@artsy/cohesion/dist/Schema/Events/Tap"
import { CuratedCollectionItem_collection$key } from "__generated__/CuratedCollectionItem_collection.graphql"
import { navigate } from "app/navigation/navigate"
import { Flex, Spacer, Text, Touchable } from "palette"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { IMAGE_SIZE, SearchResultImage } from "./components/SearchResultImage"

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
  const thumbnail = item.thumbnailImage?.resized?.url || null

  const onPress = (collectionId: string, collectionSlug: string) => {
    tracking.trackEvent(trackingEvent.tappedCollectionGroup(collectionId, collectionSlug, position))

    navigate(`/collection/${collectionSlug}`)
  }

  return (
    <Touchable key={item.internalID} onPress={() => onPress(item.internalID, item.slug)}>
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <SearchResultImage imageURL={thumbnail} resultType="Collection" />

        <Spacer ml={1} />

        <Flex flex={1}>
          <Text variant="xs" numberOfLines={1}>
            {item.title}
          </Text>

          <Text variant="xs" color="black60">
            Collection
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  )
}

const CuratedCollectionItemFragment = graphql`
  fragment CuratedCollectionItem_collection on MarketingCollection {
    internalID
    slug
    title
    thumbnailImage {
      resized(width: 40) {
        url
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
