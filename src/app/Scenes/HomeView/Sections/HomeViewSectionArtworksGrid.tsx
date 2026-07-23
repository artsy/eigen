import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Button, Flex } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { GenericGrid_artworks$key } from "__generated__/GenericGrid_artworks.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { View } from "react-native"
import { useTracking } from "react-tracking"

interface HomeViewSectionArtworksGridProps {
  artworks: GenericGrid_artworks$key
  moreHref: string
  onMorePress: () => void
  onArtworkPress: (
    artworkSlug: string,
    artwork?: ArtworkGridItem_artwork$data,
    itemIndex?: number
  ) => void
  trackItemImpressions?: boolean
  contextModule: ContextModule
  /**
   * Bumped by the parent every time a forced live-refresh of this section completes. Clears the
   * per-item "already tracked" guard so items still on screen re-fire itemViewed for the fresh
   * data, instead of waiting for a visibility transition that may never come.
   */
  refreshKey?: number
}

export const HomeViewSectionArtworksGrid: React.FC<HomeViewSectionArtworksGridProps> = ({
  artworks,
  moreHref,
  onMorePress,
  onArtworkPress,
  trackItemImpressions,
  contextModule,
  refreshKey,
}) => {
  const [hasGridLaidOut, setHasGridLaidOut] = useState(false)
  const gridContainerRef = useRef<View>(null)
  const { trackEvent } = useTracking()
  const enableItemsViewsTracking = useFeatureFlag("ARImpressionsTrackingHomeItemViews")
  const trackedGridItems = useRef<Set<string>>(new Set()).current

  useEffect(() => {
    if (!refreshKey) {
      return
    }

    trackedGridItems.clear()
  }, [refreshKey, trackedGridItems])

  useLayoutEffect(() => {
    gridContainerRef.current?.measureInWindow((_x, _y, _width, height) => {
      if (height > 0) {
        setHasGridLaidOut(true)
      }
    })
  }, [artworks])

  // Handles per-item visibility updates for the nested HomeView grid.
  // We use this instead of list-level viewability callbacks for the grid path,
  // because the masonry list is nested inside the HomeView list.
  const handleGridItemVisibilityChange = (
    artworkID: string,
    itemIndex: number,
    visible: boolean
  ) => {
    const shouldTrack =
      visible &&
      enableItemsViewsTracking &&
      !!trackItemImpressions &&
      !trackedGridItems.has(artworkID)

    if (!shouldTrack) {
      return
    }

    trackEvent(
      HomeAnalytics.trackItemViewed({
        artworkId: artworkID,
        contextModule,
        position: itemIndex,
        type: "artwork",
      })
    )
    trackedGridItems.add(artworkID)
  }

  return (
    <Flex mx={2} gap={2}>
      <View ref={gridContainerRef}>
        <GenericGrid
          artworks={artworks}
          contextModule={contextModule}
          contextScreenOwnerType={OwnerType.home}
          onPress={onArtworkPress}
          fitToFrame
          onItemVisibilityChange={handleGridItemVisibilityChange}
          refreshKey={refreshKey}
        />
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
