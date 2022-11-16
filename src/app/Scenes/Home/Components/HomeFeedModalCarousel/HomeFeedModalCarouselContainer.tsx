import { navigate, popToRoot, switchTab } from "app/navigation/navigate"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { BackButton, Button, Flex, useSpace } from "palette"
import { useEffect, useRef, useState } from "react"
import { LayoutAnimation, Modal, TouchableOpacity } from "react-native"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

export interface FullScreenCarouselProps {
  initialPage?: number
  isVisible: boolean
  toggleModal: (isVisible: boolean) => void
}

export const HomeFeedModalCarouselContainer: React.FC<FullScreenCarouselProps> = ({
  children,
  isVisible,
  initialPage = 0,
  toggleModal,
}) => {
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

  return (
    <Flex>
      <Modal
        visible={isVisible}
        style={{ flex: 1 }}
        animationType="slide"
        onDismiss={() => {
          setActiveStep(initialPage)
          if (pagerViewRef?.current) {
            pagerViewRef.current.setPage(initialPage)
          }
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Steps
            numberOfSteps={Array.isArray(children) ? children.length : 0}
            activeStep={activeStep}
            goToStep={(step) => {
              if (pagerViewRef.current) {
                pagerViewRef.current.setPage(step)
              }
            }}
          />
          <PagerView
            style={{ flex: 1 }}
            initialPage={0}
            onPageScroll={handleIndexChange}
            overdrag
            ref={pagerViewRef}
          >
            {children}
          </PagerView>
          <Flex alignItems="flex-end" right={2} width="100%" top={topInset} position="absolute">
            <BackButton onPress={() => toggleModal(false)} showX />
          </Flex>

          <FooterButtons
            isLastStep={children.length - 1 === activeStep}
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
  return (
    <Flex flexDirection="row" justifyContent="space-between" pl={1} mt={13} pr={5} zIndex={100}>
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
      style={{ flex: 1, height: 2, marginHorizontal: space(1) }}
      onPress={goToStep}
      hitSlop={{ top: 10, left: 5, right: 5, bottom: 10 }}
    >
      <Flex flex={1} backgroundColor="black100" opacity={isActive ? 1 : 0.2} />
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
      <Flex position="absolute" bottom={bottomInset} px={2}>
        <Button
          variant="fillDark"
          block
          onPress={() => {
            switchTab("profile")
            dismissModal()
            requestAnimationFrame(() => {
              navigate("my-collection/artworks/new", {
                passProps: {
                  mode: "add",
                  source: Tab.collection,
                  onSuccess: popToRoot,
                },
              })
            })
          }}
        >
          Upload Artwork
        </Button>
        <Button
          variant="text"
          block
          onPress={() => {
            switchTab("profile")
            requestAnimationFrame(() => {
              dismissModal()
            })
          }}
        >
          Go to My Collection
        </Button>
      </Flex>
    )
  }

  return (
    <Flex position="absolute" bottom={bottomInset}>
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
