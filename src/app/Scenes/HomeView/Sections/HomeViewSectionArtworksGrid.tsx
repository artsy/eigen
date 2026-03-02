import { Button, Flex } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { GenericGrid_artworks$key } from "__generated__/GenericGrid_artworks.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useCallback, useState } from "react"
import { LayoutChangeEvent } from "react-native"

interface HomeViewSectionArtworksGridProps {
  artworks: GenericGrid_artworks$key
  moreHref: string
  onMorePress: () => void
  onArtworkPress: (artworkSlug: string, artwork?: ArtworkGridItem_artwork$data) => void
}

export const HomeViewSectionArtworksGrid: React.FC<HomeViewSectionArtworksGridProps> = ({
  artworks,
  moreHref,
  onMorePress,
  onArtworkPress,
}) => {
  const [hasGridLaidOut, setHasGridLaidOut] = useState(false)

  const handleGridLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!hasGridLaidOut && event.nativeEvent.layout.height > 0) {
        setHasGridLaidOut(true)
      }
    },
    [hasGridLaidOut]
  )

  return (
    <Flex mx={2} gap={2}>
      <Flex onLayout={handleGridLayout}>
        <GenericGrid artworks={artworks} onPress={onArtworkPress} fitToFrame />
      </Flex>
      {hasGridLaidOut ? (
        <RouterLink to={moreHref} hasChildTouchable onPress={onMorePress}>
          <Button block variant="outline">
            View More
          </Button>
        </RouterLink>
      ) : null}
    </Flex>
  )
}
