import { ActionType, ContextModule, OwnerType, type TappedArtistGroup } from "@artsy/cohesion"
import { Flex, Text, useSpace } from "@artsy/palette-mobile"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { TrendingSectionHeader } from "app/Scenes/Search/TrendingSearches/components/TrendingSectionHeader"
import { TrendingArtist } from "app/Scenes/Search/TrendingSearches/useTrendingSearches"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FlatList } from "react-native"
import { useTracking } from "react-tracking"

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
  const { trackEvent } = useTracking()

  if (!artists.length) {
    return null
  }

  const handleArtistPress = (artist: TrendingArtist, index: number) => {
    const event: TappedArtistGroup = {
      action: ActionType.tappedArtistGroup,
      context_module: ContextModule.trendingArtistsRail,
      context_screen_owner_type: OwnerType.search,
      destination_screen_owner_type: OwnerType.artist,
      destination_screen_owner_id: artist.internalID,
      destination_screen_owner_slug: artist.slug,
      horizontal_slide_position: index,
      type: "thumbnail",
    }
    trackEvent(event)
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
        renderItem={({ item: artist, index }) => (
          <RouterLink
            to={artist.href}
            style={{ width: ITEM_WIDTH }}
            onPress={() => handleArtistPress(artist, index)}
          >
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
