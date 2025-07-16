import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { MotiView } from "moti"
import React from "react"
import { Image } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Easing } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const AuthBackground: React.FC = () => {
  const { isMounted, isModalExpanded } = AuthContext.useStoreState((state) => state)
  const safeArea = useSafeAreaInsets()

  return (
    // Setting the background to black in dark and light mode.
    <Flex backgroundColor="black" height="100%" pt="-200px" pb="-200px">
      <AnimatedBackground />

      <Flex alignItems="center" width="100%">
        <ArtsyLogoIcon height={25} width={75} mt={safeArea.top} fill="white" />
      </Flex>

      <Flex flex={1} px={2} justifyContent="center" position="relative" top={-safeArea.top * 2}>
        <MotiView
          from={{
            opacity: isModalExpanded ? 1 : 0,
            translateY: isMounted ? 0 : 20,
          }}
          animate={{
            opacity: isModalExpanded ? 0 : 1,
            translateY: 0,
          }}
          transition={{
            type: "timing",
            duration: (() => {
              if (isModalExpanded) return 200
              if (isMounted) return 300
              return 800
            })(),
            delay: (() => {
              if (isModalExpanded) return 0
              if (isMounted) return 100
              return 1000
            })(),
            easing: isMounted ? Easing.linear : Easing.out(Easing.circle),
          }}
        >
          <Text
            variant="xl"
            // We want to show this text in white regardless of the theme to make sure it can be read clearly
            color="white"
          >
            Discover and Buy Art that Moves You
          </Text>

          <Spacer y={1} />

          <Text
            variant="sm"
            // We want to show this text in white regardless of the theme to make sure it can be read clearly
            color="white"
          >
            Your personalized guide to fresh artworks and the latest stories—and the easiest way to
            buy art you love.
          </Text>

          <Spacer y={2} />
        </MotiView>
      </Flex>
    </Flex>
  )
}

const AnimatedBackground: React.FC = React.memo(() => {
  const { width: screenWidth, height: screenHeight } = useScreenDimensions()

  // size and position the image
  const IMAGE_SCALE = 1.2
  const IMAGE_OFFSET = (IMAGE_SCALE - 1) / 2

  // zoom into the image
  const ZOOM_SCALE = 1.2
  const ZOOM_X = -screenWidth * 0.1
  const ZOOM_Y = -screenHeight * 0.05
  const ZOOM_DURATION = 15000

  // pan across the image
  const PAN_X = screenWidth * 0.15
  const PAN_Y = -screenHeight * 0.1
  const PAN_DURATION = 30000

  /**
   * This component defines 3 animations that happen in the following sequence:
   *
   * 0 - 1s: viewport fades-in image
   * 0 - 15s: viewport zooms-into image and slightly pans to the right
   * 15s - 45s: viewport pans to the bottom-left of the image and slightly zooms-out (and loops)
   *
   * It also includes a linear gradient so that the text on this screen doesn't blend into the image
   * and become difficult to read.
   */

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 1000 }}
      style={{
        height: screenHeight,
        width: screenWidth,
        position: "absolute",
      }}
    >
      <MotiView
        from={{ scale: 1, translateX: 0, translateY: 0 }}
        animate={{ scale: ZOOM_SCALE, translateX: ZOOM_X, translateY: ZOOM_Y }}
        transition={{ type: "timing", duration: ZOOM_DURATION }}
      >
        <MotiView
          from={{ scale: ZOOM_SCALE, translateX: ZOOM_X, translateY: ZOOM_Y }}
          animate={{
            scale: 1,
            translateX: PAN_X,
            translateY: PAN_Y,
          }}
          transition={{
            type: "timing",
            delay: ZOOM_DURATION,
            duration: PAN_DURATION,
            loop: true,
            easing: Easing.inOut(Easing.ease),
          }}
        >
          <Image
            source={require("images/WelcomeImage.webp")}
            style={{
              height: screenHeight * IMAGE_SCALE,
              width: screenWidth * IMAGE_SCALE,
              position: "absolute",
              left: -screenWidth * IMAGE_OFFSET,
              top: -screenHeight * IMAGE_OFFSET,
            }}
          />
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", `rgba(0, 0, 0, 0.85)`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              width: screenWidth * IMAGE_SCALE,
              height: screenHeight * IMAGE_SCALE,
              position: "absolute",
              left: -screenWidth * IMAGE_OFFSET,
              top: -screenHeight * IMAGE_OFFSET,
            }}
          />
        </MotiView>
      </MotiView>
    </MotiView>
  )
})
