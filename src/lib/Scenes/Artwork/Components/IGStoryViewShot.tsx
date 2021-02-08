import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { ArtsyLogoBlackIcon, Flex, FlexProps, Text } from "palette"
import React, { RefObject } from "react"
import { Image } from "react-native"
import ViewShot from "react-native-view-shot"

/**
 * This component is used to generate an image to share in Instagram Stories.
 * The way we do this is we render what we want the image to have (artist name, arsty logo, etc)
 * completely off-screen, and we use viewshot to snap a png of the rendered component.
 */

const InstagramStoryBackgroundDimensions = {
  width: 1080,
  height: 1920,
}

// tslint:disable-next-line:interface-name
export interface IGStoryViewShotProps {
  shotRef: RefObject<ViewShot>
  href: string
  artist: string
  title: string
}

export const IGStoryViewShot: React.FC<IGStoryViewShotProps> = ({ shotRef, href, artist, title }) => {
  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const renderOffScreenStyle: FlexProps = {
    position: "absolute",
    left: screenWidth + screenHeight,
    top: screenWidth + screenHeight,
  }

  return (
    <Flex {...renderOffScreenStyle} alignItems="center">
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
              <Text variant="mediumText" fontSize={43}>
                {artist}
              </Text>
              <Text variant="text" opacity={0.6} fontSize={43}>
                {title}
              </Text>
            </Flex>
            <ArtsyLogoBlackIcon scale={2} />
          </Flex>
        </Flex>
      </ViewShot>
    </Flex>
  )
}
