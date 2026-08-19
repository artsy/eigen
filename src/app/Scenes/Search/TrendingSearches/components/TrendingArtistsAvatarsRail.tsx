import { Flex, Text, useSpace } from "@artsy/palette-mobile"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { TrendingSectionHeader } from "app/Scenes/Search/TrendingSearches/components/TrendingSectionHeader"
import { TrendingArtist } from "app/Scenes/Search/TrendingSearches/useTrendingSearches"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FlatList } from "react-native"

const AVATAR_SIZE = 68
const ITEM_WIDTH = 80

interface TrendingArtistsAvatarsRailProps {
  artists: TrendingArtist[]
  title?: string
}

export const TrendingArtistsAvatarsRail: React.FC<TrendingArtistsAvatarsRailProps> = ({
  artists,
  title = "Trending Artists",
}) => {
  const space = useSpace()

  if (!artists.length) {
    return null
  }

  return (
    <Flex>
      <TrendingSectionHeader title={title} />

      <FlatList
        horizontal
        data={artists}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
        keyExtractor={(artist) => artist.internalID}
        renderItem={({ item: artist }) => (
          <RouterLink to={artist.href} style={{ width: ITEM_WIDTH }}>
            <Flex alignItems="center">
              <Flex
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
                borderRadius={AVATAR_SIZE / 2}
                overflow="hidden"
                backgroundColor="mono10"
              >
                <ImageWithFallback
                  src={artist.coverArtwork?.image?.url}
                  blurhash={artist.coverArtwork?.image?.blurhash}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                />
              </Flex>

              <Text variant="xs" numberOfLines={2} textAlign="center" mt={0.5}>
                {artist.name}
              </Text>
            </Flex>
          </RouterLink>
        )}
      />
    </Flex>
  )
}
