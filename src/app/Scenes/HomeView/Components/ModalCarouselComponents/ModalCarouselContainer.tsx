import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { BackButton, Button, Flex, useColor, useSpace } from "@artsy/palette-mobile"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { navigate, switchTab } from "app/system/navigation/navigate"
import { screen } from "app/utils/track/helpers"
import { useEffect, useRef, useState } from "react"
import { BackHandler, LayoutAnimation, Modal, TouchableOpacity } from "react-native"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useTracking } from "react-tracking"

export interface FullScreenCarouselProps {
  initialPage?: number
  isVisible: boolean
  toggleModal: (isVisible: boolean) => void
}

export const ModalCarouselContainer: React.FC<FullScreenCarouselProps> = ({
  children,
  isVisible,
  initialPage = 0,
  toggleModal,
}) => {
  const { trackEvent } = useTracking()
  const color = useColor()

  if (!Array.isArray(children) || children.length === 0) {
    throw new Error("FullScreenCarousel requires at least one child")
  }

  if (initialPage < 0 || initialPage > children.length - 1) {
    throw new Error("FullScreenCarousel initialPage is out of bounds")
  }

  const [activeStep, setActiveStep] = useState(initialPage)
  const pagerViewRef = useRef<PagerView>(null)
  const { top: topInset } = useSafeAreaInsets()

  const handleIndexChange = (e: PagerViewOnPageScrollEvent) => {
    if (e.nativeEvent.position !== undefined) {
      // We need to avoid updating the index when the position is -1. This happens when the user
      // scrolls left on the first page in iOS when the overdrag is enabled,
      if (e.nativeEvent.position !== -1) {
        setActiveStep(e.nativeEvent.position)
      }
    }
  }
  const isLastStep = children.length - 1 === activeStep

  useEffect(() => {
    if (!isVisible) {
      return
    }
    if (isLastStep) {
      trackEvent(tracks.myCollectionOnboardingCompleted())
    }
    trackEvent(tracks.screen(activeStep.toString()))
  }, [activeStep, isVisible])

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(initialPage)
    }
  }, [isVisible])

  const handleCloseModal = () => {
    switchTab("profile")
    toggleModal(false)
    return null
  }

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", handleCloseModal)

    return () => subscription.remove()
  }, [])

  return (
    <Flex>
      <Modal visible={isVisible} style={{ flex: 1 }} animationType="slide">
        <Steps
          numberOfSteps={Array.isArray(children) ? children.length : 0}
          activeStep={activeStep}
          goToStep={(step) => {
            if (pagerViewRef.current) {
              pagerViewRef.current.setPage(step)
            }
          }}
        />

        <Flex
          alignItems="flex-end"
          right={2}
          width="100%"
          style={{
            // we are using top from styles to avoid computing distances wrongly
            // @example: by setting top to 1 using the top prop, the distance
            // from the top of the screen is going to be 10
            top: topInset - 1,
          }}
          position="absolute"
        >
          <BackButton
            onPress={handleCloseModal}
            showX
            hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
          />
        </Flex>

        <SafeAreaView style={{ flex: 1, backgroundColor: color("mono0") }}>
          <PagerView
            style={{ flex: 1 }}
            initialPage={0}
            onPageScroll={handleIndexChange}
            overdrag
            ref={pagerViewRef}
          >
            {children}
          </PagerView>

          <FooterButtons
            isLastStep={isLastStep}
            goToNextPage={() => pagerViewRef.current?.setPage(activeStep + 1)}
            dismissModal={() => toggleModal(false)}
          />
        </SafeAreaView>
      </Modal>
    </Flex>
  )
}

const Steps = ({
  activeStep,
  goToStep,
  numberOfSteps,
}: {
  activeStep: number
  goToStep: (index: number) => void
  numberOfSteps: number
}) => {
  const { top: topInset } = useSafeAreaInsets()
  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      pl={1}
      style={{ paddingTop: topInset + 10 }}
      pr={6}
      backgroundColor="mono0"
    >
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <Step key={index} isActive={activeStep === index} goToStep={() => goToStep(index)} />
      ))}
    </Flex>
  )
}

const Step = ({ isActive = false, goToStep }: { isActive?: boolean; goToStep: () => void }) => {
  const space = useSpace()

  useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }, [isActive])

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={{ flex: 1, height: 2, marginHorizontal: space(1) }}
      onPress={goToStep}
      hitSlop={{ top: 10, left: 5, right: 5, bottom: 10 }}
    >
      <Flex flex={1} backgroundColor="mono100" opacity={isActive ? 1 : 0.2} />
    </TouchableOpacity>
  )
}

export const FooterButtons = ({
  dismissModal,
  isLastStep = false,
  goToNextPage,
}: {
  dismissModal: () => void
  isLastStep?: boolean
  goToNextPage: () => void
}) => {
  const { trackEvent } = useTracking()
  const { bottom: bottomInset } = useSafeAreaInsets()

  // Animate how the last step buttons appear in the last step
  useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
  }, [isLastStep])

  if (isLastStep) {
    return (
      <Flex position="absolute" bottom={bottomInset} px={2} mb={1}>
        <Button
          variant="outline"
          mb={2}
          block
          onPress={() => {
            switchTab("profile")
            dismissModal()
            requestAnimationFrame(() => {
              navigate("my-collection/artworks/new", {
                passProps: {
                  source: Tab.collection,
                },
              })
              trackEvent(tracks.addCollectedArtwork())
            })
          }}
        >
          Add Artwork
        </Button>
        <Button
          variant="outline"
          block
          onPress={() => {
            switchTab("profile")
            dismissModal()
            requestAnimationFrame(() => {
              navigate("my-collection/collected-artists/new", {
                passProps: {
                  source: Tab.collection,
                },
              })
            })
            trackEvent(tracks.addCollectedArtist())
          }}
        >
          Add Artists
        </Button>
      </Flex>
    )
  }

  return (
    <Flex position="absolute" style={{ bottom: bottomInset + 10 }}>
      <Button
        variant="text"
        block
        onPress={() => {
          goToNextPage()
        }}
      >
        Next
      </Button>
    </Flex>
  )
}

const tracks = {
  addCollectedArtwork: () => ({
    action: ActionType.addCollectedArtwork,
    context_module: ContextModule.myCollectionOnboarding,
    context_owner_type: OwnerType.myCollectionOnboarding,
    platform: "mobile",
  }),
  addCollectedArtist: () => ({
    action: ActionType.addNewArtistName,
    context_module: ContextModule.myCollectionOnboarding,
    context_owner_type: OwnerType.myCollectionOnboarding,
    platform: "mobile",
  }),
  myCollectionOnboardingCompleted: () => ({
    action: ActionType.myCollectionOnboardingCompleted,
    context_owner_type: OwnerType.myCollectionOnboarding,
    context_screen_owner_type: OwnerType.myCollectionOnboarding,
    context_module: ContextModule.myCollectionOnboarding,
    destination_screen_owner_type: OwnerType.myCollectionOnboarding,
  }),
  screen: (slideIndex: string) =>
    screen({
      context_screen_owner_type: OwnerType.myCollectionOnboarding,
      context_screen_owner_id: slideIndex,
    }),
}
