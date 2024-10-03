import { ArtsyLogoWhiteIcon, Flex, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import backgroundImage from "images/WelcomeImage.webp"
import { MotiView } from "moti"
import { useEffect } from "react"
import { Image } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const WelcomeBackground: React.FC = () => {
  const { isMounted, isModalExpanded } = AuthContext.useStoreState((state) => state)
  const safeArea = useSafeAreaInsets()

  return (
    <>
      <AnimatedBackground />

      <Flex alignItems="center" width="100%">
        <ArtsyLogoWhiteIcon height={25} width={75} mt={safeArea.top} />
      </Flex>

      <Flex flex={1} px={2} justifyContent="center" position="relative" top={-safeArea.top * 2}>
        <MotiView
          from={{ opacity: isModalExpanded ? 1 : 0, translateY: isMounted ? 0 : 20 }}
          animate={{ opacity: isModalExpanded ? 0 : 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: isMounted ? 300 : 1000,
            delay: (() => {
              if (isMounted) return 100
              return 600
            })(),
            easing: isMounted ? Easing.linear : Easing.out(Easing.circle),
          }}
        >
          <Text variant="xl" color="white">
            Collect Art by the World’s Leading Artists
          </Text>

          <Spacer y={1} />

          <Text variant="sm" color="white">
            Build your personalized profile, get market insights, buy and sell art with confidence.
          </Text>

          <Spacer y={2} />
        </MotiView>
      </Flex>
    </>
  )
}

const AnimatedBackground: React.FC = () => {
  const { width: screenWidth, height: screenHeight } = useScreenDimensions()

  // background sliding
  const translateX = useSharedValue(0)
  const slideAnim = useAnimatedStyle(() => {
    "worklet"
    return { transform: [{ translateX: translateX.value }] }
  })

  useEffect(() => {
    const imgProps = Image.resolveAssetSource(backgroundImage)

    // We want to animate the background only when the device width is smaller than the scaled image width
    const imgScale = imgProps.height / screenHeight
    const imgWidth = imgProps.width * imgScale

    // Animate the background only when the device width is smaller than the scaled image width
    if (screenWidth < imgWidth) {
      const rightMarginFirstStop = 120
      const rightMarginSecondStop = 320
      translateX.value = withSequence(
        withTiming(-(imgWidth - screenWidth - rightMarginFirstStop), { duration: 40000 }),
        withTiming(-(imgWidth - screenWidth - rightMarginSecondStop), { duration: 10000 })
      )
    }
  }, [])

  return (
    <>
      <Animated.View
        style={[
          {
            alignItems: "flex-end",
            position: "absolute",
          },
          slideAnim,
        ]}
      >
        <Image
          source={require("images/WelcomeImage.webp")}
          resizeMode="cover"
          style={{ height: screenHeight }}
        />
      </Animated.View>

      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", `rgba(0, 0, 0, 0.95)`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          width: "100%",
          height: screenHeight,
        }}
      />
    </>
  )
}
