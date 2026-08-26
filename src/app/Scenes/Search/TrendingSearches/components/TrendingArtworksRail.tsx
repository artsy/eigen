import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworkRail_artworks$key } from "__generated__/ArtworkRail_artworks.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { TrendingSectionHeader } from "app/Scenes/Search/TrendingSearches/components/TrendingSectionHeader"
import { useEffect, useRef } from "react"
import { FlatList } from "react-native"

interface TrendingArtworksRailProps {
  artworks: ArtworkRail_artworks$key
  resetKey?: string
  title?: string
}

export const TrendingArtworksRail: React.FC<TrendingArtworksRailProps> = ({
  artworks,
  resetKey,
  title = "Trending Artworks",
}) => {
  const listRef = useRef<FlatList<any>>(null)

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false })
  }, [resetKey])

  if (!artworks.length) {
    return null
  }

  return (
    <Flex>
      <TrendingSectionHeader title={title} />
      <ArtworkRail
        artworks={artworks}
        listRef={listRef}
        showSaveIcon
        contextModule={ContextModule.trendingArtworksRail}
        contextScreenOwnerType={OwnerType.search}
      />
    </Flex>
  )
}
