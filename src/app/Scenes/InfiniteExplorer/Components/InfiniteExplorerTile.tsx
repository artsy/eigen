import { Flex, Image, Text, Touchable } from "@artsy/palette-mobile"
import { InfiniteDiscoveryArtworkCard_artwork$key } from "__generated__/InfiniteDiscoveryArtworkCard_artwork.graphql"
import { infiniteDiscoveryArtworkCardFragment } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryArtworkCard"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Sentinel } from "app/utils/Sentinel"
import { sizeToFit } from "app/utils/useSizeToFit"
import { memo, useState } from "react"
import { View } from "react-native"
import { Blurhash } from "react-native-blurhash"
import { useFragment } from "react-relay"

interface InfiniteExplorerTileProps {
  artwork: InfiniteDiscoveryArtwork
  columnWidth: number
  isFocused: boolean
  isZoomedIn: boolean
  maxTileHeight: number
  onPress: () => void
  tileRef: (view: View | null) => void
}

const BORDER_WIDTH = 3

export const InfiniteExplorerTile: React.FC<InfiniteExplorerTileProps> = memo(
  ({ artwork: artworkProp, columnWidth, isFocused, isZoomedIn, maxTileHeight, onPress, tileRef }) => {
    const artwork = useFragment<InfiniteDiscoveryArtworkCard_artwork$key>(
      infiniteDiscoveryArtworkCardFragment,
      artworkProp
    )

    // Every tile in a column is mounted at once (no FlatList windowing, since
    // the whole canvas pans as one plane) — defer the actual image request
    // until the tile is near the viewport, same technique RouterLink already
    // uses for prefetching, rather than firing hundreds of requests on mount.
    const [shouldLoadImage, setShouldLoadImage] = useState(false)

    if (!artwork) {
      return null
    }

    const image = artwork.images[0]
    const size = sizeToFit(
      { width: image?.width ?? 0, height: image?.height ?? 0 },
      { width: columnWidth, height: maxTileHeight }
    )

    const showOpenButton = isFocused && isZoomedIn

    return (
      <View ref={tileRef} style={{ width: columnWidth }}>
        <Touchable
          accessibilityRole="button"
          disabled={isFocused}
          onPress={onPress}
          testID={`infinite-explorer-tile-${artwork.internalID}`}
        >
          <View
            style={{
              width: size.width,
              height: size.height,
              borderWidth: BORDER_WIDTH,
              borderColor: "black",
            }}
          >
            {shouldLoadImage ? (
              <Image
                src={image?.url ?? ""}
                width={size.width}
                height={size.height}
                blurhash={image?.blurhash}
              />
            ) : (
              <Sentinel threshold={0} onChange={(visible) => visible && setShouldLoadImage(true)}>
                {!!image?.blurhash && (
                  <Blurhash
                    blurhash={image.blurhash}
                    style={{ width: size.width, height: size.height }}
                    decodeWidth={16}
                    decodeHeight={16}
                    decodeAsync
                  />
                )}
              </Sentinel>
            )}
          </View>
        </Touchable>

        {!!showOpenButton && (
          <View style={{ position: "absolute", top: 8, right: 8 }}>
            <RouterLink to={`/artwork/${artwork.slug}`} testID="infinite-explorer-open-button">
              <Flex
                alignItems="center"
                justifyContent="center"
                px="8px"
                py="3px"
                borderRadius={20}
                backgroundColor="rgba(60, 60, 60, 0.45)"
              >
                <Text variant="xxs" color="mono0" style={{ fontSize: 9, lineHeight: 12 }}>
                  Open
                </Text>
              </Flex>
            </RouterLink>
          </View>
        )}
      </View>
    )
  }
)
