import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { InfiniteExplorerTile } from "app/Scenes/InfiniteExplorer/Components/InfiniteExplorerTile"
import { View } from "react-native"

interface InfiniteExplorerColumnProps {
  artworks: InfiniteDiscoveryArtwork[]
  columnRef: (view: View | null) => void
  columnWidth: number
  focusedArtworkId: string | null
  isZoomedIn: boolean
  maxTileHeight: number
  onFocusTile: (artworkId: string) => void
  registerTileRef: (id: string, ref: View | null) => void
}

// A column is just a static vertical stack: the whole canvas (all columns
// together) pans and zooms as one plane via the gesture in InfiniteExplorer,
// so there's no independent scrolling to do here. Some columns (the extra
// ones held in reserve on either side) start out empty, so this renders as a
// zero-height sliver until artworks are distributed into it.
export const InfiniteExplorerColumn: React.FC<InfiniteExplorerColumnProps> = ({
  artworks,
  columnRef,
  columnWidth,
  focusedArtworkId,
  isZoomedIn,
  maxTileHeight,
  onFocusTile,
  registerTileRef,
}) => {
  return (
    <View ref={columnRef} style={{ width: columnWidth }}>
      {artworks.map((artwork) => (
        <InfiniteExplorerTile
          key={artwork.internalID}
          artwork={artwork}
          columnWidth={columnWidth}
          isFocused={focusedArtworkId === artwork.internalID}
          isZoomedIn={isZoomedIn}
          maxTileHeight={maxTileHeight}
          onPress={() => onFocusTile(artwork.internalID)}
          tileRef={(ref) => registerTileRef(artwork.internalID, ref)}
        />
      ))}
    </View>
  )
}
