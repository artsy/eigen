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

  // Scale factor to ensure image covers enough of the screen
  const heightScaleFactor = 1.1
  const adjustedHeight = screenHeight * heightScaleFactor

  return (
    <>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 1000 }}
      >
        <MotiView
          from={{ scale: 1, translateX: 0 }}
          // Slow zoom-in with subtle pan to create cinematic movement
          animate={{ scale: 1.2, translateX: -screenWidth * 0.05 }}
          transition={{
            type: "timing",
            duration: 10000,
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            width: screenWidth,
            height: adjustedHeight,
            // Shift container up to ensure bottom coverage during zoom-in animation
            top: -screenHeight * 0.05,
          }}
        >
          <Image
            source={require("images/WelcomeImage.webp")}
            resizeMode="cover"
            style={{
              width: screenWidth,
              height: adjustedHeight,
            }}
          />
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", `rgba(0, 0, 0, 0.85)`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              width: screenWidth,
              height: adjustedHeight,
            }}
          />
        </MotiView>
      </MotiView>
    </>
  )
})
