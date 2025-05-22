import { ArtsyLogoWhiteIcon, Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import { Image } from "react-native"
import { isTablet } from "react-native-device-info"
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
        <ArtsyLogoWhiteIcon height={25} width={75} mt={safeArea.top} />
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
            Collect Art by the World’s Leading Artists
          </Text>

          <Spacer y={1} />

          <Text
            variant="sm"
            // We want to show this text in white regardless of the theme to make sure it can be read clearly
            color="white"
          >
            Build your personalized profile, get market insights and buy art with confidence.
          </Text>

          <Spacer y={2} />
        </MotiView>
      </Flex>
    </Flex>
  )
}

const AnimatedBackground: React.FC = React.memo(() => {
  const { width: screenWidth, height: screenHeight } = useScreenDimensions()

  const [translateXEnd, setTranslateXEnd] = useState<{ firstStop: number; secondStop: number }>({
    firstStop: 0,
    secondStop: 0,
  })

  useEffect(() => {
    if (isTablet()) {
      return
    }

    const imgProps = Image.resolveAssetSource(require("images/WelcomeImage.webp"))

    // We want to animate the background only when the device width is smaller than the scaled image width
    const imgScale = imgProps.height / screenHeight
    const imgWidth = imgProps.width * imgScale

    if (screenWidth < imgWidth) {
      const rightMarginFirstStop = 120
      const rightMarginSecondStop = 320

      // Calculate final positions
      setTranslateXEnd({
        firstStop: -(imgWidth - screenWidth - rightMarginFirstStop),
        secondStop: -(imgWidth - screenWidth - rightMarginSecondStop),
      })
    }
  }, [screenWidth, screenHeight])

  return (
    <>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 1000 }}
      >
        <MotiView
          from={{ translateX: 0 }}
          animate={{
            translateX: [translateXEnd?.firstStop, translateXEnd?.secondStop],
          }}
          transition={{
            type: "timing",
            duration: 50000,
            loop: true,
          }}
          style={{
            alignItems: "flex-end",
            position: "absolute",
          }}
        >
          <Image
            source={require("images/WelcomeImage.webp")}
            resizeMode="cover"
            style={{ height: screenHeight }}
          />
        </MotiView>

        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", `rgba(0, 0, 0, 0.85)`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.9 }}
          style={{
            position: "absolute",
            width: "100%",
            height: screenHeight,
          }}
        />
      </MotiView>
    </>
  )
})
