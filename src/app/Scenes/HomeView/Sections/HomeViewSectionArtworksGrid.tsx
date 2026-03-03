import { Button, Flex } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { GenericGrid_artworks$key } from "__generated__/GenericGrid_artworks.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useLayoutEffect, useRef, useState } from "react"
import { View } from "react-native"

interface HomeViewSectionArtworksGridProps {
  artworks: GenericGrid_artworks$key
  moreHref: string
  onMorePress: () => void
  onArtworkPress: (
    artworkSlug: string,
    artwork?: ArtworkGridItem_artwork$data,
    itemIndex?: number
  ) => void
}

export const HomeViewSectionArtworksGrid: React.FC<HomeViewSectionArtworksGridProps> = ({
  artworks,
  moreHref,
  onMorePress,
  onArtworkPress,
}) => {
  const [hasGridLaidOut, setHasGridLaidOut] = useState(false)
  const gridContainerRef = useRef<View>(null)

  useLayoutEffect(() => {
    gridContainerRef.current?.measureInWindow((_x, _y, _width, height) => {
      if (height > 0) {
        setHasGridLaidOut(true)
      }
    })
  }, [artworks])

  return (
    <Flex mx={2} gap={2}>
      <View ref={gridContainerRef}>
        <GenericGrid artworks={artworks} onPress={onArtworkPress} fitToFrame />
      </View>
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
