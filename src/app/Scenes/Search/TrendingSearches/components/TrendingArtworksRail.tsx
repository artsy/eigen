import { ActionType, ContextModule, OwnerType, type TappedArtworkGroup } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import {
  ArtworkRail_artworks$data,
  ArtworkRail_artworks$key,
} from "__generated__/ArtworkRail_artworks.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { TrendingSectionHeader } from "app/Scenes/Search/TrendingSearches/components/TrendingSectionHeader"
import { getArtworkSignalTrackingFields } from "app/utils/getArtworkSignalTrackingFields"
import { useTracking } from "react-tracking"

interface TrendingArtworksRailProps {
  artworks: ArtworkRail_artworks$key
  title?: string
}

export const TrendingArtworksRail: React.FC<TrendingArtworksRailProps> = ({
  artworks,
  title = "Trending Artworks",
}) => {
  const { trackEvent } = useTracking()

  if (!artworks.length) {
    return null
  }

  const handleArtworkPress = (artwork: ArtworkRail_artworks$data[0], index: number) => {
    const event: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.trendingArtworksRail,
      context_screen_owner_type: OwnerType.search,
      destination_screen_owner_type: OwnerType.artwork,
      destination_screen_owner_id: artwork.internalID,
      destination_screen_owner_slug: artwork.slug,
      horizontal_slide_position: index,
      type: "thumbnail",
      ...getArtworkSignalTrackingFields(artwork.collectorSignals),
    }
    trackEvent(event)
  }

  return (
    <Flex>
      <TrendingSectionHeader title={title} />
      <ArtworkRail
        artworks={artworks}
        showSaveIcon
        onPress={handleArtworkPress}
        contextModule={ContextModule.trendingArtworksRail}
        contextScreenOwnerType={OwnerType.search}
      />
    </Flex>
  )
}
