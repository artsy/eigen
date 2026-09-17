import { Flex, Join, Spacer, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { CityGuideEventVideos_city$key } from "__generated__/CityGuideEventVideos_city.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { FeatureVideo } from "app/Scenes/Feature/FeatureVideo"
import { extractNodes } from "app/utils/extractNodes"
import { isValidVideoUrl } from "app/utils/videoHelpers"
import { graphql, useFragment } from "react-relay"

/** Falls back to 16:9 the way Feature.tsx does, for a video that reports no usable dimensions. */
const FALLBACK_ASPECT_RATIO = 16 / 9

interface Props {
  city: CityGuideEventVideos_city$key | null | undefined
}

export const CityGuideEventVideos: React.FC<Props> = ({ city: cityRef }) => {
  const city = useFragment(fragment, cityRef)
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()

  /*
    An event carries at most one video, so this is one row per event that has one — not a
    rail. Cities normally have a single current event, which is the one video the designs show.

    Filtered by `isValidVideoUrl` because that is what decides whether `FeatureVideo` renders
    a player at all: it bails on anything that isn't Vimeo or YouTube. Counting a video the
    player will refuse would leave the heading standing over blank space.
  */
  const videos = extractNodes(city?.cityGuideEventsConnection).flatMap((event) =>
    event.video && isValidVideoUrl(event.video.playerUrl) ? [event.video] : []
  )

  // No videos means no heading either: a "Videos" title over nothing reads as a broken screen.
  if (!videos.length) {
    return null
  }

  const videoWidth = screenWidth - 2 * space(2)

  return (
    <Flex testID="city-guide-event-videos">
      {/*
        No chevron, unlike the rails above: an event has one video and there is no
        list screen to send anyone to, so the heading is text rather than a tap target.
      */}
      <Flex px={2}>
        <SectionTitle variant="large" title="Videos" />
      </Flex>

      <Join separator={<Spacer y={2} />}>
        {videos.map((video) => (
          <Flex key={video.internalID} px={2}>
            <FeatureVideo
              videoUrl={video.playerUrl}
              width={videoWidth}
              height={videoWidth / videoAspectRatio(video)}
            />
          </Flex>
        ))}
      </Join>
    </Flex>
  )
}

/**
 * `aspectRatio` is width / height, computed by Gravity when the video is uploaded. The
 * width/height fallback covers a record saved before that ran; either way the player keeps
 * the video's own shape, which the designs rely on — the editorial videos are portrait.
 */
const videoAspectRatio = (video: {
  aspectRatio: number | null | undefined
  width: number
  height: number
}) => {
  if (video.aspectRatio) {
    return video.aspectRatio
  }

  if (video.height > 0) {
    return video.width / video.height
  }

  return FALLBACK_ASPECT_RATIO
}

const fragment = graphql`
  fragment CityGuideEventVideos_city on City @argumentDefinitions(first: { type: "Int!" }) {
    cityGuideEventsConnection(first: $first, status: CURRENT) {
      edges {
        node {
          internalID
          video {
            internalID
            playerUrl
            width
            height
            aspectRatio
          }
        }
      }
    }
  }
`
