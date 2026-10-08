import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworkRail_artworks$key } from "__generated__/ArtworkRail_artworks.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { TrendingSectionHeader } from "app/Scenes/Search/TrendingSearches/components/TrendingSectionHeader"

interface TrendingArtworksRailProps {
  artworks: ArtworkRail_artworks$key
  title?: string
}

export const TrendingArtworksRail: React.FC<TrendingArtworksRailProps> = ({
  artworks,
  title = "Trending Artworks",
}) => {
  if (!artworks.length) {
    return null
  }

  return (
    <Flex>
      <TrendingSectionHeader title={title} />
      <ArtworkRail
        artworks={artworks}
        showSaveIcon
        contextModule={ContextModule.trendingArtworksRail}
        contextScreenOwnerType={OwnerType.search}
      />
    </Flex>
  )
}
