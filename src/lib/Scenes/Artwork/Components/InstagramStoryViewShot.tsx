import { useOffscreenStyle } from "lib/utils/useOffscreenStyle"
import { ArtsyLogoBlackIcon, Flex, Text } from "palette"
import React, { RefObject } from "react"
import { Image } from "react-native"
import ViewShot from "react-native-view-shot"

/**
 * This component is used to generate an image to share in Instagram Stories.
 * The way we do this is we render what we want the image to have (artist name, arsty logo, etc)
 * completely off-screen, and we use viewshot to snap a png of the rendered component.
 */

const InstagramStoryBackgroundDimensions = {
  width: "100%",
  height: "100%",
}

export interface InstagramStoryViewShotProps {
  shotRef: RefObject<ViewShot>
  href: string
  artist: string
  title: string
}

export const InstagramStoryViewShot: React.FC<InstagramStoryViewShotProps> = ({ shotRef, href, artist, title }) => {
  const offscreenStyle = useOffscreenStyle(true)

  return (
    <Flex {...offscreenStyle} alignItems="center">
      <ViewShot ref={shotRef} options={{ format: "png", result: "base64" }}>
        <Flex
          width={InstagramStoryBackgroundDimensions.width}
          height={InstagramStoryBackgroundDimensions.height}
          backgroundColor="white100"
        >
          <Flex flex={1}>
            <Image source={{ uri: href }} style={{ flex: 1 }} resizeMode="contain" />
          </Flex>
          <Flex
            width="100%"
            mt={40}
            mb={180}
            px={50}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex>
              <Text variant="xl">{artist}</Text>
              <Text variant="lg">{title}</Text>
            </Flex>
            <ArtsyLogoBlackIcon scale={2} />
          </Flex>
        </Flex>
      </ViewShot>
    </Flex>
  )
}
