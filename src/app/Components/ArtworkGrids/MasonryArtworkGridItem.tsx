import { ScreenOwnerType } from "@artsy/cohesion"
import { Flex, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { useNavigateToPageableRoute } from "app/system/navigation/useNavigateToPageableRoute"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { FragmentRefs } from "relay-runtime"

interface Artwork {
  readonly id: string
  readonly image: {
    readonly aspectRatio: number
  } | null
  readonly slug: string
  readonly " $fragmentSpreads": FragmentRefs<"ArtworkGridItem_artwork">
}

interface MasonryArtworkGridItemProps {
  item: Artwork
  index: number
  columnIndex: number
  contextScreenOwnerType?: ScreenOwnerType
  contextScreen?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  navigateToPageableRoute: ReturnType<typeof useNavigateToPageableRoute>["navigateToPageableRoute"]
}

export const MasonryArtworkGridItem: React.FC<MasonryArtworkGridItemProps> = ({
  item,
  index,
  columnIndex,
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreen,
  navigateToPageableRoute,
  ...rest
}) => {
  const space = useSpace()
  const { width } = useScreenDimensions()

  const imgAspectRatio = item.image?.aspectRatio ?? 1
  const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
  const imgHeight = imgWidth / imgAspectRatio

  return (
    <Flex
      pl={columnIndex === 0 ? 0 : 1}
      pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
      mt={2}
    >
      <ArtworkGridItem
        {...rest}
        itemIndex={index}
        contextScreenOwnerType={contextScreenOwnerType}
        contextScreenOwnerId={contextScreenOwnerId}
        contextScreenOwnerSlug={contextScreenOwnerSlug}
        contextScreen={contextScreen}
        artwork={item}
        height={imgHeight}
        navigateToPageableRoute={navigateToPageableRoute}
      />
    </Flex>
  )
}
