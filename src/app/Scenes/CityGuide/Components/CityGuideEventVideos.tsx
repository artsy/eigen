import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { CityGuideEventVideos_city$key } from "__generated__/CityGuideEventVideos_city.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { FeatureVideo } from "app/Scenes/Feature/FeatureVideo"
import { isValidVideoUrl } from "app/utils/videoHelpers"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"

/** Falls back to 16:9 the way Feature.tsx does, for a video that reports no usable dimensions. */
const FALLBACK_ASPECT_RATIO = 16 / 9

interface Props {
  city: CityGuideEventVideos_city$key | null | undefined
  /**
   * The scroll view's own visible height, which is the screen minus the header and the
   * bottom tabs. Measured and passed down rather than derived from the screen height here:
   * a page built from the full screen height runs under both chrome and can never sit
   * flush, however the scroll is snapped.
   */
  pageHeight: number
}

export const CityGuideEventVideos: React.FC<Props> = ({ city: cityRef, pageHeight }) => {
  const city = useFragment(fragment, cityRef)
  const { width: screenWidth } = useScreenDimensions()

  /*
    A city has an ordered list of videos, attached directly rather than through an event.

    Filtered by `isValidVideoUrl` because that is what decides whether `FeatureVideo` renders
    a player at all: it bails on anything that isn't Vimeo or YouTube. Counting a video the
    player will refuse would leave the heading standing over blank space.
  */
  const videos = (city?.cityVideos ?? []).flatMap((attachment) =>
    isValidVideoUrl(attachment.video.playerUrl) ? [attachment.video] : []
  )

  // No videos means no heading either: a "Videos" title over nothing reads as a broken screen.
  // Nothing renders before the scroll view has been measured either, so a page is never
  // laid out at the wrong height and then resized under the reader.
  if (!videos.length || pageHeight <= 0) {
    return null
  }

  // Full-bleed: no side gutters, unlike the heading above it.
  const videoWidth = screenWidth

  return (
    <Flex testID="city-guide-event-videos" backgroundColor="black">
      {videos.map((video, index) => (
        <VideoPage
          key={video.internalID}
          video={video}
          videoWidth={videoWidth}
          pageHeight={pageHeight}
          // The heading belongs to the first page, so the section reads as "Videos" once
          // rather than repeating above every clip.
          showHeading={index === 0}
        />
      ))}
    </Flex>
  )
}

/**
 * One video, one viewportful. The page matches the scroll view's visible height exactly, so
 * that snapping to its top lands it flush between the header and the tabs — see CityGuideNew,
 * which owns both the measurement and the snap offsets built from it.
 */
const VideoPage = ({
  video,
  videoWidth,
  pageHeight,
  showHeading,
}: {
  video: {
    playerUrl: string
    aspectRatio: number | null | undefined
    width: number
    height: number
  }
  videoWidth: number
  pageHeight: number
  showHeading: boolean
}) => {
  // The player takes pixel dimensions, so the space the heading leaves behind has to be
  // measured rather than handed to it as `flex`.
  const [boxHeight, setBoxHeight] = useState(0)

  // Letterboxed rather than cropped when the video is a different shape than the space:
  // the page is the full screen, so a portrait clip fills it and a landscape one centres.
  const naturalHeight = videoWidth / videoAspectRatio(video)
  const height = boxHeight > 0 ? Math.min(naturalHeight, boxHeight) : 0

  return (
    <Flex testID="city-guide-video-page" height={pageHeight}>
      {/*
        No chevron, unlike the rails above: an event has one video and there is no
        list screen to send anyone to, so the heading is text rather than a tap target.
      */}
      {!!showHeading && (
        <Flex px={2} pt={1}>
          <SectionTitle variant="large" title="Videos" titleColor="white" />
        </Flex>
      )}

      <Flex
        testID="city-guide-video-box"
        flex={1}
        justifyContent="center"
        backgroundColor="black"
        onLayout={(event) => setBoxHeight(event.nativeEvent.layout.height)}
      >
        {height > 0 && (
          <FeatureVideo videoUrl={video.playerUrl} width={videoWidth} height={height} />
        )}
      </Flex>
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
  fragment CityGuideEventVideos_city on City {
    cityVideos {
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
`
