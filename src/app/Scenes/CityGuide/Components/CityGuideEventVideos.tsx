import { Flex, Touchable, useColor, useScreenDimensions } from "@artsy/palette-mobile"
import { CityGuideEventVideos_city$key } from "__generated__/CityGuideEventVideos_city.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { FeatureVideo } from "app/Scenes/Feature/FeatureVideo"
import { getYouTubeThumbnailUrl, isValidVideoUrl } from "app/utils/videoHelpers"
import { useState } from "react"
import { FlatList, Image, View } from "react-native"
import { graphql, useFragment } from "react-relay"

/** Every card keeps this shape, regardless of the source video's own aspect ratio. */
const CARD_ASPECT_RATIO = 16 / 9
const SIDE_PADDING = 20

/** Matches CityGuideItinerariesRail's own rail. */
const RAIL_GAP = 10
/** Leaves the next card peeking. */
const RAIL_CARD_WIDTH_RATIO = 0.85

interface Video {
  internalID: string
  playerUrl: string
}

interface Props {
  city: CityGuideEventVideos_city$key | null | undefined
}

export const CityGuideEventVideos: React.FC<Props> = ({ city: cityRef }) => {
  const city = useFragment(fragment, cityRef)
  const { width: screenWidth } = useScreenDimensions()

  // Only one video plays at a time, so its id is enough state for the whole section.
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)

  /*
    A city has an ordered list of videos, attached directly rather than through an event.

    Filtered by `isValidVideoUrl` because that is what decides whether `FeatureVideo` renders
    a player at all: it bails on anything that isn't Vimeo or YouTube. Counting a video the
    player will refuse would leave the heading standing over blank space.
  */
  const videos: Video[] = (city?.cityVideos ?? []).flatMap((attachment) =>
    isValidVideoUrl(attachment.video.playerUrl) ? [attachment.video] : []
  )

  // No videos means no heading either: a "Videos" title over nothing reads as a broken screen.
  if (!videos.length) {
    return null
  }

  const renderCard = (video: Video, width: number) => (
    <CityGuideVideoCard
      key={video.internalID}
      video={video}
      width={width}
      isPlaying={playingVideoId === video.internalID}
      onPlay={() => setPlayingVideoId(video.internalID)}
    />
  )

  return (
    <Flex testID="city-guide-event-videos">
      <Flex px={2}>
        <SectionTitle variant="large" title="Videos" />
      </Flex>

      {videos.length === 1 ? (
        <Flex px={2}>{renderCard(videos[0], screenWidth - SIDE_PADDING * 2)}</Flex>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={videos}
          keyExtractor={(video) => video.internalID}
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
          ItemSeparatorComponent={() => <Flex width={RAIL_GAP} />}
          renderItem={({ item }) =>
            renderCard(item, Math.round(screenWidth * RAIL_CARD_WIDTH_RATIO))
          }
        />
      )}
    </Flex>
  )
}

/**
 * One card, always 16:9. Shows a thumbnail with a play glyph until tapped, then swaps in the
 * real player at the same size — so every video looks the same before playback and nothing
 * resizes when it starts.
 */
const CityGuideVideoCard: React.FC<{
  video: Video
  width: number
  isPlaying: boolean
  onPlay: () => void
}> = ({ video, width, isPlaying, onPlay }) => {
  const height = width / CARD_ASPECT_RATIO

  if (isPlaying) {
    return (
      <Flex testID="city-guide-video-card" width={width} height={height} backgroundColor="black">
        <FeatureVideo videoUrl={video.playerUrl} width={width} height={height} />
      </Flex>
    )
  }

  // Vimeo (and anything else) has no thumbnail source here, so it gets the fixed placeholder
  // instead — every card still keeps the same size and the same play glyph.
  const thumbnailUrl = getYouTubeThumbnailUrl(video.playerUrl)

  return (
    <Touchable testID="city-guide-video-card" onPress={onPlay} accessibilityLabel="Play video">
      <Flex
        testID={thumbnailUrl ? undefined : "city-guide-video-placeholder"}
        width={width}
        height={height}
        backgroundColor={thumbnailUrl ? "black" : "mono10"}
        alignItems="center"
        justifyContent="center"
      >
        {!!thumbnailUrl && (
          <Image
            testID="city-guide-video-thumbnail"
            source={{ uri: thumbnailUrl }}
            style={{ position: "absolute", width, height }}
            resizeMode="cover"
          />
        )}

        <PlayGlyph />
      </Flex>
    </Touchable>
  )
}

const PLAY_GLYPH_SIZE = 48

/** @artsy/icons has no play glyph, so this draws the standard filled triangle directly. */
const PlayGlyph: React.FC = () => {
  const color = useColor()

  return (
    <Flex
      testID="city-guide-video-play-icon"
      width={PLAY_GLYPH_SIZE}
      height={PLAY_GLYPH_SIZE}
      borderRadius={PLAY_GLYPH_SIZE / 2}
      backgroundColor="mono100"
      opacity={0.7}
      alignItems="center"
      justifyContent="center"
    >
      <View
        style={{
          marginLeft: 4,
          borderTopWidth: 10,
          borderBottomWidth: 10,
          borderLeftWidth: 14,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: color("mono0"),
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment CityGuideEventVideos_city on City {
    cityVideos {
      internalID
      video {
        internalID
        playerUrl
      }
    }
  }
`
