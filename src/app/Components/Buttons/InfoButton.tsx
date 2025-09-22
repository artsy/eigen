import { InfoIcon } from "@artsy/icons/native"
import {
  Button,
  Flex,
  Spacer,
  Text,
  Touchable,
  useColor,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { forwardRef, useImperativeHandle, useMemo, useState } from "react"
import { Modal, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { FullWindowOverlay } from "react-native-screens"

interface InfoButtonProps {
  isPresentedModally?: boolean
  modalContent: JSX.Element
  modalTitle?: string
  onPress?: () => void
  subTitle?: string
  title?: string
  titleElement?: JSX.Element
  trackEvent?: () => void
}

export const InfoButton = forwardRef<
  {
    closeModal: () => void
  },
  InfoButtonProps
>(
  (
    {
      isPresentedModally,
      modalContent,
      modalTitle,
      onPress,
      subTitle,
      title,
      titleElement,
      trackEvent,
    },
    ref
  ) => {
    const [modalVisible, setModalVisible] = useState(false)

    // Expose closeModal function via the ref
    useImperativeHandle(ref, () => ({
      closeModal: () => setModalVisible(false),
    }))

    return (
      <>
        <Touchable
          accessibilityRole="button"
          onPress={() => {
            setModalVisible(true)
            trackEvent?.()
            onPress?.()
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Flex flexDirection="row" alignItems="center">
            {titleElement ? (
              titleElement
            ) : (
              <Text variant="sm" mr={0.5}>
                {title}
              </Text>
            )}

            <InfoIcon fill="mono60" />
          </Flex>
        </Touchable>

        {!!subTitle && (
          <Text variant="xs" color="mono60">
            {subTitle}
          </Text>
        )}

        <AutoHeightInfoModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          modalTitle={modalTitle}
          title={title}
          modalContent={modalContent}
          isPresentedModally={isPresentedModally}
        />
      </>
    )
  }
)

export const AutoHeightInfoModal: React.FC<{
  isPresentedModally?: boolean
  modalContent: JSX.Element
  modalTitle?: string
  onDismiss: () => void
  title?: string
  visible: boolean
}> = ({ visible, onDismiss, isPresentedModally, modalTitle, title, modalContent }) => {
  const space = useSpace()
  const color = useColor()
  const { height: screenHeight, safeAreaInsets } = useScreenDimensions()

  const containerComponent = useMemo(() => {
    if (Platform.OS === "ios") {
      return ({ children }: { children?: React.ReactNode }) => (
        <FullWindowOverlay>{children}</FullWindowOverlay>
      )
    }

    if (Platform.OS === "android" && isPresentedModally) {
      return ({ children }: { children?: React.ReactNode }) => (
        <Modal visible={visible} transparent statusBarTranslucent>
          {children}
        </Modal>
      )
    }

    return undefined
  }, [visible, isPresentedModally])

  // Calculate the max height of the content within the bottom sheet
  const MAX_CONTENT_HEIGHT = screenHeight - safeAreaInsets.top - safeAreaInsets.bottom - space(1)

  return (
    <AutoHeightBottomSheet
      visible={visible}
      onDismiss={onDismiss}
      containerComponent={containerComponent}
      handleIndicatorStyle={
        // Inside modals, the gesture detector is not working on Android.
        // This is a workaround to make to hide it
        Platform.OS === "android" && isPresentedModally
          ? {
              backgroundColor: color("mono0"),
            }
          : undefined
      }
    >
      <SafeAreaView
        edges={["bottom", "top"]}
        style={Platform.OS === "ios" ? { paddingBottom: space(2) } : {}}
      >
        <Flex maxHeight={MAX_CONTENT_HEIGHT}>
          <Text mx={2} variant="lg-display">
            {modalTitle ?? title}
          </Text>

          <Spacer y={2} />

          <ScrollView contentContainerStyle={{ paddingHorizontal: space(2) }}>
            {modalContent}
          </ScrollView>

          <Spacer y={2} />

          <Flex px={2}>
            <Button variant="outline" block onPress={onDismiss}>
              Close
            </Button>
          </Flex>
        </Flex>
      </SafeAreaView>
    </AutoHeightBottomSheet>
  )
}
