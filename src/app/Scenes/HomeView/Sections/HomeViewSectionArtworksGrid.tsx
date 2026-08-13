import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Button, Flex } from "@artsy/palette-mobile"
import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { GenericGrid_artworks$key } from "__generated__/GenericGrid_artworks.graphql"
import { genericGridFragment } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryArtworkGridItem } from "app/Components/ArtworkGrids/MasonryArtworkGridItem"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { MasonryArtworkItem, NUM_COLUMNS_MASONRY, getColumnIndex } from "app/utils/masonryHelpers"
import { times } from "lodash"
import { useRef } from "react"
import { useFragment } from "react-relay"
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
}

/**
 * A small, fixed-size grid of artworks.
 *
 * The artworks are laid out by hand rather than by a masonry `FlashList`: the list only draws its
 * items on a second render cycle, which made the section flash — empty grid, then a lone "View
 * More" button, then the artworks. At this size virtualization buys us nothing, and rendering
 * directly means the whole section paints at once.
 */
export const HomeViewSectionArtworksGrid: React.FC<HomeViewSectionArtworksGridProps> = ({
  artworks: artworksProp,
  moreHref,
  onMorePress,
  onArtworkPress,
  trackItemImpressions,
  contextModule,
}) => {
  const { trackEvent } = useTracking()
  const enableItemsViewsTracking = useFeatureFlag("ARImpressionsTrackingHomeItemViews")
  const trackedGridItems = useRef<Set<string>>(new Set()).current

  const artworks = useFragment(genericGridFragment, artworksProp)

  // Handles per-item visibility updates for the nested HomeView grid.
  // We use this instead of list-level viewability callbacks for the grid path,
  // because the grid is nested inside the HomeView list.
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
      {/* Mirrors the masonry list's own insets: full width, then a single unit of padding */}
      <Flex mx={-2} px={1} flexDirection="row" accessibilityLabel="Artworks Content View">
        {times(NUM_COLUMNS_MASONRY).map((column) => (
          <Flex key={column} flex={1}>
            {artworks.map((artwork, index) =>
              getColumnIndex(index) === column ? (
                <MasonryArtworkGridItem
                  key={artwork.id}
                  index={index}
                  item={artwork as unknown as MasonryArtworkItem}
                  contextModule={contextModule}
                  contextScreenOwnerType={OwnerType.home}
                  onPress={onArtworkPress}
                  fitToFrame
                  onItemVisibilityChange={handleGridItemVisibilityChange}
                />
              ) : null
            )}
          </Flex>
        ))}
      </Flex>

      <RouterLink to={moreHref} hasChildTouchable onPress={onMorePress}>
        <Button block variant="outline">
          View More
        </Button>
      </RouterLink>
    </Flex>
  )
}
