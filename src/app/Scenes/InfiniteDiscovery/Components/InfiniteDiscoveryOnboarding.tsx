import { ActionType, OwnerType } from "@artsy/cohesion"
import { Flex, LinkText, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { Swiper, SwiperRefProps } from "app/Scenes/InfiniteDiscovery/Components/Swiper/Swiper"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect, useRef, useState } from "react"
import { LayoutAnimation, Modal, TouchableWithoutFeedback } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { useSharedValue } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTracking } from "react-tracking"

interface InfiniteDiscoveryOnboardingProps {
  artworks: InfiniteDiscoveryArtwork[]
}

const ONBOARDING_SWIPE_ANIMATION_DURATION = 2500
const ONBOARDING_ANIMATION_DELAY = 1000
const ONBOARDING_SAVED_HINT_DURATION = 1500

export const InfiniteDiscoveryOnboarding: React.FC<InfiniteDiscoveryOnboardingProps> = ({
  artworks,
}) => {
  const { trackEvent } = useTracking()
  const space = useSpace()
  const [showSavedHint, setShowSavedHint] = useState(false)

  const swiperRef = useRef<SwiperRefProps>(null)

  const isAtworkSaved = (index: number) => {
    // We want to only enable saving the upper card
    if (index === artworks.length - 1) {
      return showSavedHint
    }

    return false
  }

  const [isVisible, setIsVisible] = useState(false)
  const isRewindRequested = useSharedValue(false)
  const [enableTapToDismiss, setEnableTapToDismiss] = useState(false)

  const hasInteractedWithOnboarding = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.hasInteractedWithOnboarding
  )

  useEffect(() => {
    setTimeout(() => {
      if (!hasInteractedWithOnboarding) {
        setIsVisible(true)
        // Make sure the user can tap to dismiss the onboarding only after a delay
        // This is required to make sure they can see the onboarding content
        setTimeout(() => {
          setEnableTapToDismiss(true)
        }, 1500)
      }
    }, 1000)
  }, [hasInteractedWithOnboarding])

  useEffect(() => {
    if (isVisible) {
      trackEvent(tracks.screenView())
    }
  }, [isVisible])

  const showOnboardingAnimation = () => {
    setShowSavedHint(true)

    setTimeout(() => {
      swiperRef.current?.swipeLeftThenRight(ONBOARDING_SWIPE_ANIMATION_DURATION)
    }, ONBOARDING_ANIMATION_DELAY + ONBOARDING_SAVED_HINT_DURATION)

    setTimeout(
      () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setShowSavedHint(false)
      },
      ONBOARDING_SWIPE_ANIMATION_DURATION +
        ONBOARDING_SAVED_HINT_DURATION +
        ONBOARDING_ANIMATION_DELAY
    )
  }

  useEffect(() => {
    if (!isVisible) {
      return
    }

    // Wait for a second before showing the animation
    setTimeout(() => {
      showOnboardingAnimation()
      // Show the animation every 5 seconds afterwards
      setInterval(() => {
        showOnboardingAnimation()
      }, 7000)
    }, 1000)
  }, [setShowSavedHint, isVisible])

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (enableTapToDismiss) {
            setIsVisible(false)
          }
        }}
      >
        <Flex flex={1} backgroundColor="transparent">
          <Flex flex={1}>
            <LinearGradient
              colors={["rgb(255, 255, 255)", `rgba(231, 231, 231, 0.9)`]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            />
            <SafeAreaView
              style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "transparent" }}
            >
              <Flex flex={1} pointerEvents="none">
                <Swiper
                  containerStyle={{ flex: 1, transform: [{ scale: 0.8 }] }}
                  cards={artworks}
                  isRewindRequested={isRewindRequested}
                  onTrigger={() => {}}
                  swipedIndexCallsOnTrigger={2}
                  onNewCardReached={() => {}}
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
                  isArtworksSaved={isAtworkSaved}
                />
              </Flex>

              <Flex justifyContent="flex-end" px={2}>
                <Text>Welcome to Discover Daily</Text>

                <Spacer y={1} />

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

                <Spacer y={2} />

                <Flex alignItems="flex-end">
                  <LinkText
                    onPress={() => {
                      setIsVisible(false)
                    }}
                  >
                    Tap to get started
                  </LinkText>
                </Flex>
              </Flex>
            </SafeAreaView>
          </Flex>
        </Flex>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const tracks = {
  screenView: () => ({
    action: ActionType.screen,
    context_screen_owner_type: OwnerType.infiniteDiscoveryOnboarding,
  }),
}
