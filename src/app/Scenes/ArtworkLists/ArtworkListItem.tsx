import { HideIcon } from "@artsy/icons/native"
import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtworkListItem_collection$key } from "__generated__/ArtworkListItem_collection.graphql"
import { FourUpImageLayout } from "app/Scenes/ArtworkLists/FourUpImageLayout"
import { StackedImageLayout } from "app/Scenes/ArtworkLists/StackedImageLayout"
import { useArtworkListsColCount } from "app/Scenes/ArtworkLists/useArtworkListsColCount"
import { useFavoritesTracking } from "app/Scenes/Favorites/useFavoritesTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface ArtworkListItemProps {
  artworkList: ArtworkListItem_collection$key
  imagesLayout: "grid" | "stacked"
}

const LABEL_HEIGHT = 45

export const ArtworkListItem: FC<ArtworkListItemProps> = ({ artworkList, imagesLayout }) => {
  const space = useSpace()
  const screen = useScreenDimensions()
  const offset = space(2)
  const numColumns = useArtworkListsColCount()
  const allOffsets = offset * (numColumns + 1)
  const containerWidth = screen.width - allOffsets
  const itemWidth = containerWidth / numColumns
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")

  const item = useFragment(artworkListItemFragment, artworkList)
  const artworkNodes = extractNodes(item.artworksConnection)
  const imageURLs = artworkNodes.map((node) => node.image?.resized?.url ?? null)

  const { trackTappedArtworkList } = useFavoritesTracking()

  return (
    <RouterLink
      to={`/artwork-list/${item.internalID}`}
      onPress={() => {
        trackTappedArtworkList(item.internalID)
      }}
    >
      <Flex
        justifyContent="space-between"
        width={itemWidth}
        height={itemWidth + LABEL_HEIGHT}
        mr={2}
        mb={2}
      >
        {imagesLayout === "grid" ? (
          <FourUpImageLayout imageURLs={imageURLs} cardWidth={itemWidth} />
        ) : (
          <StackedImageLayout imageURLs={imageURLs} cardWidth={itemWidth} />
        )}

        <Flex>
          <Flex flexDirection="row" alignItems="flex-end">
            <Flex flex={1}>
              <Text variant="xs" numberOfLines={1}>
                {item.name}
              </Text>
            </Flex>

            {!item.shareableWithPartners && !!isArtworkListOfferabilityEnabled && (
              <HideIcon ml={0.5} fill="mono100" />
            )}
          </Flex>
          <Text variant="xs" color="mono60" numberOfLines={1}>
            {item.artworksCount} {item.artworksCount === 1 ? "Artwork" : "Artworks"}
          </Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const artworkListItemFragment = graphql`
  fragment ArtworkListItem_collection on Collection {
    name
    internalID
    artworksCount(onlyVisible: true)
    shareableWithPartners
    artworksConnection(first: 4) {
      edges {
        node {
          image {
            resized(height: 300, width: 300, version: "normalized") {
              url
            }
          }
        }
      }
    }
  }
`
