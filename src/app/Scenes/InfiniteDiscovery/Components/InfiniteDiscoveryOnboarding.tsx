import { Flex, LinkText, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { Swiper, SwiperRefProps } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { MotiView } from "moti"
import { useEffect, useRef, useState } from "react"
import { LayoutAnimation, Modal, Platform, TouchableWithoutFeedback } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface InfiniteDiscoveryOnboardingProps {
  artworks: InfiniteDiscoveryArtwork[]
}

const ONBOARDING_SWIPE_ANIMATION_DURATION = 2500
const ONBOARDING_ANIMATION_DELAY = 1000
const ONBOARDING_SAVED_HINT_DURATION = 1500

export const InfiniteDiscoveryOnboarding: React.FC<InfiniteDiscoveryOnboardingProps> = ({
  artworks,
}) => {
  const colorScheme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  const track = useInfiniteDiscoveryTracking()
  const space = useSpace()
  const [showSavedHint, setShowSavedHint] = useState(false)
  const [showSwiper, setShowSwiper] = useState(false)
  const safeAreaInsets = useSafeAreaInsets()

  const swiperRef = useRef<SwiperRefProps>(null)

  const isArtworkSaved = (index: number) => {
    // We want to only enable saving the upper card
    if (index === artworks.length - 1) {
      return showSavedHint
    }

    return false
  }

  const hasInteractedWithOnboarding = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.hasInteractedWithOnboarding
  )
  const isNewUserOnboardingSession =
    GlobalStore.useAppState((state) => state.onboarding.onboardingState) === "incomplete"

  const [isVisible, setIsVisible] = useState(isNewUserOnboardingSession)
  const [enableTapToDismiss, setEnableTapToDismiss] = useState(false)

  // Timeouts scheduled by showOnboardingAnimation, cleared when the animation loop stops
  const animationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (!isVisible) {
      return
    }

    const timeout = setTimeout(() => {
      setShowSwiper(true)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [isVisible])

  useEffect(() => {
    const delay = isNewUserOnboardingSession ? 0 : 1000
    let tapToDismissTimeout: ReturnType<typeof setTimeout> | undefined

    const visibilityTimeout = setTimeout(() => {
      if (isNewUserOnboardingSession || !hasInteractedWithOnboarding) {
        setIsVisible(true)
        // Make sure the user can tap to dismiss the onboarding only after a delay
        // This is required to make sure they can see the onboarding content
        tapToDismissTimeout = setTimeout(() => {
          setEnableTapToDismiss(true)
        }, 1500)
      }
    }, delay)

    return () => {
      clearTimeout(visibilityTimeout)
      clearTimeout(tapToDismissTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isVisible) {
      track.onboardingView()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  const showOnboardingAnimation = () => {
    setShowSavedHint(true)

    const swipeTimeout = setTimeout(() => {
      swiperRef.current?.swipeLeftThenRight(ONBOARDING_SWIPE_ANIMATION_DURATION)
    }, ONBOARDING_ANIMATION_DELAY + ONBOARDING_SAVED_HINT_DURATION)

    const hideSavedHintTimeout = setTimeout(
      () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setShowSavedHint(false)
      },
      ONBOARDING_SWIPE_ANIMATION_DURATION +
        ONBOARDING_SAVED_HINT_DURATION +
        ONBOARDING_ANIMATION_DELAY
    )

    // Only the latest cycle can still be pending since cycles are 7s apart and each lasts 5s
    animationTimeoutsRef.current = [swipeTimeout, hideSavedHintTimeout]
  }

  useEffect(() => {
    if (!isVisible || !showSwiper) {
      return
    }

    let interval: ReturnType<typeof setInterval> | undefined

    // Wait for a second before showing the animation
    const startTimeout = setTimeout(() => {
      showOnboardingAnimation()
      // Show the animation every 7 seconds afterwards
      interval = setInterval(() => {
        showOnboardingAnimation()
      }, 7000)
    }, 1000)

    return () => {
      clearTimeout(startTimeout)
      clearInterval(interval)
      animationTimeoutsRef.current.forEach(clearTimeout)
      animationTimeoutsRef.current = []
    }
  }, [setShowSavedHint, isVisible, showSwiper])

  const gradientColors =
    colorScheme === "dark"
      ? ["rgb(0, 0, 0)", `rgba(24, 24, 24, 0.9)`]
      : ["rgb(255, 255, 255)", `rgba(231, 231, 231, 0.9)`]

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent
      onRequestClose={() => setIsVisible(false)}
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback
        accessibilityRole="button"
        onPress={() => {
          if (enableTapToDismiss) {
            setIsVisible(false)
          }
        }}
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{
            opacity: isVisible ? 1 : 0,
          }}
          style={{ flex: 1 }}
          transition={{ type: "timing", duration: 800 }}
        >
          <Flex flex={1} backgroundColor="transparent">
            <Flex flex={1}>
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              />
              <Flex
                flex={1}
                justifyContent="flex-end"
                backgroundColor="transparent"
                style={{ paddingBottom: safeAreaInsets.bottom, paddingTop: safeAreaInsets.top }}
              >
                <MotiView
                  animate={{ opacity: showSwiper ? 1 : 0, scale: showSwiper ? 1 : 0.8 }}
                  style={{ flex: 4, paddingTop: Platform.OS === "ios" ? space(4) : 0 }}
                  transition={{
                    type: "timing",
                    duration: 500,
                  }}
                >
                  <Flex flex={1} pointerEvents="none">
                    <Swiper
                      containerStyle={{ flex: 1, transform: [{ scale: 0.8 }] }}
                      cards={artworks}
                      onRewind={() => {}}
                      onSwipe={() => {}}
                      ref={swiperRef}
                      cardStyle={{
                        paddingVertical: space(1),
                        marginTop: -space(2),
                        borderRadius: 10,
                        shadowRadius: 3,
                        shadowColor: "black",
                        shadowOpacity: 0.2,
                        shadowOffset: { height: 0, width: 0 },
                        elevation: 2,
                      }}
                      isArtworkSaved={isArtworkSaved}
                    />
                  </Flex>
                </MotiView>

                <Flex flex={1} px={2}>
                  {isNewUserOnboardingSession ? (
                    <Text variant="lg-display" numberOfLines={2} adjustsFontSizeToFit>
                      Swipe to see the next artwork. Tap the heart to save it.
                    </Text>
                  ) : (
                    <Text variant="lg-display" numberOfLines={2} adjustsFontSizeToFit>
                      Start{" "}
                      <Text variant="lg-display" fontWeight="500">
                        swiping
                      </Text>{" "}
                      to discover art, and{" "}
                      <Text variant="lg-display" fontWeight="500">
                        save
                      </Text>{" "}
                      the works you love.
                    </Text>
                  )}

                  <Spacer y={2} />

                  <MotiView animate={{ opacity: enableTapToDismiss ? 1 : 0 }}>
                    <Flex alignItems="flex-end">
                      <LinkText onPress={() => setIsVisible(false)}>
                        {isNewUserOnboardingSession ? "Tap to start swiping" : "Tap to get started"}
                      </LinkText>
                    </Flex>
                  </MotiView>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </MotiView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
