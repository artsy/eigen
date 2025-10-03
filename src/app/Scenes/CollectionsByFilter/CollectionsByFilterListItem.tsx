import { ChevronRightIcon } from "@artsy/icons/native"
import { Flex, Skeleton, SkeletonText } from "@artsy/palette-mobile"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { CollectionsByFilterListItem_artworkFilter$key } from "__generated__/CollectionsByFilterListItem_artworkFilter.graphql"
import { ArtworkRail, ArtworkRailPlaceholder } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { useCollectionByCategoryTracking } from "app/Scenes/CollectionsByCategory/hooks/useCollectionByCategoryTracking"
import { extractNodes } from "app/utils/extractNodes"
import { FC, memo } from "react"
import { graphql, useFragment } from "react-relay"

export interface CollectionsByFilterListItemProps {
  artwork: CollectionsByFilterListItem_artworkFilter$key
}

export const CollectionsByFilterListItem = memo<CollectionsByFilterListItemProps>(
  ({ artwork }) => {
    const data = useFragment(fragment, artwork)
    const { trackArtworkRailItemTap, trackArtworkRailViewAllTap } =
      useCollectionByCategoryTracking()

    if (!data?.artworksConnection) {
      return
    }

    const handleTitlePress = () => {
      trackArtworkRailViewAllTap(data.title)
    }

    const handleArtworkPress = (artwork: ArtworkRail_artworks$data[0], index: number) => {
      trackArtworkRailItemTap(artwork.internalID, index)
    }

    const href = `${data.href}&title=${encodeURI(data.title)}&disableSubtitle=true`
    const artworks = extractNodes(data.artworksConnection)

    return (
      <Flex pl={2}>
        <SectionTitle
          href={href}
          pr={2}
          onPress={handleTitlePress}
          RightButtonContent={() => <ChevronRightIcon fill="mono60" ml={0.5} />}
          title={data.title}
          titleVariant="md"
        />

        <ArtworkRail
          onPress={handleArtworkPress}
          artworks={artworks}
          ListHeaderComponent={null}
          showSaveIcon
          showPartnerName
        />
      </Flex>
    )
  },
  (prev, next) => {
    return prev.artwork === next.artwork
  }
)

export const ITEM_HEIGHT = 393

const fragment = graphql`
  fragment CollectionsByFilterListItem_artworkFilter on ArtworkFilterNode {
    title
    href
    artworksConnection(first: 10, sort: "-decayed_merch") {
      edges {
        node {
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

export const CollectionsByFilterListItemPlaceholder: FC = () => {
  return (
    <Skeleton>
      <Flex pl={2}>
        <Flex justifyContent="space-between" flexDirection="row">
          <SkeletonText variant="md">Category title</SkeletonText>
          <ChevronRightIcon />
        </Flex>

        <ArtworkRailPlaceholder />
      </Flex>
    </Skeleton>
  )
}
