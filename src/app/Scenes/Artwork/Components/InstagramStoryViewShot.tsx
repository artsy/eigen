import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Flex, Text, useColor } from "@artsy/palette-mobile"
import FastImage from "@d11/react-native-fast-image"
import { useOffscreenStyle } from "app/utils/hooks"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useSizeToFitScreen } from "app/utils/useSizeToFit"
import React, { Ref } from "react"
import ViewShot from "react-native-view-shot"

/**
 * This component is used to generate an image to share in Instagram Stories.
 * The way we do this is we render what we want the image to have (artist name, arsty logo, etc)
 * completely off-screen, and we use viewshot to snap a png of the rendered component.
 */

const InstagramStoryBackgroundDimensions = {
  width: 1080, // in pixels, before we scale it
  height: 1920, // in pixels, before we scale it
}
const BottomLabelHeight = 350 // in pixels, before we scale it

export interface InstagramStoryViewShotProps {
  shotRef?: Ref<ViewShot>
  href: string
  artist: string
  title?: string
  onImageLoad?: () => void
}

export const InstagramStoryViewShot: React.FC<InstagramStoryViewShotProps> = ({
  shotRef,
  href,
  artist,
  title,
  onImageLoad,
}) => {
  const color = useColor()
  const debugInstagramShot = useDevToggle("DTShowInstagramShot")
  const { width, height } = useSizeToFitScreen({
    width: InstagramStoryBackgroundDimensions.width,
    height: InstagramStoryBackgroundDimensions.height - BottomLabelHeight,
  })
  const offscreenStyle = useOffscreenStyle(debugInstagramShot)

  const scale = width / InstagramStoryBackgroundDimensions.width

  return (
    <Flex style={offscreenStyle} alignItems="center">
      <ViewShot
        ref={shotRef}
        options={{ format: "png", result: "base64" }}
        style={{ backgroundColor: color("mono0") }}
      >
        <FastImage
          source={{ uri: href }}
          style={{ width, height }}
          resizeMode="contain"
          onLoadEnd={onImageLoad}
        />

        <Flex
          mt={`${40 * scale}px`}
          mb={`${180 * scale}px`}
          px={`${50 * scale}px`}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex flex={1}>
            <Text variant="sm-display" weight="medium">
              {artist}
            </Text>
            {title ? (
              <Text
                variant="sm-display"
                italic
                opacity={0.6}
                mt={10 * scale}
                ellipsizeMode="middle"
              >
                {title}
              </Text>
            ) : null}
          </Flex>
          <ArtsyLogoIcon height={25} width={75} />
        </Flex>
      </ViewShot>
    </Flex>
  )
}
